import { useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/models/util";

interface Props {
  subtotal?: number;
}

export default function CartSummary({ subtotal }: Props) {
  const { cart } = useAppSelector((state) => state.cart);
  if (subtotal === undefined)
    subtotal = cart?.items.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;

  const deliveryFee = subtotal > 10000 ? 0 : 500;

  return (
    <div className="space-y-4 rounded-md border border-gray-200 p-4 shadow">
    <div className="flex justify-between text-base font-medium text-gray-900">
        <p>Subtotal</p>
        <p>{currencyFormat(subtotal)}</p>
    </div>
    <div className="flex justify-between text-base font-medium text-gray-900">
        <p>Delivery fee*</p>
        <p>{currencyFormat(deliveryFee)}</p>
    </div>
    <div className="flex justify-between text-base font-medium text-gray-900">
        <p>Total</p>
        <p>{currencyFormat(subtotal + deliveryFee)}</p>
    </div>
    <p className="text-sm italic text-gray-500">
        *Orders over $100 qualify for free delivery
    </p>
    </div>
  );
}
