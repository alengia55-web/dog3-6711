import { useEffect, useRef, useState } from "react";
import { useAdminText } from "../../queries/admin";

/**
 * Two-step delete button. Native confirm() dialogs are suppressed inside
 * embedded previews, so the confirmation lives in the button itself:
 * first click arms it, second click (within 5s) runs the action.
 */
export function ConfirmButton({
  label,
  title,
  onConfirm,
  className = "",
  children,
}: {
  label: string;
  title: string;
  onConfirm: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const { a } = useAdminText();
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const arm = () => {
    setArmed(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setArmed(false), 5000);
  };

  if (armed) {
    return (
      <span className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => {
            if (timer.current) clearTimeout(timer.current);
            setArmed(false);
            onConfirm();
          }}
          className="comic-btn bg-pink-deep px-3 py-2 text-xs font-bold whitespace-nowrap"
        >
          {a.common.confirm}
        </button>
        <button
          type="button"
          onClick={() => {
            if (timer.current) clearTimeout(timer.current);
            setArmed(false);
          }}
          className="comic-btn bg-paper px-3 py-2 text-xs whitespace-nowrap"
        >
          {a.common.cancel}
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      onClick={arm}
      className={className}
    >
      {children}
    </button>
  );
}
