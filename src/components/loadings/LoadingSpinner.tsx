import clsx from "clsx";

type Props = {
  color?: string;
};

export const LoadingSpinner = ({ color = "text-dark" }: Props) => {
  return (
    <div
      className={clsx("spinner-border", color)}
      role="status"
      style={{ width: "24px", height: "24px" }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};
export default LoadingSpinner;
