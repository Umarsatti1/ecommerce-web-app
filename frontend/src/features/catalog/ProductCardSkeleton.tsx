import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductCardSkeleton() {
    return (
        <div className="relative flex flex-col items-center border rounded-lg overflow-hidden bg-white shadow h-full max-w-[75%] mx-auto">
            {/* Skeleton for Product Image */}
            <div className="w-full h-[225px] bg-gray-100"> {/* Reduced height */}
                <Skeleton height="100%" width="100%" />
            </div>

            {/* Skeleton for Product Info */}
            <div className="p-3 text-center w-full">
                {/* Placeholder for Category */}
                <Skeleton className="mb-1" height={14} width="30%" />

                {/* Placeholder for Star Ratings */}
                <div className="flex justify-center mb-1 space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} height={12} width={12} circle />
                    ))}
                </div>

                {/* Placeholder for Product Name */}
                <Skeleton className="mb-1" height={18} width="70%" />

                {/* Placeholder for Brand */}
                <Skeleton className="mb-1" height={14} width="30%" />

                {/* Placeholder for Price */}
                <Skeleton className="mb-3" height={18} width="40%" />

                {/* Skeletons for Buttons */}
                <div className="flex justify-center space-x-4">
                    <Skeleton height={28} width="35%" borderRadius={4} />
                    <Skeleton height={28} width="25%" borderRadius={4} />
                </div>
            </div>
        </div>
    );
}
