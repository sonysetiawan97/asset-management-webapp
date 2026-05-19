import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { TextInput } from "@components/form/inputs/TextInput";
import { Email } from "@components/form/inputs/Email";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import SelectInput from "@components/form/select/SelectInput";
import { CheckBoxInput } from "@components/form/inputs/CheckBoxInput";
import { VENDOR_CATEGORIES } from "@modules/vendors/types/Model";

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
            label={t("modules.vendors.create.form.name")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <Text
            name="code"
            label={t("modules.vendors.create.form.code")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="category"
            label={t("modules.vendors.create.form.category")}
            options={VENDOR_CATEGORIES}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <TextInput
            name="contact_person"
            label={t("modules.vendors.create.form.contact_person")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <Email
            name="email"
            label={t("modules.vendors.create.form.email")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <TextInput
            name="phone"
            label={t("modules.vendors.create.form.phone")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12">
          <TextInput
            name="address"
            label={t("modules.vendors.create.form.address")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12">
          <TextAreaInput
            name="notes"
            label={t("modules.vendors.create.form.notes")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <CheckBoxInput
            name="is_active"
            label={t("modules.vendors.create.form.is_active")}
          />
        </div>
      </div>
    </>
  );
};