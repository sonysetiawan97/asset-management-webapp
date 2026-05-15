import type { FC } from "react";

interface DeleteConfirmationFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClass?: string;
}

export const DeleteConfirmationFooter: FC<DeleteConfirmationFooterProps> = ({
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
