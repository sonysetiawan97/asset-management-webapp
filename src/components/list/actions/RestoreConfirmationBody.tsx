import type { FC } from "react";

interface RestoreConfirmationBodyProps {
  id: string;
}

export const RestoreConfirmationBody: FC<RestoreConfirmationBodyProps> = ({
  id,
}) => {
  return (
    <div>
      <p>Are you sure you want to restore this item (ID: {id})?</p>
    </div>
  );
};
