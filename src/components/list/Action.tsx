import type { FC } from "react";
import { ReadButton } from "@components/list/actions/ReadButton";
import { EditButton } from "@components/list/actions/EditButton";
import { DeleteButton } from "@components/list/actions/DeleteButton";
import { AuthPrivilegesChecker } from "@components/auth/AuthPrivilegesChecker";

interface ActionProps {
  id: string;
  module: string;
  privilegeUrl?: {
    read: string;
    update: string;
    delete: string;
  }
}

export const Action: FC<ActionProps> = ({ id, module, privilegeUrl }) => {
  const { read, update, delete: deleteUrl } = privilegeUrl ?? {};

  return (
    <div className="d-flex gap-1 align-items-center">
      <AuthPrivilegesChecker link={read}>
        <ReadButton id={id} />
      </AuthPrivilegesChecker>
      <AuthPrivilegesChecker link={update}>
        <EditButton id={id} />
      </AuthPrivilegesChecker>
      <AuthPrivilegesChecker link={deleteUrl}>
        <DeleteButton id={id} module={module} />
      </AuthPrivilegesChecker>
    </div>
  );
};
