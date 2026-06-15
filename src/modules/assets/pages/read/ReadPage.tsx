import { useState } from "react";
import { BackButton } from "@components/buttons/BackButton";
import { UpdateButton } from "@components/buttons/UpdateButton";
import { FormFields } from "../../components/FormFields";
import { QRCodeSection } from "../../components/QRCodeSection";
// import { AssetLogsSection } from "../../components/AssetLogsSection";
import { CheckoutModal } from "../../components/CheckoutModal";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ReadModel } from "../../types/Model";
import { useCategoryOptions } from "../../hooks/useCategoryOptions";
import { useLocationOptions } from "../../hooks/useLocationOptions";
import { useDepartmentOptions } from "../../hooks/useDepartmentOptions";
import { useUserOptions } from "../../hooks/useUserOptions";

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

  const categoryLoadOptions = useCategoryOptions();
  const locationLoadOptions = useLocationOptions();
  const departmentLoadOptions = useDepartmentOptions();
  const userLoadOptions = useUserOptions();

  return (
    <>
      <form className="row g-3">
        <div className="col-12">
          <FormFields
            readOnly={true}
            categoryLoadOptions={categoryLoadOptions}
            locationLoadOptions={locationLoadOptions}
            departmentLoadOptions={departmentLoadOptions}
            userLoadOptions={userLoadOptions}
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