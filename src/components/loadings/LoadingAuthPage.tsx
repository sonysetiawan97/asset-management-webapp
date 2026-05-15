import type { FC } from "react";

export const LoadingAuthPage: FC = () => {
  return <>
   <div className="loading auth">
    <div className="loader">
      <div className="loader-wheel"></div>
      <div className="loader-text"></div>
    </div>

  </div>
  </>;
};
