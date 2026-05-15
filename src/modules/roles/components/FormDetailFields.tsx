import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { PrivilegeOption } from "@modules/privileges/types/Model";
import { CheckBoxInputRole } from "./CheckBoxInputRole";

interface FormDetailFieldsProps {
    readOnly?: boolean,
    privilegeOptions: PrivilegeOption[],
    checkedMap: Record<string, string[]>
}

export const FormDetailFields = ({ readOnly = false, privilegeOptions, checkedMap }: FormDetailFieldsProps) => {
    const { t } = useTranslation();

    return (
        <>
            <Text
                name="name"
                label={t("modules.roles.create.form.name")}
                readOnly={readOnly}
                required={true}
            />
            <div className="row">
                {privilegeOptions.map((group) => (
                    <div key={group.name} className="col-md-4 mb-3">
                        <CheckBoxInputRole<string, string>
                            name={group.name}
                            label={group.name}
                            readOnly={readOnly}
                            data={group.mapping}
                            defaultValue={checkedMap[group.name] || []}
                            disabled={readOnly}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};
