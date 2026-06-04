import type { FC } from "react";
import { Link } from "react-router-dom";

interface ReadButtonProps {
  id: string;
}

export const ReadButton: FC<ReadButtonProps> = ({ id }) => {
  return (
    <Link to={`${id}`} className="btn btn-icon button-link">
      <i className="bi bi-eye"></i>
    </Link>
  );
};
