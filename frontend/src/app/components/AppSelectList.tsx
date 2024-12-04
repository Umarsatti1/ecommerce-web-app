import { useController, UseControllerProps } from 'react-hook-form';

interface Props extends UseControllerProps {
  label: string;
  items: string[];
}

export default function AppSelectList({ label, items, ...props }: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: '' });

  return (
    <div className="w-full">
      <label className="text-base font-normal text-gray-500">{label}</label>
      <select
        {...field}
        value={field.value || ''} // Ensure the value is initialized
        onChange={(e) => field.onChange(e.target.value)} // Update the value correctly
        className={`mt-1 block w-full rounded-md border ${
          fieldState.error ? 'border-red-500' : 'border-gray-300'
        } bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      {fieldState.error && (
        <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
}
