import { useStore } from "@nanostores/react";
import { Link } from "react-router-dom";
import { breadcrumbsStore } from "@stores/BreadcrumbStore";

export const Breadcrumbs = () => {
  const breadcrumbs = useStore(breadcrumbsStore);

  if (!breadcrumbs.length) return null;

  return (
    <ul
      key="breadcrumbs"
      className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1"
    >
      {breadcrumbs.map(({ label, icon, path }, index) => (
        <li key={`${index}-${path}`} className="breadcrumb-item text-muted">
          {index < breadcrumbs.length - 1 ? (
            <Link to={path || ""} className="text-muted text-hover-primary">
              {icon ? icon : <></>}
              {label}
            </Link>
          ) : (
            <span className="text-dark fw-bold">{label}</span>
          )}
        </li>
      ))}
    </ul>
  );
};
