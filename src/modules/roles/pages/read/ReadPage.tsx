import { BackButton } from "@components/buttons/BackButton";
import type { FC } from "react";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormFields } from "@modules/roles/components/FormFields";
import { PrivilegeOption } from "@modules/privileges/types/Model";

type Props = {
  privilegeOptions: PrivilegeOption[],
  checkedMap: Record<string, string[]>
}

const ReadPage: FC<Props> = ({ privilegeOptions, checkedMap }) => {
  return (
    <form className="row g-3">
      <div className="col-12">
        <FormFields readOnly={true} privileges={privilegeOptions} defaultValue={checkedMap} />
      </div>

      <div className="col-12">
        <div className="d-flex gap-2 mt-2">
          <BackButton />
          <UpdateButton to={"update"} />
        </div>
      </div>
    </form>
  );
};

export { ReadPage };
export default ReadPage;
