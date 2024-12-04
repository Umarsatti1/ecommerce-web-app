import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addCartItemAsync, removeCartItemAsync } from "../cart/cartSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NotFound from "../../app/errors/NotFound";
import { Container } from "@mui/material";

export default function ProductDetails() {
  const { cart, status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id) : undefined;
  const product = useAppSelector((state) =>
    productSelectors.selectById(state, numericId!)
  );
  const { status: productStatus } = useAppSelector((state) => state.catalog);
  const [quantity, setQuantity] = useState(0);
  const item = cart?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product && numericId) dispatch(fetchProductAsync(numericId));
  }, [numericId, item, dispatch, product]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const inputQuantity = parseInt(event.currentTarget.value);
    if (inputQuantity >= 0) setQuantity(inputQuantity);
  }

  function handleUpdateCart() {
    if (!product) return;
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      dispatch(addCartItemAsync({ productId: product?.id!, quantity: updatedQuantity }));
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(removeCartItemAsync({ productId: product?.id!, quantity: updatedQuantity }));
    }
  }

  if (productStatus.includes("pending"))
    return <LoadingComponent message="Loading product..." />;

  if (!product) return <NotFound />;

  return (
    <Container>
        <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Section: Product Image */}
                <div className="flex justify-center">
                <img
                    src={product.pictureUrl}
                    alt={product.name}
                    className="w-full max-w-md object-contain rounded-lg shadow"
                />
                </div>

                {/* Right Section: Product Details */}
                <div className="space-y-6">
                {/* Product Name */}
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

                {/* Price */}
                <p className="text-2xl font-semibold text-blue-500">
                    ${(product.price / 100).toFixed(2)}
                </p>

                {/* Description */}
                <p className="text-gray-700">{product.description}</p>

                {/* Brand and Type */}
                <div className="flex gap-4">
                    <p className="text-gray-600">
                    <strong>Brand:</strong> {product.brand}
                    </p>
                    <p className="text-gray-600">
                    <strong>Type:</strong> {product.type}
                    </p>
                </div>

                {/* Quantity in Stock */}
                <p className="text-gray-600">
                    <strong>Quantity in Stock:</strong> {product.quantityInStock}
                </p>

                {/* Quantity in Cart */}
                <div className="flex items-center gap-4">
                    <label className="text-gray-700 font-medium" htmlFor="quantity">
                    Quantity in Cart:
                    </label>
                    <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    className="w-16 rounded-md border border-gray-300 px-2 py-1 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Add to Cart / Update Cart Button */}
                <button
                    onClick={handleUpdateCart}
                    disabled={
                    item?.quantity === quantity ||
                    (!item && quantity === 0) ||
                    status.includes("pending")
                    }
                    className={`w-1/2 py-3 px-4 text-lg font-semibold text-white rounded-md shadow ${
                    item
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-black hover:bg-gray-800"
                    } ${
                    item?.quantity === quantity ||
                    (!item && quantity === 0) ||
                    status.includes("pending")
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                >
                    {item ? "Update Quantity" : "Add to Cart"}
                </button>
                </div>
            </div>
        </div>
    </Container>
  );
}