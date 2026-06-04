import { useModal } from "@hooks/useModal";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { DeleteConfirmationBody } from "./DeleteConfirmationBody";
import { DeleteConfirmationFooter } from "./DeleteConfirmationFooter";
import { useSoftDelete } from "@hooks/request/useSoftDelete";
import type { AxiosError } from "axios";
import { useSnackbar } from "notistack";

interface DeleteButtonProps {
  id: string;
  module: string;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ id, module }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { softDeleteAsync } = useSoftDelete(module);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      await softDeleteAsync({ id, url: module });
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
      title: t("modal.confirmation.delete"),
      footer: (
        <DeleteConfirmationFooter
          onCancel={closeModal}
          onConfirm={handleDelete}
          confirmLabel={t("button.delete")}
          cancelLabel={t("button.cancel")}
          confirmClass="btn-danger"
        />
      ),
      size: "md",
    });
  };

  return (
    <button type="button" onClick={handle} className="btn btn-link btn-sm">
      <i className="bi bi-trash"></i>
    </button>
  );
};
