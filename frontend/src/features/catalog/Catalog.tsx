import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setPageNumber, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import AppPagination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";
import CheckboxDropdown from "../../app/components/CheckboxButtons";
import SortDropdown from "../../app/components/RadioButtonGroup";
import { Container } from "@mui/material";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to Low" },
  { value: "price", label: "Price - Low to High" },
];

export default function Catalog() {
  const { products, brands, types, filtersLoaded, metaData } = useProducts();
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;

  return (
    <>
      {/* Page Heading */}
      <div className="w-full bg-gray-100 py-6">
        <h1 className="text-center text-4xl font-semibold text-gray-800">Shop All Products</h1>
      </div>

      <Container>
        <div className="container mx-auto mt-8 mb-10 px-4">
          {/* Sort Dropdown */}
          <div className="mb-6 flex justify-end pr-3">
            <SortDropdown
              options={sortOptions}
              selectedValue={productParams.orderBy}
              onChange={(value) => dispatch(setProductParams({ orderBy: value }))}
            />
          </div>

          {/* Filters and Products */}
          <div className="flex gap-6">
            {/* Filters */}
            <div className="w-1/4">
              <ProductSearch />
              <div className="mt-6 mb-6">
                <CheckboxDropdown
                  title="BRANDS"
                  items={brands}
                  checked={productParams.brands}
                  onChange={(items: string[]) => dispatch(setProductParams({ brands: items }))}
                />
              </div>
              <div className="mb-6">
                <CheckboxDropdown
                  title="TYPE"
                  items={types}
                  checked={productParams.types}
                  onChange={(items: string[]) => dispatch(setProductParams({ types: items }))}
                />
              </div>
            </div>

            {/* Product List */}
            <div className="w-3/4">
              <ProductList products={products} />
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-end pr-3 pb-8">
            {metaData && (
              <AppPagination
                metaData={metaData}
                onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
