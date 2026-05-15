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
      <svg
        className="d-flex"
        xmlns="http://www.w3.org/2000/svg"
        height="18px"
        viewBox="0 -960 960 960"
        width="18px"
        fill="#ff5252"
      >
        <title>{t("button.delete")}</title>
        <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
      </svg>
    </button>
  );
};
