import type { FC } from "react";
import { SearchBar } from "./SearchBar";
import { SearchAdvanceBar } from "./SearchAdvanceBar";
import { CreateButton } from "./actions/CreateButton";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

type Props = {
  createUrl?: string;
}

export const ActionBar: FC<Props> = ({ createUrl }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="form-serach position-relative d-flex">
        <SearchBar />
        <SearchAdvanceBar />
      </div>
      <div className="group-btn">
        <AuthPrivilegesChecker link={createUrl}>
          <CreateButton />
        </AuthPrivilegesChecker>
      </div>
    </div>
  );
};
