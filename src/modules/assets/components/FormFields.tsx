import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { TextInput } from "@components/form/inputs/TextInput";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { DateInput } from "@components/form/inputs/DateInput";
import SelectInput from "@components/form/select/SelectInput";
import SelectReferenceInput from "@components/form/select/SelectReferenceInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { findOneById } from "@services/findOneById";
import { ASSET_CONDITIONS } from "@modules/assets/types/Model";
import { getDepartmentById } from "../hooks/useDepartmentOptions";
import { getUserById } from "../hooks/useUserOptions";
import { getCategoryById, type CategoryOptionDetail } from "../hooks/useCategoryOptions";
import type { LoadOptions } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";

interface FormFieldsProps {
  readOnly?: boolean;
  categoryLoadOptions: LoadOptions<SelectOption, GroupBase<SelectOption>, { skip: number }>;
  locationLoadOptions: LoadOptions<SelectOption, GroupBase<SelectOption>, { skip: number }>;
  departmentLoadOptions: LoadOptions<SelectOption, GroupBase<SelectOption>, { skip: number }>;
  userLoadOptions: LoadOptions<SelectOption, GroupBase<SelectOption>, { skip: number }>;
  departmentReadOnly?: boolean;
}

export const FormFields = ({
  readOnly = false,
  categoryLoadOptions,
  locationLoadOptions,
  departmentLoadOptions,
  userLoadOptions,
  departmentReadOnly = false,
}: FormFieldsProps) => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const watchedCategoryId = useWatch({ name: "category_id" });

  const { data: categoryDetail } = useQuery({
    queryKey: ["options/categories", watchedCategoryId],
    queryFn: () =>
      watchedCategoryId
        ? findOneById<CategoryOptionDetail>("options/categories", watchedCategoryId)
        : Promise.reject("no id"),
    enabled: !!watchedCategoryId,
  });

  useEffect(() => {
    if (categoryDetail) {
      setValue("useful_life_years", categoryDetail.useful_life_years, { shouldValidate: true });
    }
  }, [categoryDetail, setValue]);

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
            <SelectReferenceInput
              name="category_id"
              control={control}
              loadOptions={categoryLoadOptions}
              label={t("modules.assets.create.form.category")}
              readOnly={readOnly}
              required={true}
              fetchOptionById={async (id) => {
                const result = await getCategoryById(id);
                return result?.option ?? null;
              }}
            />
          </div>
          <div className="col-12 col-md-4">
            <SelectReferenceInput
              name="location_id"
              control={control}
              loadOptions={locationLoadOptions}
              label={t("modules.assets.create.form.location")}
              readOnly={readOnly}
              required={true}
            />
          </div>
          <div className="col-12 col-md-4">
          <SelectReferenceInput
            name="department_id"
            control={control}
            loadOptions={departmentLoadOptions}
            label={t("modules.assets.create.form.department")}
            readOnly={readOnly || departmentReadOnly}
            required={true}
            fetchOptionById={getDepartmentById}
          />
          </div>
          <div className="col-12 col-md-4">
            <SelectReferenceInput
              name="custodian_id"
              control={control}
              loadOptions={userLoadOptions}
              label={t("modules.assets.create.form.custodian")}
              readOnly={readOnly}
              fetchOptionById={getUserById}
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
              step={1}
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
              step={1}
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