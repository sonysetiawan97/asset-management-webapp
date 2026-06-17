import { BackButton } from "@components/buttons/BackButton";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormFields } from "../../components/FormFields";
import { useFindAll } from "@hooks/request/useFindAll";
import { type Model } from "@modules/locations/types/Model";
import { ContentLoader } from "@components/loadings/ContentLoader";

interface ReadPageProps {
  defaultValue?: Model;
}

const ReadPage = ({ defaultValue }: ReadPageProps) => {
  const { data: locationsData, isLoading } = useFindAll<Model>("locations", "locations");

  if (isLoading) return <ContentLoader />;

  const locations = locationsData?.result ?? [];

  return (
    <form className="row g-3">
      <div className="col-12">
        <div className="form-section">
          <FormFields readOnly={true} locations={locations} defaultValue={defaultValue} />
        </div>
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
