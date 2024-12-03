import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";

export default function AddressForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center py-6">
        Shipping Address
      </h2>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-6 max-w-2xl w-full">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
            <AppTextInput
              control={control}
              name="firstName"
              label="First name"
              required
            />
            <AppTextInput
              control={control}
              name="lastName"
              label="Last name"
              required
            />
          </div>

          {/* Address Line 1 */}
          <AppTextInput
            control={control}
            name="address1"
            label="Address Line 1"
            required
          />

          {/* Address Line 2 */}
          <AppTextInput
            control={control}
            name="address2"
            label="Address Line 2"
          />

          {/* City and State */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
            <AppTextInput
              control={control}
              name="city"
              label="City"
              required
            />
            <AppTextInput
              control={control}
              name="state"
              label="State"
              required
            />
          </div>

          {/* Zip/Postal Code and Country */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
            <AppTextInput
              control={control}
              name="zip"
              label="Zip / Postal code"
              required
            />
            <AppTextInput
              control={control}
              name="country"
              label="Country"
              required
            />
          </div>

          {/* Checkbox */}
          <AppCheckbox
            disabled={false}
            name="saveAddress"
            label="Use this address for payment details"
            control={control}
          />
        </div>
      </div>
    </div>
  );
}
