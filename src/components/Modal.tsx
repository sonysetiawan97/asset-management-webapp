import type { FC, ReactNode, MouseEvent, KeyboardEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  title = "Title",
  closeModal,
  children,
  footer,
  size,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ zIndex: 1050 }}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className={`modal-dialog modal-${size ?? "md"} modal-dialog-centered`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={closeModal}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Close modal"
      />
    </>
  );
};
