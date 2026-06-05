import { type FC } from "react";

interface Props {
  variant: "donut" | "bar" | "line" | "ring" | "text";
  rows?: number;
}

const BAR_WIDTHS = [85, 72, 58, 44, 30];

const ChartSkeleton: FC<Props> = ({ variant, rows = 4 }) => {
  if (variant === "donut") {
    return (
      <div className="skel-donut-wrap">
        <svg viewBox="0 0 120 120" className="skel-donut">
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--color-surface-alt)" strokeWidth="12" />
        </svg>
      </div>
    );
  }

  if (variant === "ring") {
    return (
      <div className="skel-ring-wrap">
        <svg viewBox="0 0 120 120" className="skel-ring">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-surface-alt)" strokeWidth="10" />
        </svg>
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div className="skel-bars">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skel-bar" style={{ width: `${BAR_WIDTHS[i % BAR_WIDTHS.length]}%` }} />
        ))}
      </div>
    );
  }

  if (variant === "line") {
    return (
      <div className="skel-line-wrap">
        <svg viewBox="0 0 400 100" className="skel-line" preserveAspectRatio="none">
          <path
            d="M0,60 Q50,40 100,55 T200,45 T300,50 T400,35"
            fill="none"
            stroke="var(--color-surface-alt)"
            strokeWidth="3"
          />
          <path
            d="M0,60 Q50,40 100,55 T200,45 T300,50 T400,35 L400,100 L0,100 Z"
            fill="var(--color-surface-alt)"
            opacity="0.15"
          />
        </svg>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className="skel-texts">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skel-text" style={{ width: `${90 - i * 8}%` }} />
        ))}
      </div>
    );
  }

  return null;
};

export default ChartSkeleton;
