import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { StripeElementType } from "@stripe/stripe-js";
import { StripeInput } from "./StripeInput";
import { useState } from "react";

interface Props {
  cardState: { elementError: { [key in StripeElementType]?: string } };
  onCardInputChange: (event: any) => void;
}

export default function PaymentForm({ cardState, onCardInputChange }: Props) {
  const { control } = useFormContext();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const inputStyles = (isFocused: boolean, hasError: boolean) =>
    `w-full rounded-md border px-3 py-2.5 text-gray-900 placeholder:text-gray-400 ${
      hasError
        ? "border-red-500"
        : isFocused
        ? "border-blue-500 ring-1 ring-blue-500"
        : "border-gray-300"
    } focus:outline-none h-10`;

  const stripeInputOptions = {
    cardNumber: {
      placeholder: "0000 0000 0000 0000",
    },
    cardExpiry: {
      placeholder: "MM/YY",
    },
    cardCvc: {
      placeholder: "123",
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {/* Name on Card */}
        <AppTextInput
          name="nameOnCard"
          label="Name on Card"
          control={control}
          required
        />

        {/* Card Number */}
        <div className="flex flex-col gap-2 text-sm">
          <label className="text-base font-normal text-gray-500" htmlFor="cardNumber">
            Card Number
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div
            id="cardNumber"
            className={inputStyles(
              focusedField === "cardNumber",
              !!cardState.elementError.cardNumber
            )}
          >
            <StripeInput
              component={CardNumberElement}
              options={stripeInputOptions.cardNumber}
              onChange={onCardInputChange}
              onFocus={() => setFocusedField("cardNumber")}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          {cardState.elementError.cardNumber && (
            <p className="text-sm text-red-500">{cardState.elementError.cardNumber}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-normal text-gray-500" htmlFor="expDate">
            Expiration Date
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div
            id="expDate"
            className={inputStyles(
              focusedField === "expDate",
              !!cardState.elementError.cardExpiry
            )}
          >
            <StripeInput
              component={CardExpiryElement}
              options={stripeInputOptions.cardExpiry}
              onChange={onCardInputChange}
              onFocus={() => setFocusedField("expDate")}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          {cardState.elementError.cardExpiry && (
            <p className="text-sm text-red-500">{cardState.elementError.cardExpiry}</p>
          )}
        </div>

        {/* CVV */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-normal text-gray-500" htmlFor="cvv">
            CVV
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div
            id="cvv"
            className={inputStyles(
              focusedField === "cvv",
              !!cardState.elementError.cardCvc
            )}
          >
            <StripeInput
              component={CardCvcElement}
              options={stripeInputOptions.cardCvc}
              onChange={onCardInputChange}
              onFocus={() => setFocusedField("cvv")}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          {cardState.elementError.cardCvc && (
            <p className="text-sm text-red-500">{cardState.elementError.cardCvc}</p>
          )}
        </div>
      </div>
    </div>
  );
}
