import { type FC } from "react";


export const SearchAdvanceBar: FC = () => {


  return (
    <div className="position-relative d-flex align-items-center">
      <div className="dropdown ms-2">
        <button type="button" className="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M470.77-200q-13.15 0-21.96-8.81T440-230.77v-223.08L224.15-726.77q-8.07-10.77-2.19-22Q227.85-760 240.77-760h478.46q12.92 0 18.81 11.23 5.88 11.23-2.19 22L520-453.85v223.08q0 13.15-8.81 21.96T489.23-200h-18.46ZM480-468l198-252H282l198 252Zm0 0Z"/></svg>
        </button>
        <form className="dropdown-menu p-4" style={{minWidth: '320px'}}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="email" className="form-control" id="name" placeholder="Name"/>
          </div>
          <div className="mb-3">
            <label htmlFor="tlp" className="form-label">Tlp</label>
            <input type="password" className="form-control" id="tlp" placeholder="TLP"/>
          </div>
          <button type="submit" className="btn btn-dark d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M470.77-200q-13.15 0-21.96-8.81T440-230.77v-223.08L224.15-726.77q-8.07-10.77-2.19-22Q227.85-760 240.77-760h478.46q12.92 0 18.81 11.23 5.88 11.23-2.19 22L520-453.85v223.08q0 13.15-8.81 21.96T489.23-200h-18.46ZM480-468l198-252H282l198 252Zm0 0Z"/></svg>
            Filter
          </button>
        </form>
      </div>
    </div>


  );
};
