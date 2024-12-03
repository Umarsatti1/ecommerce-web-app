import { useAppSelector } from '../../app/store/configureStore';
import CartSummary from '../cart/CartSummary';
import CartTable from '../cart/CartTable';

export default function Review() {
  const { cart } = useAppSelector((state) => state.cart);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      {/* Cart Table */}
      {cart && <CartTable items={cart.items} isCart={false} />}

      {/* Cart Summary */}
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-md">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
