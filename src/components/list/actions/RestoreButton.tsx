import { useModal } from "@hooks/useModal";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { useRestore } from "@hooks/request/useRestore";
import { RestoreConfirmationBody } from "./RestoreConfirmationBody";
import { RestoreConfirmationFooter } from "./RestoreConfirmationFooter";

interface RestoreButtonProps {
  id: string;
  module: string;
}

export const RestoreButton: FC<RestoreButtonProps> = ({ id, module }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { restoreAsync } = useRestore(module);
  const { enqueueSnackbar } = useSnackbar();

  const handleRestore = async () => {
    try {
      await restoreAsync({ id, url: module });
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
    openModal(<RestoreConfirmationBody id={id} />, {
      title: t("modal.confirmation.restore"),
      footer: (
        <RestoreConfirmationFooter
          onCancel={closeModal}
          onConfirm={handleRestore}
          confirmLabel={t("button.restore")}
          cancelLabel={t("button.cancel")}
          confirmClass="btn-primary"
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
