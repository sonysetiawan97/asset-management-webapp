import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { TextInput } from "@components/form/inputs/TextInput";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { DateInput } from "@components/form/inputs/DateInput";
import SelectInput from "@components/form/select/SelectInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { ASSET_CONDITIONS } from "@modules/assets/types/Model";

interface FormFieldsProps {
  readOnly?: boolean;
  categories: { id: string; name: string; useful_life_years: number; salvage_value_pct: number }[];
  locations: { id: string; name: string }[];
  departments: { id: string; name: string }[];
  users: { id: string; name: string }[];
}

export const FormFields = ({
  readOnly = false,
  categories,
  locations,
  departments,
  users,
}: FormFieldsProps) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const watchedCategoryId = useWatch({ name: "category_id" });

  // Auto-fill useful_life_years and salvage_value from selected category
  useEffect(() => {
    if (watchedCategoryId) {
      const cat = categories.find((c) => c.id === watchedCategoryId);
      if (cat) {
        setValue("useful_life_years", cat.useful_life_years, { shouldValidate: true });
      }
    }
  }, [watchedCategoryId, categories, setValue]);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const locationOptions = [{ value: "", label: "-- No Location --" }, ...locations.map((l) => ({ value: l.id, label: l.name }))];
  const departmentOptions = [{ value: "", label: "-- Select Department --" }, ...departments.map((d) => ({ value: d.id, label: d.name }))];
  const userOptions = [{ value: "", label: "-- No Custodian --" }, ...users.map((u) => ({ value: u.id, label: u.name }))];
  const conditionOptions = ASSET_CONDITIONS.map((c) => ({ value: c.value, label: c.label }));

  return (
    <>
      {/* ── Identity Section ── */}
      <div className="form-section mb-4">
        <h6 className="form-section__title">{t("modules.assets.create.form.section.identity")}</h6>
        <div className="row">
          <div className="col-12 col-md-8">
            <Text
              name="name"
              label={t("modules.assets.create.form.name")}
              readOnly={readOnly}
              required={true}
            />
          </div>
          <div className="col-12 col-md-4">
            <TextInput
              name="serial_number"
              label={t("modules.assets.create.form.serial_number")}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>

      {/* ── Classification Section ── */}
      <div className="form-section mb-4">
        <h6 className="form-section__title">{t("modules.assets.create.form.section.classification")}</h6>
        <div className="row">
          <div className="col-12 col-md-4">
            <SelectInput
              name="category_id"
              label={t("modules.assets.create.form.category")}
              options={categoryOptions}
              readOnly={readOnly}
              required={true}
            />
          </div>
          <div className="col-12 col-md-4">
            <SelectInput
              name="location_id"
              label={t("modules.assets.create.form.location")}
              options={locationOptions}
              readOnly={readOnly}
            />
          </div>
          <div className="col-12 col-md-4">
            <SelectInput
              name="department_id"
              label={t("modules.assets.create.form.department")}
              options={departmentOptions}
              readOnly={readOnly}
              required={true}
            />
          </div>
          <div className="col-12 col-md-4">
            <SelectInput
              name="custodian_id"
              label={t("modules.assets.create.form.custodian")}
              options={userOptions}
              readOnly={readOnly}
            />
          </div>
          <div className="col-12 col-md-4">
            <SelectInput
              name="condition"
              label={t("modules.assets.create.form.condition")}
              options={conditionOptions}
              readOnly={readOnly}
              required={true}
            />
          </div>
        </div>
      </div>

      {/* ── Financial Section ── */}
      <div className="form-section mb-4">
        <h6 className="form-section__title">{t("modules.assets.create.form.section.financial")}</h6>
        <div className="row">
          <div className="col-12 col-md-4">
            <NumberInput
              name="purchase_price"
              label={t("modules.assets.create.form.purchase_price")}
              readOnly={readOnly}
              required={true}
              min={0}
              step={1000}
            />
          </div>
          <div className="col-12 col-md-4">
            <DateInput
              name="purchase_date"
              label={t("modules.assets.create.form.purchase_date")}
              readOnly={readOnly}
              required={true}
            />
          </div>
          <div className="col-12 col-md-4">
            <NumberInput
              name="useful_life_years"
              label={t("modules.assets.create.form.useful_life_years")}
              readOnly={readOnly}
              min={0}
              step={1}
            />
          </div>
          <div className="col-12 col-md-4">
            <NumberInput
              name="salvage_value"
              label={t("modules.assets.create.form.salvage_value")}
              readOnly={readOnly}
              min={0}
              step={100}
            />
          </div>
        </div>
      </div>

      {/* ── Warranty & License Section ── */}
      <div className="form-section mb-4">
        <h6 className="form-section__title">{t("modules.assets.create.form.section.warranty_license")}</h6>
        <div className="row">
          <div className="col-12 col-md-6">
            <DateInput
              name="warranty_start"
              label={t("modules.assets.create.form.warranty_start")}
              readOnly={readOnly}
            />
          </div>
          <div className="col-12 col-md-6">
            <DateInput
              name="warranty_end"
              label={t("modules.assets.create.form.warranty_end")}
              readOnly={readOnly}
            />
          </div>
          <div className="col-12 col-md-6">
            <TextInput
              name="license_key"
              label={t("modules.assets.create.form.license_key")}
              readOnly={readOnly}
            />
          </div>
          <div className="col-12 col-md-6">
            <DateInput
              name="license_expiry"
              label={t("modules.assets.create.form.license_expiry")}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      <div className="form-section mb-4">
        <div className="row">
          <div className="col-12">
            <TextAreaInput
              name="notes"
              label={t("modules.assets.create.form.notes")}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>
    </>
  );
};