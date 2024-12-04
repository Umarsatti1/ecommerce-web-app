import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductCardSkeleton() {
    return (
        <div className="relative flex flex-col border overflow-hidden bg-white shadow h-full max-w-[90%] mx-auto">
            {/* Skeleton for Product Image */}
            <div className="w-full h-[225px] bg-gray-100">
                <Skeleton height="100%" width="100%" />
            </div>

            {/* Skeleton for Product Info */}
            <div className="p-4 text-center">
                {/* Placeholder for Product Name */}
                <Skeleton className="mb-2" height={20} width="70%" />

                {/* Placeholder for Price */}
                <Skeleton height={18} width="40%" />
            </div>
        </div>
    );
}
