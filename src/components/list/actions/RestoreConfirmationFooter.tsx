import type { FC } from "react";

interface RestoreConfirmationFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClass?: string;
}

export const RestoreConfirmationFooter: FC<RestoreConfirmationFooterProps> = ({
  onCancel,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmClass = "btn-primary",
}) => {
  return (
    <div className="d-flex justify-content-end gap-2">
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        {cancelLabel}
      </button>
      <button
        type="button"
        className={`btn ${confirmClass}`}
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  );
};
