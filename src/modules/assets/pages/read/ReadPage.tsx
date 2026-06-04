import { useState } from "react";
import { BackButton } from "@components/buttons/BackButton";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormFields } from "../../components/FormFields";
import { QRCodeSection } from "../../components/QRCodeSection";
// import { AssetLogsSection } from "../../components/AssetLogsSection";
import { CheckoutModal } from "../../components/CheckoutModal";
import { useFindAll } from "@hooks/request/useFindAll";
import { ContentLoader } from "@components/loadings/ContentLoader";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ReadModel } from "../../types/Model";

interface ReadPageProps {
  defaultValue?: { category_id: string; location_id: string };
}

const ReadPage = (_props: ReadPageProps) => {
  const { watch } = useFormContext<ReadModel>();
  const { t } = useTranslation();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const assetId = watch("id");
  const assetCode = watch("asset_code");
  const assetName = watch("name");
  const assetStatus = watch("asset_status");

  const { data: categoryData } = useFindAll<{ id: string; name: string; useful_life_years: number; salvage_value_pct: number }>("categories", "categories");
  const { data: locationData } = useFindAll<{ id: string; name: string }>("locations", "locations");
  const { data: departmentData } = useFindAll<{ id: string; name: string }>("departments", "departments");
  const { data: userData } = useFindAll<{ id: string; first_name: string; last_name: string }>("users", "users");

  const categories = categoryData?.result ?? [];
  const locations = locationData?.result ?? [];
  const departments = departmentData?.result ?? [];
  const users = userData?.result ?? [];

  const isLoadingAny = categoryData === undefined || locationData === undefined || departmentData === undefined || userData === undefined;
  if (isLoadingAny) return <ContentLoader />;

  return (
    <>
      <form className="row g-3">
        <div className="col-12">
          <FormFields
            readOnly={true}
            categories={categories}
            locations={locations}
            departments={departments}
            users={users}
          />
        </div>
        <div className="col-12">
          <div className="d-flex gap-2 mt-2">
            <BackButton />
            <UpdateButton to={"update"} />
            {assetStatus === "available" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowCheckoutModal(true)}
              >
                <i className="bi bi-send me-1"></i>
                {t("modules.checkout.create.title")}
              </button>
            )}
          </div>
        </div>
      </form>
      {assetId && assetCode && (
        <QRCodeSection assetCode={assetCode} assetName={assetName ?? ""} />
      )}
      {/* {assetId && <AssetLogsSection assetId={assetId} />} */}

      {showCheckoutModal && assetId && (
        <CheckoutModal
          isOpen={showCheckoutModal}
          closeModal={() => setShowCheckoutModal(false)}
          assetId={assetId}
          assetName={assetName ?? ""}
          assetCode={assetCode ?? ""}
        />
      )}
    </>
  );
};

export { ReadPage };
export default ReadPage;