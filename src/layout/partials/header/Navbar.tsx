import type { FC } from "react";
// import { Notification } from "./Notification";
import { UserProfile } from "./UserProfile";

const Navbar: FC = () => {
  return (
    <div className="d-flex align-items-center">
      {/* <Notification /> */}
      <UserProfile />
    </div>
  );
};

export default Navbar;
