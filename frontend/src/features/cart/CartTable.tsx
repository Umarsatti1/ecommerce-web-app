import { Trash2, Plus, Minus, Loader } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { removeCartItemAsync, addCartItemAsync } from "./cartSlice";
import { CartItem } from "../../app/models/cart";

interface Props {
  items: CartItem[];
  isCart?: boolean;
}

export default function CartTable({ items, isCart = true }: Props) {
  const { status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  return (
    <div className="border-t border-gray-200">
      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li 
            key={item.productId} 
            className={`flex py-6 ${index === items.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            {/* Product Image */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={item.pictureUrl}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Product Details */}
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>{item.name}</h3>
                  <p>${((item.price / 100) * item.quantity).toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
              </div>

              {/* Quantity Controls and Remove */}
              <div className="flex flex-1 items-end justify-between text-sm">
                <div className="flex items-center gap-2">
                  {isCart && (
                    <>
                      {/* Decrease Quantity Button */}
                      <button
                        onClick={() =>
                          dispatch(
                            removeCartItemAsync({
                              productId: item.productId,
                              quantity: 1,
                            })
                          )
                        }
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 hover:bg-gray-100 flex items-center justify-center"
                        disabled={
                          status === `pendingRemoveItem${item.productId}rem`
                        }
                      >
                        {status === `pendingRemoveItem${item.productId}rem` ? (
                          <Loader className="h-4 w-4 animate-spin text-gray-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-600" />
                        )}
                      </button>

                      {/* Quantity Display */}
                      <p className="w-8 text-center">{item.quantity}</p>

                      {/* Increase Quantity Button */}
                      <button
                        onClick={() =>
                          dispatch(
                            addCartItemAsync({
                              productId: item.productId,
                            })
                          )
                        }
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 hover:bg-gray-100 flex items-center justify-center"
                        disabled={
                          status === `pendingAddItem${item.productId}`
                        }
                      >
                        {status === `pendingAddItem${item.productId}` ? (
                          <Loader className="h-4 w-4 animate-spin text-gray-600" />
                        ) : (
                          <Plus className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* Remove Button */}
                {isCart && (
                  <button
                    onClick={() =>
                      dispatch(
                        removeCartItemAsync({
                          productId: item.productId,
                          quantity: item.quantity,
                        })
                      )
                    }
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    disabled={
                      status === `pendingRemoveItem${item.productId}del`
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}