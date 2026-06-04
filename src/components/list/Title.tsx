import type { FC } from "react";

interface TitleProps {
  title: string;
}

export const Title: FC<TitleProps> = ({ title }) => {
  return (
    <>
      <h6 className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "1.05rem", fontWeight: 600, color: "#212529" }}>
        <i className="bi bi-tag"></i>
        {title}
      </h6>
    </>
  );
};
