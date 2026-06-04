import type { FC } from "react";
import { Link } from "react-router-dom";

interface EditButtonProps {
  id: string;
}

export const EditButton: FC<EditButtonProps> = ({ id }) => {
  return (
    <Link to={`${id}/update`} className="btn btn-icon button-link">
      <i className="bi bi-pencil"></i>
    </Link>
  );
};
