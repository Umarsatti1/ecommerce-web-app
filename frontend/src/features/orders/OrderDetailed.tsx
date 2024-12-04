import { Container } from "@mui/material";
import { CartItem } from "../../app/models/cart";
import { Order } from "../../app/models/order";
import CartSummary from "../cart/CartSummary";
import CartTable from "../cart/CartTable";

interface Props {
  order: Order;
  setSelectedOrder: (id: number) => void;
}

export default function OrderDetailed({ order, setSelectedOrder }: Props) {
  const subtotal =
    order.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;

  return (
    <Container>
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Order# {order.id} - {order.orderStatus}
        </h2>
        <button
          onClick={() => setSelectedOrder(0)}
          className="px-6 py-2 text-white bg-black rounded-md hover:bg-gray-800"
        >
          Back to Orders
        </button>
      </div>

      {/* Cart Table */}
      <CartTable items={order.orderItems as CartItem[]} isCart={false} />

      {/* Divider */}
      <div className="my-8 border-t border-gray-200"></div>

      {/* Cart Summary Section */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
    </Container>
  );
}
