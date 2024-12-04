import { useState } from "react";
import { Product } from "../../app/models/product";
import { currencyFormat } from "../../app/util/util";
import useProducts from "../../app/hooks/useProducts";
import AppPagination from "../../app/components/AppPagination";
import { useAppDispatch } from "../../app/store/configureStore";
import { removeProduct, setPageNumber } from "../catalog/catalogSlice";
import ProductForm from "./ProductForm";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import api from "../../app/api/api";

export default function Inventory() {
  const { products, metaData } = useProducts();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const [, setLoading] = useState(false);
  const [, setTarget] = useState(0);

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setEditMode(true);
  }

  function handleDeleteProduct(id: number) {
    setLoading(true);
    setTarget(id);
    api.Admin.deleteProduct(id)
      .then(() => dispatch(removeProduct(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selectedProduct) setSelectedProduct(undefined);
    setEditMode(false);
  }

  if (editMode)
    return <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <button
          onClick={() => setEditMode(true)}
          className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none"
        >
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-4">No.</th>
              <th scope="col" className="px-6 py-4">Product</th>
              <th scope="col" className="px-6 py-4 text-right">Price</th>
              <th scope="col" className="px-6 py-4 text-center">Type</th>
              <th scope="col" className="px-6 py-4 text-center">Brand</th>
              <th scope="col" className="px-6 py-4 text-center">Quantity</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.id}
                </td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={product.pictureUrl}
                    alt={product.name}
                    className="h-10 w-10 rounded-md"
                  />
                  {product.name}
                </td>
                <td className="px-6 py-4 text-right">
                  {currencyFormat(product.price)}
                </td>
                <td className="px-6 py-4 text-center">{product.type}</td>
                <td className="px-6 py-4 text-center">{product.brand}</td>
                <td className="px-6 py-4 text-center">
                  {product.quantityInStock}
                </td>
                <td className="px-6 py-6 text-right flex items-center justify-end gap-4">
                  <button
                    onClick={() => handleSelectProduct(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {metaData && (
        <div className="mt-8">
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          />
        </div>
      )}
    </div>
  );
}
