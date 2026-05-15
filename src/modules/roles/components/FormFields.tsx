import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { PrivilegeOption } from "../../privileges/types/Model";
import { CheckBoxInputRole } from "./CheckBoxInputRole";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

interface FormFieldsProps {
  readOnly?: boolean;
  privileges: PrivilegeOption[];
  defaultValue?: Record<string, string[]>
}

export const FormFields = ({ readOnly = false, privileges, defaultValue = {} }: FormFieldsProps) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();

  // Watch semua field checkbox berdasarkan nama group
  const watchedCheckboxes = useWatch({
    control,
    name: privileges.map((p) => p.name), // ex: ["administrator", "user", ...]
  });

  useEffect(() => {
    const privilegeList: { uri: string; method: string }[] = [];

    privileges.forEach((_, index) => {
      const values: string[] = watchedCheckboxes?.[index] || [];

      values.forEach((val) => {
        const [uri, method] = val.split("|");
        if (uri && method) {
          privilegeList.push({ uri, method });
        }
      });
    });

    // Set field 'privileges' di form agar ikut terkirim saat submit
    setValue("privileges", privilegeList);
  }, [watchedCheckboxes, privileges, setValue]);

  return (
    <>
      <Text
        name="name"
        label={t("modules.roles.create.form.name")}
        readOnly={readOnly}
        required={true}
      />
      <div className="row">
        {privileges.map((group) => (
          <div key={group.name} className="col-md-4 mb-3">
            <CheckBoxInputRole<string, string>
              name={group.name}
              label={group.name}
              readOnly={readOnly}
              data={group.mapping}
              disabled={readOnly}
              defaultValue={defaultValue[group.name] || []}
            />
          </div>
        ))}
      </div>
    </>
  );
};
