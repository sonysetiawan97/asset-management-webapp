import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CancelButton } from "@components/buttons/CancelButton";
import { SubmitButton } from "@components/buttons/SubmitButton";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  CreateModel,
  moduleName,
  SubmitCreateUserModel,
} from "@/modules/users/types/UserTypes";
import { FormFields } from "@/modules/users/component/FormFields";
import { FC } from "react";
import { SelectOption } from "@/types/SelectOption";
import { extractErrors } from "@/utils/extractError";
import { LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";

interface CreatePageProps {
  listRole: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  >;
  departmentLoadOptions: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  >;
}
const CreatePage: FC<CreatePageProps> = ({ listRole, departmentLoadOptions }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset } = useFormContext<CreateModel>();
  const { createAsync, isLoading } =
    useCreate<SubmitCreateUserModel>(moduleName);
  const navigate = useNavigate();

  const onSubmit = async (data: CreateModel) => {
    try {
      await createAsync({ url: moduleName, body: data });
      enqueueSnackbar(t("modules.users.create.notification.success"), {
        variant: "success",
      });

      reset();
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      extractErrors(error).forEach((msg) => {
        enqueueSnackbar(msg, { variant: "error" });
      });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <FormFields listOptionRole={listRole} departmentLoadOptions={departmentLoadOptions} />
      </div>

      <div className="col-12">
        <div className="d-flex gap-2">
          <CancelButton to={`/${moduleName}`} />
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export default CreatePage;
