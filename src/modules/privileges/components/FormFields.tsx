import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { NumberInput } from "@components/form/inputs/NumberInput";

interface FormFieldsProps {
  readOnly?: boolean;
}

export const FormFields = ({ readOnly = false }: FormFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Text
        name="module"
        label={t("modules.privileges.create.form.module")}
        readOnly={readOnly}
        required={true}
      />
      <Text
        name="submodule"
        label={t("modules.privileges.create.form.sub_module")}
        readOnly={readOnly}
        required={true}
      />
      <NumberInput
        name="ordering"
        label={t("modules.privileges.create.form.ordering")}
        readOnly={readOnly}
        required={true}
      />
      <Text
        name="action"
        label={t("modules.privileges.create.form.action")}
        readOnly={readOnly}
        required={true}
      />
      <Text
        name="method"
        label={t("modules.privileges.create.form.method")}
        readOnly={readOnly}
        required={true}
      />
      <Text
        name="uri"
        label={t("modules.privileges.create.form.uri")}
        readOnly={readOnly}
        required={true}
      />
    </>
  );
};
