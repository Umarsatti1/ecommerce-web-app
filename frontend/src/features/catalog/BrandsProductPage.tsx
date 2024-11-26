import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsByBrandAsync, productSelectors } from "./catalogSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";
import ProductCard from "./ProductCard";

export default function BrandProductsPage() {
  const { brand } = useParams<{ brand: string }>();
  const dispatch = useAppDispatch();
  const products = useAppSelector(productSelectors.selectAll);
  const { status } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (brand) {
      dispatch(fetchProductsByBrandAsync(brand));
    }
  }, [dispatch, brand]);

  if (status === "pendingFetchProductsByBrand")
    return <LoadingComponent message={`Loading products for ${brand}...`} />;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Products by Brand: {brand}</h1>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found for the brand "{brand}".</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
