import type { FC } from "react";
import { Link } from "react-router-dom";

export const Notification: FC = () => {
  return (
    <div className="dropdown me-2">

      <button
        className="bg-transparent border-0 shadow-none d-flex align-items-center gap-1 px-0"
        id="dropdownUserButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-bell"></i>
      </button>

      {/* <ul className="dropdown-menu p-2" aria-labelledby="dropdownUserButton">
        <li>
          <Link to={{ pathname: "/" }}>list 1</Link>
        </li>
        <li>
          <Link to={{ pathname: "/" }}>list 2</Link>
        </li>
        <li>
          <Link to={{ pathname: "/" }}>list 3</Link>
        </li>
      </ul> */}
      <div className="dropdown-menu w-25 dropdown-menu-end card-notif" aria-labelledby="dropdownUserButton">
        <div className="list-group border-0">
          <Link to={{ pathname: "/" }} className="list-group-item list-group-item-action border-0">
            <div className="d-flex w-100 justify-content-between">
              <small className="text-body-secondary">Lorem ipsum dolor sit amet consectetur adipisicing elit</small>
              <small className="text-body-secondary date">1 days ago</small>
            </div>
          </Link>
          <Link to={{ pathname: "/" }} className="list-group-item list-group-item-action border-0">
            <div className="d-flex w-100 justify-content-between">
              <small className="text-body-secondary">Ipsa temporibus voluptatum ratione voluptates</small>
              <small className="text-body-secondary date">3 days ago</small>
            </div>
          </Link>
          <Link to={{ pathname: "/" }} className="list-group-item list-group-item-action border-0">
            <div className="d-flex w-100 justify-content-between">
              <small className="text-body-secondary">And some muted small print.</small>
              <small className="text-body-secondary date">5 days ago</small>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};
