import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function LoadingSpinner({ message = "Loading…" }: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center w-full bg-white h-screen"
      role="status"
      aria-live="polite"
    >
      <AiOutlineLoading3Quarters className="animate-spin h-8 w-8 text-[var(--color-brand)] mb-4" />
      <p className="text-gray-500 text-base font-medium">{message}</p>
    </div>
  );
}
