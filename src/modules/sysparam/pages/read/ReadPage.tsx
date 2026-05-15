import type { FC } from "react";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormFields } from "@modules/sysparam/components/FormFields";
import { CancelButton } from "@components/buttons/CancelButton";
import { moduleName } from "@modules/sysparam/types/Model";

const ReadPage: FC = () => {
  return (
    <form className="row g-3">
      <div className="col-12">
        <FormFields readOnly={true} />
      </div>

      <div className="col-12">
        <div className="d-flex gap-2 mt-2">
          <CancelButton to={`/${moduleName}`} />
          <UpdateButton to={"update"} />
        </div>
      </div>
    </form>
  );
};

export { ReadPage };
export default ReadPage;
