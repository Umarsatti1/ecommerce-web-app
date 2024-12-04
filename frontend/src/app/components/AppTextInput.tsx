import { useController, UseControllerProps } from "react-hook-form";
import * as Label from "@radix-ui/react-label";

interface Props extends UseControllerProps {
  label: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  required?: boolean;
}

export default function AppTextInput(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: "" });

  return (
    <div className="flex flex-col gap-2">
      <Label.Root className="text-base font-normal text-gray-500">
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </Label.Root>
      {props.multiline ? (
        <textarea
          {...field}
          rows={props.rows || 4}
          className={`w-full rounded-md border  ${
            fieldState.error ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-gray-900 placeholder:text-gray-400 
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
        />
      ) : (
        <input
          {...field}
          type={props.type || "text"}
          className={`w-full rounded-md border ${
            fieldState.error ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-gray-800 placeholder:text-gray-400 
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none h-10`}
        />
      )}
      {fieldState.error && (
        <p className="text-sm text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
}
