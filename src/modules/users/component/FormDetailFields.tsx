import { Text } from "@components/form/inputs/Text";
import { useTranslation } from "react-i18next";
import { Email } from "@components/form/inputs/Email";
import { useFormContext } from "react-hook-form";
import { SelectOption } from "@/types/SelectOption";
import { LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";
import SelectReferenceInputRole from "./SelectReferenceInputRole";

interface FormFieldsProps {
  readOnly?: boolean;
  listOptionRole: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  >;
}

export const FormDetailFields = ({
  readOnly = false,
  listOptionRole,
}: FormFieldsProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Text
            name="first_name"
            label={t("modules.users.update.form.first_name")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <Text
            name="last_name"
            label={t("modules.users.update.form.last_name")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12">
          <Text
            name="username"
            label={t("modules.users.update.form.username")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <Email
            name="email"
            label={t("modules.users.update.form.email")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <SelectReferenceInputRole
            control={control}
            name="role"
            label={t("modules.users.update.form.role")}
            readOnly={readOnly}
            required={true}
            loadOptions={listOptionRole}
          />
        </div>
      </div>
    </>
  );
};
