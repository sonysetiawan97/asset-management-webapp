import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@components/form/inputs/Text";
import { Email } from "@components/form/inputs/Email";
import { TextInput } from "@components/form/inputs/TextInput";

interface FormFieldsProps {
  readOnly?: boolean;
}

export const FormFields = ({ readOnly = false }: FormFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <Text
            name="code"
            label={t("modules.suppliers.create.form.code")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <Text
            name="name"
            label={t("modules.suppliers.create.form.name")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <TextInput
            name="phone"
            label={t("modules.suppliers.create.form.phone")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <Email
            name="email"
            label={t("modules.suppliers.create.form.email")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};