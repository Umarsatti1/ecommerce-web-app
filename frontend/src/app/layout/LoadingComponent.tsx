interface Props {
    message?: string;
  }
  
  export default function LoadingComponent({ message = "Loading..." }: Props) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
  
          {/* Loading Message */}
          <p className="mt-4 pb-40 text-xl font-medium text-blue-500">{message}</p>
        </div>
      </div>
    );
  }
  