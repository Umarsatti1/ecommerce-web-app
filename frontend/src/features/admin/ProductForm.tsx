import { FieldValues, useForm } from "react-hook-form";
import { useEffect } from "react";
import AppTextInput from "../../app/components/AppTextInput";
import AppSelectList from "../../app/components/AppSelectList";
import AppDropzone from "../../app/components/AppDropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./productValidation";
import api from "../../app/api/api";
import { useAppDispatch } from "../../app/store/configureStore";
import { setProduct } from "../catalog/catalogSlice";
import useProducts from "../../app/hooks/useProducts";
import { Product } from "../../app/models/product";
import { Container } from "@mui/material";

interface Props {
  product?: Product;
  cancelEdit: () => void;
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const { brands, types } = useProducts();
  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (product && !watchFile && !isDirty) reset(product);
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [product, reset, watchFile, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Product;
      if (product) {
        response = await api.Admin.updateProduct(data);
      } else {
        response = await api.Admin.createProduct(data);
      }
      dispatch(setProduct(response));
      cancelEdit();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Product Details</h2>
      <form onSubmit={handleSubmit(handleSubmitData)} className="space-y-6">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name and Price */}
          <AppTextInput control={control} name="name" label="Product Name" />
          <AppTextInput
            type="number"
            control={control}
            name="price"
            label="Price"
          />
          {/* Brand and Type */}
          <AppSelectList
            control={control}
            name="brand"
            label="Brand"
            items={brands}
          />
          <AppSelectList
            control={control}
            name="type"
            label="Type"
            items={types}
          />
        </div>

        {/* Quantity in Stock */}
        <div>
          <AppTextInput
            type="number"
            control={control}
            name="quantityInStock"
            label="Quantity in Stock"
          />
        </div>

        {/* Description */}
        <div>
          <AppTextInput
            multiline
            rows={4}
            control={control}
            name="description"
            label="Description"
          />
        </div>

        {/* Dropzone and Image Preview */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <AppDropzone control={control} name="file" />
          {watchFile ? (
            <img
              src={watchFile.preview}
              alt="preview"
              className="max-h-40 max-w-40 border border-gray-200 rounded-md shadow"
            />
          ) : product?.pictureUrl ? (
            <img
              src={product.pictureUrl}
              alt={product.name}
              className="max-h-40 max-w-40 border border-gray-200 rounded-md shadow"
            />
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={cancelEdit}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
    </Container>
  );
}