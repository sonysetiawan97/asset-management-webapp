import { useModal } from "@hooks/useModal";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";
import { DeleteConfirmationBody } from "./DeleteConfirmationBody";
import { DeleteConfirmationFooter } from "./DeleteConfirmationFooter";
import { useSoftDelete } from "@hooks/request/useSoftDelete";
import type { AxiosError } from "axios";
import { useSnackbar } from "notistack";

interface DeleteButtonProps {
  id: string;
  module?: string;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ id, module: moduleProp }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const location = useLocation();
  const module = moduleProp || location.pathname.split("/").filter(Boolean)[0];
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
    <AuthPrivilegesChecker link={`/${module}/:id`} method="DELETE">
      <button type="button" onClick={handle} className="btn btn-link btn-sm">
        <i className="bi bi-trash"></i>
      </button>
    </AuthPrivilegesChecker>
  );
};
