import { type FC } from "react";
import { UnderConstruction } from "@components/misc/UnderConstruction";
import { setBreadcrumbs } from "@stores/BreadcrumbStore";
import { useEffect } from "react";

interface Props {
  moduleLabel: string;
  modulePath: string;
}

export const UnderConstructionListWrapper: FC<Props> = ({ moduleLabel, modulePath }) => {
  useEffect(() => {
    setBreadcrumbs([{ label: "Home", path: "/" }, { label: moduleLabel, path: `/${modulePath}` }]);
  }, [moduleLabel, modulePath]);

  return <UnderConstruction title={`${moduleLabel} page is under construction`} />;
};

export default UnderConstructionListWrapper;