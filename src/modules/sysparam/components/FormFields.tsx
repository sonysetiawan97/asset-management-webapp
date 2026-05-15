import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";

interface FormFieldsProps {
  readOnly?: boolean;
}

export const FormFields = ({ readOnly = false }: FormFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Text
        name="group"
        label={t("modules.sysparam.create.form.group")}
        readOnly={readOnly}
        required={true}
      />
      <Text
        name="key"
        label={t("modules.sysparam.create.form.key")}
        readOnly={readOnly}
        required={true}
      />
      <Text
        name="value"
        label={t("modules.sysparam.create.form.value")}
        readOnly={readOnly}
        required={true}
      />
      <Text
        name="long_value"
        label={t("modules.sysparam.create.form.long_value")}
        readOnly={readOnly}
        required={true}
      />
    </>
  );
};
