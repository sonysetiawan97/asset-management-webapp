import type { FC } from "react";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormDetailFields } from "@modules/users/component/FormDetailFields";
import { LoadOptions } from "react-select-async-paginate";
import { SelectOption } from "@/types/SelectOption";
import { GroupBase } from "react-select";
import { CancelButton } from "@components/buttons/CancelButton";
import { moduleName } from "@/modules/users/types/UserTypes";

interface ReadPageProps {
  listRole: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  >;
  departmentLoadOptions: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  >;
}

const ReadPage: FC<ReadPageProps> = ({ listRole, departmentLoadOptions }) => {
  return (
    <form className="row g-3">
      <div className="col-12">
        <FormDetailFields readOnly={true} listOptionRole={listRole} departmentLoadOptions={departmentLoadOptions} />
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
