import { useState, useCallback, useMemo } from "react";
import ordersApi from "../../api/ordersApi.js";
import productsApi from "../../api/productsApi.js";

const emptyItem = () => ({
  productId: null,
  barcode: "",
  name: "",
  quantity: 1,
  unitPrice: 0,
  maxQuantity: 1,
});

export default function useOrderForm() {
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);
  const [pendingBarcode, setPendingBarcode] = useState("");

  const [customerId, setCustomerId] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [totalPaid, setTotalPaid] = useState(0);
  const [items, setItems] = useState([]);

  const [orderType, setOrderType] = useState("Sale");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [barcodeLoading, setBarcodeLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
    [items],
  );

  const orderTotal = useMemo(
    () => subTotal - (subTotal * discountPercentage) / 100,
    [subTotal, discountPercentage],
  );

  const addProductToItems = useCallback(
    (product, barcode) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === product.id);
        if (existingIndex !== -1) {
          const next = [...prev];
          const current = next[existingIndex];
          next[existingIndex] = {
            ...current,
            quantity:
              orderType === "Sale"
                ? Math.min(current.quantity + 1, current.maxQuantity)
                : current.quantity + 1,
          };
          return next;
        }
        return [
          ...prev,
          {
            productId: product.id,
            barcode: product.barcode ?? barcode,
            name: product.name,
            quantity: 1,
            unitPrice: product.unitPrice ?? product.price ?? 0,
            maxQuantity: product.quantity ?? 1,
          },
        ];
      });
    },
    [orderType],
  );

  // Looks up a product by barcode and adds it to the items list,
  // or bumps quantity by 1 if that product is already in the list.
  const addItemByBarcode = useCallback(
    async (rawBarcode) => {
      const barcode = (rawBarcode ?? barcodeInput).trim();
      if (!barcode) return;

      setBarcodeError("");
      setBarcodeLoading(true);
      try {
        const product = await productsApi.getByBarcode(barcode);
        addProductToItems(product, barcode);
        setBarcodeInput("");
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setPendingBarcode(barcode);
          setNewProductDialogOpen(true);
        } else {
          setBarcodeError("Couldn't look up that barcode. Try again.");
        }
      } finally {
        setBarcodeLoading(false);
      }
    },
    [barcodeInput, addProductToItems],
  );

  const closeNewProductDialog = useCallback(() => {
    setNewProductDialogOpen(false);
    setPendingBarcode("");
  }, []);

  const handleNewProductCreated = useCallback(
    (product) => {
      addProductToItems(product, pendingBarcode);
      setBarcodeInput("");
      closeNewProductDialog();
    },
    [addProductToItems, pendingBarcode, closeNewProductDialog],
  );

  const updateItemQuantity = useCallback(
    (productId, quantity) => {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId
            ? {
                ...i,
                quantity:
                  orderType === "Sale"
                    ? Math.min(
                        Math.max(1, Number(quantity) || 1),
                        i.maxQuantity,
                      )
                    : Math.max(1, Number(quantity) || 1),
              }
            : i,
        ),
      );
    },
    [orderType],
  );

  const updateItemUnitPrice = useCallback((productId, unitPrice) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, unitPrice: Math.max(0, Number(unitPrice) || 0) }
          : i,
      ),
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const reset = useCallback(() => {
    setCustomerId(null);
    setDueDate("");
    setTotalPaid(0);
    setItems([]);
    setOrderType("Sale");
    setDiscountPercentage(0);
    setBarcodeInput("");
    setBarcodeError("");
    setSubmitError("");
    closeNewProductDialog();
  }, [closeNewProductDialog]);

  const validate = () => {
    if (!customerId) return "Select a customer before saving the order.";
    if (!dueDate) return "Set a due date for the order.";
    if (items.length === 0) return "Scan or add at least one product.";
    if (discountPercentage < 0 || discountPercentage > 100)
      return "Discount must be between 0 and 100.";
    return "";
  };

  const submit = useCallback(async () => {
    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return { success: false };
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        CustomerId: customerId,
        OrderType: orderType,
        DiscountPercentage: Number(discountPercentage) || 0,
        TotalPaid: Number(totalPaid) || 0,
        DueDate: new Date(dueDate).toISOString(),
        OrderItems: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      };
      const created = await ordersApi.createOrder(payload);
      reset();
      return { success: true, order: created };
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ?? "Couldn't save the order. Try again.",
      );
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  }, [
    customerId,
    orderType,
    discountPercentage,
    dueDate,
    totalPaid,
    items,
    reset,
  ]);

  return {
    customerId,
    setCustomerId,
    dueDate,
    setDueDate,
    totalPaid,
    setTotalPaid,
    orderType,
    setOrderType,
    discountPercentage,
    setDiscountPercentage,
    items,
    subTotal,
    orderTotal,
    barcodeInput,
    setBarcodeInput,
    barcodeError,
    barcodeLoading,
    addItemByBarcode,
    updateItemQuantity,
    updateItemUnitPrice,
    removeItem,
    submitting,
    submitError,
    submit,
    newProductDialogOpen,
    pendingBarcode,
    handleNewProductCreated,
    closeNewProductDialog,
  };
}
