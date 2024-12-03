import CartSummary from "./CartSummary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import CartTable from "./CartTable";

export default function CartPage() {
  const { cart } = useAppSelector((state) => state.cart);

  if (!cart) return <h3 className="text-2xl font-semibold text-gray-900">Your cart is empty</h3>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
      <div className="mt-12">
        <CartTable items={cart.items} />
        <div className="mt-10 flex flex-col gap-4">
          <CartSummary />
          <Link
            to="/checkout"
            className="w-full rounded-md bg-indigo-600 px-6 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Checkout
          </Link>
          <p className="text-center text-sm text-gray-500">
            or{" "}
            <Link
              to="/catalog"
              className="font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center"
            >
              Continue Shopping
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
