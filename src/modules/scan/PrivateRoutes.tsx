import { useEffect, type FC } from "react";
import { Route, Routes } from "react-router-dom";
import { setPageTitle } from "@stores/PageHeaderStore";
import { moduleName } from "./types/Model";
import ListWrapper from "./pages/list/ListWrapper";

const PrivateRoutes: FC = () => {
  useEffect(() => {
    setPageTitle(moduleName);
  }, []);

  return (
    <Routes>
      <Route index element={<ListWrapper />} />
    </Routes>
  );
};

export default PrivateRoutes;
