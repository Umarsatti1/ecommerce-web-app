import { ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../app/models/product';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { addCartItemAsync } from '../cart/cartSlice';
import { currencyFormat } from '../../app/util/util';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { status } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/catalog/${product.id}`);
    };

    return (
        <div
            className="group relative border rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition-shadow max-w-[90%] mx-auto cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Product Image with Navigation */}
            <div className="relative overflow-hidden bg-gray-100 h-[225px] cursor-pointer" onClick={handleCardClick}>
                <img
                    src={product.pictureUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-3 transition-transform group-hover:scale-105"
                />

                {/* Add to Cart Overlay */}
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()} // Prevents navigation on button click
                >
                    <button
                        onClick={() => dispatch(addCartItemAsync({ productId: product.id }))}
                        className="flex items-center gap-2 bg-black text-white px-3 py-2.5 rounded-md text-xs font-medium transition-colors hover:bg-gray-800"
                        style={{ fontSize: '0.95rem' }}
                        disabled={status.includes('pendingAddItem' + product.id)}
                    >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {status.includes('pendingAddItem' + product.id) ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-3 text-center">
                <p className="mb-1 text-xs text-gray-500">{product.type}</p>
                <div className="mb-1 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-3 w-3 ${
                                i < (product.rating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                            }`}
                        />
                    ))}
                </div>
                <h3 className="mb-1 text-sm font-medium">{product.name}</h3>
                <div className="mb-1 text-xs text-gray-500">{product.brand}</div>
                <div className="mb-3 text-sm font-medium">
                    {currencyFormat(product.price)}
                </div>
            </div>
        </div>
    );
}
