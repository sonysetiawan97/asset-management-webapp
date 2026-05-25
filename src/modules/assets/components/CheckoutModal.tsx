import { type FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Modal } from "@components/Modal";
import SelectInput from "@components/form/select/SelectInput";
import { DateInput } from "@components/form/inputs/DateInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { useFindAll } from "@hooks/request/useFindAll";
import { useSnackbar } from "notistack";
import type { AxiosError } from "axios";
import { apiAxios } from "@/utils/apiAxios";
import { useQueryClient } from "@tanstack/react-query";

interface CheckoutModalProps {
  isOpen: boolean;
  closeModal: () => void;
  assetId: string;
  assetName: string;
  assetCode: string;
}

interface CheckoutFormData {
  assignee_id: string;
  expected_return_date?: string;
  notes?: string;
}

export const CheckoutModal: FC<CheckoutModalProps> = ({
  isOpen,
  closeModal,
  assetId,
  assetName,
  assetCode,
}) => {
  const { t } = useTranslation();
  const methods = useForm<CheckoutFormData>({ mode: "onBlur" });
  const { handleSubmit, reset } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: usersData } = useFindAll<{ id: number; first_name: string; last_name: string; username: string }>("users", "users");
  const users = usersData?.result ?? [];
  const userOptions = users.map((u) => ({ value: String(u.id), label: `${u.first_name} ${u.last_name}`.trim() }));

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) reset({});
  }, [isOpen, reset]);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      await apiAxios.post("/assets/checkout", {
        asset_id: Number(assetId),
        assignee_id: Number(data.assignee_id),
        expected_return_date: data.expected_return_date,
        notes: data.notes,
      });
      enqueueSnackbar(t("modules.checkout.create.notification.success"), { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      reset();
      closeModal();
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const onCancel = () => {
    reset();
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onCancel}
      title={t("modules.checkout.create.title")}
      footer={
        <div className="d-flex gap-2 w-100 justify-content-end">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {t("button.cancel")}
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit(onSubmit)}>
            {t("button.checkout")}
          </button>
        </div>
      }
    >
      <FormProvider {...methods}>
        {/* Asset info (read-only) */}
        <div className="mb-3 p-2 bg-light rounded">
          <strong>{assetName}</strong>
          <span className="text-muted ms-2">({assetCode})</span>
        </div>

        <div className="row g-3">
          <div className="col-12">
            <SelectInput
              name="assignee_id"
              label={t("modules.checkout.create.form.assignee")}
              options={userOptions}
              required={true}
            />
          </div>
          <div className="col-12 col-md-6">
            <DateInput
              name="expected_return_date"
              label={t("modules.checkout.create.form.expected_return")}
            />
          </div>
          <div className="col-12">
            <TextAreaInput
              name="notes"
              label={t("modules.checkout.create.form.notes")}
            />
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
};