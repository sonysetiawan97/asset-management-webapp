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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="#EA3323"
      >
        <title>{t("button.remove")}</title>
        <path d="m400-325 80-80 80 80 51-51-80-80 80-80-51-51-80 80-80-80-51 51 80 80-80 80 51 51Zm-88 181q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480Zm-336 0v480-480Z" />
      </svg>
    </button>
  );
};
