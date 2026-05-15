import type { FC } from "react";
import { Breadcrumbs } from "./Breadcrumb";
import { PageTitle } from "./PageTitle";

const PageHeader: FC = () => {
  return (
    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
      <PageTitle />
      <Breadcrumbs />
    </div>
  );
};

export default PageHeader;
