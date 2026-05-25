import { BackButton } from "@components/buttons/BackButton";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormFields } from "../../components/FormFields";
import { useFindAll } from "@hooks/request/useFindAll";
import { type Model } from "@modules/departments/types/Model";
import { ContentLoader } from "@components/loadings/ContentLoader";

interface ReadPageProps {
  defaultValue?: Model;
}

const ReadPage = ({ defaultValue }: ReadPageProps) => {
  const { data: departmentsData, isLoading } = useFindAll<Model>("departments", "departments");

  if (isLoading) return <ContentLoader />;

  const departments = departmentsData?.result ?? [];

  return (
    <form className="row g-3">
      <div className="col-12">
        <FormFields readOnly={true} departments={departments} defaultValue={defaultValue} />
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