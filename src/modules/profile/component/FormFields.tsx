import { Text } from "@components/form/inputs/Text";
import { useTranslation } from "react-i18next";
import { Email } from "@components/form/inputs/Email";
import { SingleUploadImage } from "@components/form/fileupload/SingleUploadImage";

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
            name="first_name"
            label={t("modules.users.update.form.first_name")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <Text
            name="last_name"
            label={t("modules.users.update.form.last_name")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <Text
            name="username"
            label={t("modules.users.update.form.username")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <Email
            name="email"
            label={t("modules.users.update.form.email")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <div className="col-6">
            <SingleUploadImage
              name="photo"
              label={t("modules.users.update.form.photo_profile")}
              readOnly={readOnly}
              bucket="single"
              path="sagara"
              fileSizeAllowed={2}
              fileTypeAllowed="image/jpeg,image/png,image/webp"
              fieldInfo="Allowed file type: jpeg/png/webp, Max size: 2MB"
              required={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};
