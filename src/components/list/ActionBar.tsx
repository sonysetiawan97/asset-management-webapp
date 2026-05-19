import type { FC } from "react";
import { SearchBar } from "./SearchBar";
import { SearchAdvanceBar } from "./SearchAdvanceBar";
import { CreateButton } from "./actions/CreateButton";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

type Props = {
  createUrl?: string;
  showFilter?: boolean;
}

/**
 * ActionBar — default layout for list page action row.
 *
 * Layout: [SearchBar ........] [CreateButton]
 *
 * To add Filter button, import SearchAdvanceBar and add it:
 *   <SearchAdvanceBar />
 * Only include when the list page needs field-based filtering beyond text search.
 */
export const ActionBar: FC<Props> = ({ createUrl, showFilter = false }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center gap-2">
        <div className="position-relative d-flex align-items-center flex-grow-1" style={{ maxWidth: "360px" }}>
          <SearchBar />
        </div>
        {showFilter && (
          <SearchAdvanceBar />
        )}
      </div>
      <div className="group-btn">
        <AuthPrivilegesChecker link={createUrl}>
          <CreateButton />
        </AuthPrivilegesChecker>
      </div>
    </div>
  );
};
