import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SmallLoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 text-gray-600" />
    </div>
  );
}
