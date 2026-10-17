export const OrderStatus = {
  Pending: { value: 0, label: "Pending", color: "warning" },
  Processing: { value: 1, label: "Processing", color: "info" },
  Shipped: { value: 2, label: "Shipped", color: "primary" },
  Delivered: { value: 3, label: "Delivered", color: "success" },
  Cancelled: { value: 4, label: "Cancelled", color: "error" },
  Returned: { value: 5, label: "Returned", color: "default" },
};

export const PaidStatus = {
  Unpaid: { value: 0, label: "Unpaid", color: "error" },
  PartiallyPaid: { value: 1, label: "Partially Paid", color: "warning" },
  Paid: { value: 2, label: "Paid", color: "success" },
  Refunded: { value: 3, label: "Refunded", color: "default" },
};

export const OrderType = {
  Sale: { value: 1, label: "Sale", color: "primary" },
  Purchase: { value: 0, label: "Purchase", color: "secondary" },
};
