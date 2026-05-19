import type { FC } from "react";

export const EmptyData: FC = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor" className="mb-3 opacity-25">
        <path d="M319-250h322v-60H319v60Zm0-170h322v-60H319v60ZM220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h336l224 224v516q0 24-18 42t-42 18H220Zm0-60h520v-474L534-820H220v680Zm0-680v186-186 680-680Z"/>
      </svg>
      <p className="mb-0 fw-light" style={{ fontSize: "0.95rem" }}>No data found</p>
    </div>
  );
};
