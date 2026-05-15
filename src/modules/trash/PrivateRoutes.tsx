import type { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { List } from "./pages/List";

const PrivateRoutes: FC = () => {
  return (
    <Routes>
      <Route path="*" element={<List />} />
    </Routes>
  );
};

export default PrivateRoutes;
