import React, { FC, ReactNode } from "react";
import { getAuth, PrivilegesValidation } from "./AuthHelpers";
import { LinkProps } from "react-router-dom";

type AuthPrivilegesCheckerProps = {
  children: ReactNode;
  link?: string;
};

export const AuthPrivilegesChecker: FC<AuthPrivilegesCheckerProps> = ({
  children,
  link,
}) => {
  const auth = getAuth();

  let hide = true;
  let path: string | undefined;

  if (React.isValidElement(children)) {
    const childProps = children.props as Partial<LinkProps>;

    if (typeof childProps.to === "string") {
      path = childProps.to;
    }
  }

  if (!path && link) {
    path = link;
  }

  if (path) {
    const isHavePrivilege = PrivilegesValidation({ auth, path });
    hide = !isHavePrivilege;
  }

  return <>{!hide ? children : null}</>;
};
