import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { NumberInput } from "@components/form/inputs/NumberInput";

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
            name="name"
            label={t("modules.products.create.form.name")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <NumberInput
            name="price"
            label={t("modules.products.create.form.price")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <NumberInput
            name="stock"
            label={t("modules.products.create.form.stock")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <TextAreaInput
            name="description"
            label={t("modules.products.create.form.description")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};
