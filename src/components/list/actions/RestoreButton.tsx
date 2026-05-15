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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="#000000"
      >
        <title>{t("button.restore")}</title>
        <path d="M480-564 336-420l51 51 57-57v150h72v-150l57 57 51-51-144-144Zm-264-60v408h528v-408H216Zm0 480q-29.7 0-50.85-21.15Q144-186.3 144-216v-474q0-14 5.25-27T165-741l54-54q11-11 23.94-16 12.94-5 27.06-5h420q14.12 0 27.06 5T741-795l54 54q10.5 11 15.75 24t5.25 27v474q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm6-552h516l-48-48H270l-48 48Zm258 276Z" />
      </svg>
    </button>
  );
};
