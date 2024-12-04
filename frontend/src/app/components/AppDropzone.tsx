import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {}

export default function AppDropzone(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: null });

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      acceptedFiles[0] = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
      field.onChange(acceptedFiles[0]);
    },
    [field]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer flex flex-col justify-center items-center border-2 border-dashed rounded-lg p-6 ${
        isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
      }`}
      style={{ width: "200px", height: "200px" }} // Adjust size of the dropzone
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
        <p className="text-sm text-gray-500">
          Drag and drop a file here, or click to select a file.
        </p>
        <p className="mt-1 text-xs text-gray-400">Max size: 2MB</p>
        {fieldState.error && (
          <p className="mt-2 text-sm text-red-500">{fieldState.error.message}</p>
        )}
      </div>
    </div>
  );
}