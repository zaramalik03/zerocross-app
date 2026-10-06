import { useState, type KeyboardEvent } from "react";

type HeartRatingProps = {
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
};

export function HeartRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 18,
  label = "rating",
  showValue = false,
  className = "",
}: HeartRatingProps) {
  const [hover, setHover] = useState(0);

  // Round to nearest whole heart for display; keep one decimal in the readout text.
  const display = Math.round(value);
  const active = readOnly ? display : hover || display;

  const interactive = !readOnly && typeof onChange === "function";

  const base = "inline-flex items-center gap-0.5";
  const state = interactive ? "cursor-pointer" : "cursor-default";

  return (
    <div
      className={`${base} ${state} ${className}`}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`${label} rating`}
      aria-valuetext={value ? `${value} out of 5` : "not rated"}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;

        const heart = (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={filled ? 0 : 1.6}
            className={filled ? "text-azalea" : "text-azalea-soft"}
            aria-hidden="true"
          >
            <path d="M12 21s-7.5-4.6-10-9.3C.7 9 1.8 5.9 4.7 5c2.2-.7 4 .5 5.3 2 .3.4.5.6.5.6s.2-.2.5-.6C12.2 5.5 14 4.3 16.3 5c2.9.9 4 4 2.7 6.7C19.5 16.4 12 21 12 21z" />
          </svg>
        );

        if (!interactive) return <span key={n}>{heart}</span>;

        return (
          <button
            key={n}
            type="button"
            className="p-0 bg-transparent border-0 leading-none transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azalea/40 rounded"
            aria-label={`${n} heart${n > 1 ? "s" : ""}`}
            aria-checked={n === display}
            role="radio"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onChange?.(n)}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange?.(n);
              }
            }}
          >
            {heart}
          </button>
        );
      })}

      {showValue && (
        <span className="ml-1.5 text-xs font-mono tabular-nums text-azalea-ink">
          {value > 0 ? value.toFixed(1) : "—"}
        </span>
      )}
    </div>
  );
}
