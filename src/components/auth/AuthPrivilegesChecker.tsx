import React, { FC, ReactNode } from "react";
import { getAuth, PrivilegesValidation } from "./AuthHelpers";
import { LinkProps } from "react-router-dom";

type AuthPrivilegesCheckerProps = {
  children: ReactNode;
  link?: string;
  method?: string;
};

export const AuthPrivilegesChecker: FC<AuthPrivilegesCheckerProps> = ({
  children,
  link,
  method,
}) => {
  const auth = getAuth();

  let hide = true;
  let path: string | undefined;

  if (link) {
    path = link;
  } else if (React.isValidElement(children)) {
    const childProps = children.props as Partial<LinkProps>;

    if (typeof childProps.to === "string") {
      path = childProps.to;
    }
  }

  if (path) {
    const isHavePrivilege = PrivilegesValidation({ auth, path, method });
    hide = !isHavePrivilege;
  }

  return <>{!hide ? children : null}</>;
};
