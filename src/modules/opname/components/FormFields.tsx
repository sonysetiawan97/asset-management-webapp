import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { DateInput } from "@components/form/inputs/DateInput";
import SelectReferenceInput from "@components/form/select/SelectReferenceInput";
import { Controller, useFormContext } from "react-hook-form";
import { useFindAll } from "@hooks/request/useFindAll";

const FormFields = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  const { data: departmentData } = useFindAll<{ id: string; name: string }>("departments", "departments");
  const { data: locationData } = useFindAll<{ id: string; name: string }>("locations", "locations");

  const loadDepartmentOptions = async (
    search: string,
    _loadedOptions: unknown,
    _additional: { skip: number } | undefined
  ) => {
    const items = departmentData?.result ?? [];
    const filtered = items.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
    return {
      options: filtered.slice(0, 50).map((d) => ({ value: d.id, label: d.name })),
      hasMore: false,
    };
  };

  const loadLocationOptions = async (
    search: string,
    _loadedOptions: unknown,
    _additional: { skip: number } | undefined
  ) => {
    const items = locationData?.result ?? [];
    const filtered = items.filter((l) =>
      l.name.toLowerCase().includes(search.toLowerCase())
    );
    return {
      options: filtered.slice(0, 50).map((l) => ({ value: l.id, label: l.name })),
      hasMore: false,
    };
  };

  return (
    <>
      <div className="col-12">
        <Text
          name="name"
          label={t("modules.opname.form.name")}
          required
        />
      </div>

      <div className="col-12">
        <SelectReferenceInput
          name="department_id"
          control={control}
          loadOptions={loadDepartmentOptions}
          label={t("modules.opname.form.department")}
          placeholder={t("modules.opname.form.department_placeholder")}
        />
      </div>

      <div className="col-12">
        <SelectReferenceInput
          name="location_id"
          control={control}
          loadOptions={loadLocationOptions}
          label={t("modules.opname.form.location")}
          placeholder={t("modules.opname.form.location_placeholder")}
        />
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <DateInput
                {...field}
                name="start_date"
                label={t("modules.opname.form.start_date")}
                required
              />
            )}
          />
        </div>
        <div className="col-12 col-md-6">
          <Controller
            name="end_date"
            control={control}
            render={({ field }) => (
              <DateInput
                {...field}
                name="end_date"
                label={t("modules.opname.form.end_date")}
              />
            )}
          />
        </div>
      </div>

      <div className="col-12">
        <TextAreaInput
          name="notes"
          label={t("modules.opname.form.notes")}
        />
      </div>
    </>
  );
};

export { FormFields };