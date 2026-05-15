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
        <svg
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#1f1f1f"
        >
          <title>notification</title>
          <path d="M96-96v-696q0-29 21.15-50.5T168-864h387q-3 18-3 36t3 36H168v522l42-42h582v-330q18-5 37.5-15t34.5-21v366q0 29.7-21.5 50.85Q821-240 792-240H240L96-96Zm72-696v480-480Zm576 84q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
        </svg>
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
