import type { FC } from "react";

interface DeleteConfirmationBodyProps {
  id: string;
}

export const DeleteConfirmationBody: FC<DeleteConfirmationBodyProps> = ({
  id,
}) => {
  return (
    <div>
      <p>Are you sure you want to delete this item (ID: {id})?</p>
    </div>
  );
};
