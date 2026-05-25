import { BackButton } from "@components/buttons/BackButton";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormFields } from "../../components/FormFields";
import { QRCodeSection } from "../../components/QRCodeSection";
import { useFindAll } from "@hooks/request/useFindAll";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { useFormContext } from "react-hook-form";
import type { ReadModel } from "../../types/Model";

interface ReadPageProps {
  defaultValue?: { category_id: string; location_id: string };
}

const ReadPage = (_props: ReadPageProps) => {
  const { watch } = useFormContext<ReadModel>();
  const assetId = watch("id");
  const assetCode = watch("asset_code");
  const assetName = watch("name");
  const { data: categoryData } = useFindAll<{ id: string; name: string; useful_life_years: number; salvage_value_pct: number }>("categories", "categories");
  const { data: locationData } = useFindAll<{ id: string; name: string }>("locations", "locations");
  const { data: departmentData } = useFindAll<{ id: string; name: string }>("departments", "departments");
  const { data: vendorData } = useFindAll<{ id: string; name: string }>("vendors", "vendors");
  const { data: userData } = useFindAll<{ id: string; name: string }>("users", "users");

  const categories = categoryData?.result ?? [];
  const locations = locationData?.result ?? [];
  const departments = departmentData?.result ?? [];
  const vendors = vendorData?.result ?? [];
  const users = userData?.result ?? [];

  const isLoadingAny = categoryData === undefined || locationData === undefined || departmentData === undefined || vendorData === undefined || userData === undefined;
  if (isLoadingAny) return <ContentLoader />;

  return (
    <>
      <form className="row g-3">
        <div className="col-12">
          <FormFields
            readOnly={true}
            categories={categories ?? []}
            locations={locations ?? []}
            departments={departments ?? []}
            vendors={vendors ?? []}
            users={users ?? []}
          />
        </div>
        <div className="col-12">
          <div className="d-flex gap-2 mt-2">
            <BackButton />
            <UpdateButton to={"update"} />
          </div>
        </div>
      </form>
      {assetId && assetCode && (
        <QRCodeSection assetId={assetId} assetCode={assetCode} assetName={assetName ?? ""} />
      )}
    </>
  );
};

export { ReadPage };
export default ReadPage;