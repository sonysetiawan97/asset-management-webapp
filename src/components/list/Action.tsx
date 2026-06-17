import type { FC } from "react";
import { ReadButton } from "@components/list/actions/ReadButton";
import { EditButton } from "@components/list/actions/EditButton";
import { DeleteButton } from "@components/list/actions/DeleteButton";

interface ActionProps {
  id: string;
}

export const Action: FC<ActionProps> = ({ id }) => {
  return (
    <div className="d-flex gap-1 align-items-center">
      <ReadButton id={id} />
      <EditButton id={id} />
      <DeleteButton id={id} />
    </div>
  );
};
