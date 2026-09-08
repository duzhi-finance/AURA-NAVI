export default function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-full bg-accent text-accent-contrast text-sm px-5 py-2.5 shadow-lg transition-all duration-200 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
