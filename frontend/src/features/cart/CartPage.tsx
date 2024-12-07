import CartSummary from "./CartSummary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import CartTable from "./CartTable";

export default function CartPage() {
  const { cart } = useAppSelector((state) => state.cart);

  if (!cart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <img
          src="/images/emptycart.png"
          alt="Empty Cart"
          className="w-64 h-64 mb-6"
        />
        <h3 className="mb-4 text-2xl font-semibold text-gray-900">
          Your Cart is Empty!
        </h3>
        <Link
          to="/"
          className="px-6 py-3 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Shopping Cart
      </h1>
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