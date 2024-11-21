import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { clearCart } from "../cart/cartSlice";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeElementType } from "@stripe/stripe-js";

const steps = ["Shipping Address", "Review", "Payment Details"];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [cardState, setCardState] = useState<{elementError: {[key in StripeElementType]?: string}}>({elementError: {}})
  const [cardComplete, setCardComplete] = useState<any>({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const { cart } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();

  function onCardInputChange(event: any) {
    setCardState({
      ...cardState,
      elementError: {
        ...cardState.elementError,
        [event.elementType]: event.error?.message,
      },
    });
    setCardComplete({ ...cardComplete, [event.elementType]: event.complete });
  }

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <Review />;
      case 2:
        return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange} />;
      default:
        throw new Error("Unknown step");
    }
  }

  const currentValidationSchema = validationSchema[activeStep];

  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(currentValidationSchema),
  });

  useEffect(() => {
    agent.Account.fetchAddress().then((response) => {
      if (response) {
        methods.reset({
          ...methods.getValues(),
          ...response,
          saveAddress: false,
        });
      }
    });
  }, [methods]);

  async function submitOrder(data: FieldValues) {
    const { nameOnCard, saveAddress, ...shippingAddress } = data;
    if (!stripe || !elements) return; // Stripe is not ready
    try {
      const cardElement = elements.getElement(CardNumberElement);
      const paymentResult = await stripe.confirmCardPayment(cart?.clientSecret!, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: nameOnCard,
          },
        },
      });
      if (paymentResult.paymentIntent?.status === "succeeded") {
        const orderNumber = await agent.Orders.create({ saveAddress, shippingAddress });
        setOrderNumber(orderNumber);
        setPaymentSucceeded(true);
        setPaymentMessage("Thank you. We have received your payment.");
        setActiveStep(activeStep + 1);
        dispatch(clearCart());
      } else {
        setPaymentMessage(paymentResult.error?.message!);
        setPaymentSucceeded(false);
        setActiveStep(activeStep + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleNext = async (data: FieldValues) => {
    if (activeStep === steps.length - 1) {
      await submitOrder(data);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function submitDisabled(): boolean {
    if (activeStep === steps.length - 1) {
      return (
        !cardComplete.cardCvc ||
        !cardComplete.cardExpiry ||
        !cardComplete.cardNumber ||
        !methods.formState.isValid
      );
    } else {
      return !methods.formState.isValid;
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-[50%] mx-auto bg-white rounded-md p-6 shadow mt-8">
        <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>
        <div className="flex items-center justify-between mb-6">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`flex items-center gap-2 ${
                index === activeStep
                  ? "text-blue-500 font-bold"
                  : index < activeStep
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              {index < activeStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <div className={`h-5 w-5 rounded-full ${index === activeStep ? "bg-blue-500" : "bg-gray-300"}`}></div>
              )}
              <span>{label}</span>
              {index !== steps.length - 1 && (
                <span className="flex-grow border-t border-gray-300 mx-2"></span>
              )}
            </div>
          ))}
        </div>
        {activeStep === steps.length ? (
          <>
            <h2 className="text-lg font-medium">{paymentMessage}</h2>
            {paymentSucceeded ? (
              <p className="text-gray-600">
                Your order number is #{orderNumber}. We have emailed your order confirmation and will send you an update
                when your order has shipped.
              </p>
            ) : (
              <button
                className="mt-4 rounded-md bg-gray-800 text-white px-4 py-2 hover:bg-gray-700"
                onClick={handleBack}
              >
                Go back and try again
              </button>
            )}
          </>
        ) : (
          <form onSubmit={methods.handleSubmit(handleNext)}>
            {getStepContent(activeStep)}
            <div className="flex justify-between mt-6">
              {activeStep !== 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100 flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={submitDisabled()}
                className={`rounded-md px-4 py-2 flex items-center gap-1 ml-auto ${
                  submitDisabled()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {activeStep === steps.length - 1 ? "Place Order" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </FormProvider>
  );
}
