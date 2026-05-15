import { IdentityNumberInput } from "@components/form/inputs/IdentityNumberInput";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { Text } from "@components/form/inputs/Text";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SelectReferenceInput from "@components/form/select/SelectReferenceInput";
import MultipleSelectInput from "@components/form/select/MultipleSelectInput";
import { Switch } from "@components/form/inputs/Switch";
import { useRoleOptions } from "../hooks/useRoleOptions";
import { useSysparamOptions } from "@modules/products/hooks/useSysparamOptions";
import PhoneNumberInput from "@components/form/inputs/PhoneNumberInput";
import { InputTaxpayer } from "@components/form/inputs/TaxpayerInput";
import { DateInput } from "@components/form/inputs/DateInput";
import { SingleUploadImage } from "@components/form/fileupload/SingleUploadImage";
import { MultipleUploadImage } from "@components/form/fileupload/MultipleUploadImage";
import { SingleSelectInput } from "@components/form/fileupload/SingleSelectInput";
import { MultipleUploadFile } from "@components/form/fileupload/MultipleUploadFile";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { RadioInput } from "@components/form/inputs/RadioInput";
import { ListOption } from "@/types/ListOption";
import { dummyGender } from "@/mocks/dummy/dummyGender";
import { CheckBoxInput } from "@components/form/inputs/CheckBoxInput";
import { dummyStatus } from "@/mocks/dummy/dummyStatus";
import { MonthYearInput } from "@components/form/inputs/MonthYearInput";
import { TimeInput } from "@components/form/inputs/TimeInput";

interface FormFieldsProps {
  readOnly?: boolean;
}

export const FormFields = ({ readOnly = false }: FormFieldsProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const userOptions = useRoleOptions();
  const multipleSelectOptions = useSysparamOptions({ groupName: "gender" });

  const radioOptions: ListOption<number, string>[] = dummyGender.map(
    (status) => ({
      value: status.id,
      label: status.name,
    })
  );

  const checkboxOptions: ListOption<number, string>[] = dummyStatus.map(
    (status) => ({
      value: status.id,
      label: status.name,
    })
  );

  return (
    <>
      <Text
        name="name"
        label={t("modules.examples.form.name")}
        readOnly={readOnly}
        required={true}
      />
      <IdentityNumberInput
        name="nik"
        label={t("modules.examples.form.nik")}
        readOnly={readOnly}
        required={true}
      />
      <MultipleSelectInput
        control={control}
        name="hobbies"
        label={t("modules.examples.form.hobbies")}
        readOnly={readOnly}
        required={true}
        loadOptions={multipleSelectOptions}
      />
      <SelectReferenceInput
        control={control}
        name="citizen"
        label={t("modules.examples.form.citizen")}
        readOnly={readOnly}
        required={true}
        loadOptions={userOptions}
      />
      <PhoneNumberInput
        name="phone"
        label={t("modules.examples.form.phone")}
        required={true}
        readOnly={readOnly}
      />
      <NumberInput
        name="age"
        label={t("modules.examples.form.age")}
        readOnly={readOnly}
        min={0}
        max={100}
        required={true}
      />
      <InputTaxpayer
        name="taxpayer_number"
        label={t("modules.examples.form.taxpayer_number")}
        readOnly={readOnly}
        required={true}
      />
      <DateInput
        name="dob"
        label={t("modules.examples.form.dob")}
        readOnly={readOnly}
        required={true}
      />
      <div className="row">
        <div className="col-12 col-md-6">
          <Switch
            name="married_status"
            label={t("modules.examples.form.married_status")}
            readOnly={readOnly}
            required={true}
            leftLabel="unmarried"
            rightLabel="married"
            defaultChecked={false}
          />
        </div>
        <div className="col-12 col-md-6">
          <RadioInput<number, string>
            name="gender"
            label={t("modules.examples.form.gender")}
            readOnly={readOnly}
            required={true}
            data={radioOptions}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-4 col-md-4">
          <CheckBoxInput<number, string>
            name="checkbox"
            label={t("modules.examples.form.checkbox")}
            readOnly={readOnly}
            data={checkboxOptions}
          />
        </div>

        <div className="col-4 col-md-4">
          <MonthYearInput
            name="input_date_year"
            label={t("modules.examples.form.input_date_year")}
            readOnly={readOnly}
            required={true}
          />
        </div>

        <div className="col-4 col-md-4">
          <TimeInput
            name="input_time"
            label={t("modules.examples.form.input_time")}
            readOnly={readOnly}
            required={true}
          />
        </div>
      </div>
      <TextAreaInput
        name="address"
        label={t("modules.examples.form.address")}
        readOnly={readOnly}
      />
      <div className="row">
        <div className="col-12 col-md-6">
          <SingleUploadImage
            name="profile_picture"
            label={t("modules.examples.form.profile_picture")}
            readOnly={readOnly}
            bucket="single"
            path="sagara"
            fileSizeAllowed={2}
            fileTypeAllowed="image/jpeg,image/png,image/webp"
            fieldInfo="Allowed file type: jpeg/png/webp, Max size: 2MB"
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <MultipleUploadImage
            name="multiple_image"
            label={t("modules.examples.form.multiple_image")}
            readOnly={readOnly}
            bucket="multiple"
            path="sagara"
            fileSizeAllowed={2}
            fileTypeAllowed={["image/jpeg", "image/png", "image/webp"]}
            fieldInfo="Allowed file type: jpeg/png/webp, Max size: 2MB"
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SingleSelectInput
            name="supporting_document"
            label={t("modules.examples.form.supporting_document")}
            bucket="single"
            path="sagara"
            readOnly={readOnly}
            fieldInfo="Allowed file type: PDF, Max size: 2MB"
            fileSizeAllowed={2}
            fileTypeAllowed="application/pdf"
            required={true}
          />
        </div>

        <div className="col-12 col-md-6">
          <MultipleUploadFile
            name="multiple_file"
            label={t("modules.examples.form.multiple_file")}
            readOnly={readOnly}
            bucket="multiple"
            path="sagara"
            fileSizeAllowed={2}
            fileTypeAllowed="application/pdf"
            fieldInfo="Allowed file type: PDF, Max size: 2MB"
            required={true}
          />
        </div>
      </div>
    </>
  );
};
