import { type FC } from "react";

interface StatusBadgeProps {
  label: string;
  bgColor?: string;
  textColor?: string;
  dotColor?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({
  label,
  bgColor,
  textColor,
  dotColor,
}) => {
  return (
    <span
      className="badge rounded-pill d-inline-flex align-items-center gap-1"
      style={{
        backgroundColor: bgColor ?? "#e5e7eb",
        color: textColor ?? "#374151",
        fontSize: "0.75rem",
        padding: "0.35em 0.65em",
      }}
    >
      {dotColor && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: dotColor,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  );
};