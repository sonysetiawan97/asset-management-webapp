import { Text } from "@components/form/inputs/Text";
import { useTranslation } from "react-i18next";
import { Email } from "@components/form/inputs/Email";
import { Password } from "@components/form/inputs/Password";
import { useFormContext } from "react-hook-form";
import { SelectOption } from "@/types/SelectOption";
import { LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";
import SelectReferenceInput from "@components/form/select/SelectReferenceInput";
import SelectReferenceInputRole from "./SelectReferenceInputRole";

interface FormFieldsProps {
  readOnly?: boolean;
  listOptionRole: LoadOptions<
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

export const FormFields = ({
  readOnly = false,
  listOptionRole,
  departmentLoadOptions,
}: FormFieldsProps) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();

  const password = watch("password");

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Text
            name="first_name"
            label={t("modules.users.create.form.first_name")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <Text
            name="last_name"
            label={t("modules.users.create.form.last_name")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12">
          <Text
            name="username"
            label={t("modules.users.create.form.username")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <Email
            name="email"
            label={t("modules.users.create.form.email")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <Password
            name="password"
            label={t("modules.users.create.form.password")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <Password
            name="confirm_password"
            label={t("modules.users.create.form.confirm_password")}
            readOnly={readOnly}
            required={true}
            validate={(value: string) =>
              value === password || "Passwords do not match"
            }
          />
        </div>
        <div className="col-12">
          <SelectReferenceInput
            name="department_id"
            control={control}
            loadOptions={departmentLoadOptions}
            label={t("modules.users.create.form.department")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12">
          <SelectReferenceInputRole
            control={control}
            name="role"
            label={t("modules.users.create.form.role")}
            readOnly={readOnly}
            required={true}
            loadOptions={listOptionRole}
          />
        </div>
      </div>
    </>
  );
};
