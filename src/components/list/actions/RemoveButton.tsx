import { useModal } from "@hooks/useModal";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { DeleteConfirmationBody } from "./DeleteConfirmationBody";
import { DeleteConfirmationFooter } from "./DeleteConfirmationFooter";
import type { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { useHardDelete } from "@hooks/request/useHardDelete";

interface RemoveButtonProps {
  id: string;
  module: string;
}

export const RemoveButton: FC<RemoveButtonProps> = ({ id, module }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { hardDelete } = useHardDelete(module);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      await hardDelete({ id, url: module });
      enqueueSnackbar(t("modal.notification.success"));
      closeModal();
    } catch (e: unknown) {
      const { message } = e as AxiosError;
      enqueueSnackbar(message, {
        variant: "error",
      });
    }
  };

  const handle = () => {
    openModal(<DeleteConfirmationBody id={id} />, {
      title: t("modal.confirmation.remove"),
      footer: (
        <DeleteConfirmationFooter
          onCancel={closeModal}
          onConfirm={handleDelete}
          confirmLabel={t("button.remove")}
          cancelLabel={t("button.cancel")}
          confirmClass="btn-danger"
        />
      ),
      size: "md",
    });
  };

  return (
    <button type="button" onClick={handle} className="btn btn-icon button-link">
      <i className="bi bi-archive"></i>
    </button>
  );
};
