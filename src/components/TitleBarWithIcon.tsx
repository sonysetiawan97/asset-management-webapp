import type { FC, ReactNode } from "react";

interface TitleBarWithIconProps {
  children?: ReactNode;
  title: string;
}

const TitleBarWithIcon: FC<TitleBarWithIconProps> = ({ children, title }) => {
  return (
    <h6 className="d-flex align-items-center gap-2 justify-content-start mb-4">
      {children}
      <div className="title">{title}</div>
    </h6>
  );
};

export { TitleBarWithIcon };
