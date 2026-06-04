import type { FC } from "react";

export const Dashboard: FC = () => {
  return (
    <div>
      <div className="card border-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-serach position-relative">
            <i className="bi bi-search position-absolute"></i>
            <input
              type="search"
              name=""
              id=""
              className="form-control border-dark"
            />
          </div>
          <div className="group-btn">
            <a href="" className="btn btn-dark">
              <i className="bi bi-plus-lg pb-1"></i>{" "}
              Create
            </a>
          </div>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
              <th className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>
                <div className="d-flex gap-1">
                  <a href="products/read" className="btn btn-link btn-sm">
                    <i className="bi bi-eye"></i>
                  </a>
                  <a href="" className="btn btn-link btn-sm">
                    <i className="bi bi-pencil"></i>
                  </a>
                  <a href="" className="btn btn-link btn-sm">
                    <i className="bi bi-trash"></i>
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
              <td>
                <div className="d-flex gap-1">
                  <a href="" className="btn btn-link btn-sm">
                    <i className="bi bi-eye"></i>
                  </a>
                  <a href="" className="btn btn-link btn-sm">
                    <i className="bi bi-pencil"></i>
                  </a>
                  <a href="" className="btn btn-link btn-sm">
                    <i className="bi bi-trash"></i>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
