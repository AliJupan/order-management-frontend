export const OrderStatus = {
    0: { label: "Pending", color: "warning" },
    1: { label: "Processing", color: "info" },
    2: { label: "Shipped", color: "primary" },
    3: { label: "Delivered", color: "success" },
    4: { label: "Cancelled", color: "error" },
    5: { label: "Returned", color: "default" },
};

export const PaidStatus = {
    0: { label: "Unpaid", color: "error" },
    1: { label: "Partially Paid", color: "warning" },
    2: { label: "Paid", color: "success" },
    3: { label: "Refunded", color: "default" },
};

export const OrderType = {
    1: { label: "Sale", color: "primary" },
    0: { label: "Purchase", color: "secondary" },
}