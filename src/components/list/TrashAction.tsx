import type { FC } from "react";
import { RestoreButton } from "./actions/RestoreButton";
import { RemoveButton } from "./actions/RemoveButton";

interface TrashActionProps {
  id: string;
  module: string;
}

export const TrashAction: FC<TrashActionProps> = ({ id, module }) => {
  return (
    <div className="d-flex gap-1 align-items-center">
      <RestoreButton id={id} module={module} />
      <RemoveButton id={id} module={module} />
    </div>
  );
};
