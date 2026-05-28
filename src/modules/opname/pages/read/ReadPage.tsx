import { type FC } from "react";
import { useParams } from "react-router-dom";
import { moduleName, type ReadModel } from "../../types/Model";
import { EditButton } from "@components/list/actions/EditButton";
import { CancelButton } from "@components/buttons/CancelButton";
import { useFindOneById } from "@hooks/request/useFindOneById";
import { LoadingPage } from "@components/loadings/LoadingPage";
import NotFound from "@modules/errors/pages/404NotFound";

const ReadPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useFindOneById<ReadModel>(moduleName, id);

  if (isLoading) return <LoadingPage />;
  if (error || !data) return <NotFound />;

  const sessionId = data.id;

  const { data: items, isLoading: itemsLoading } = useFindOneById<{ items: unknown[] }>(
    `${moduleName}/${sessionId}/items`,
    sessionId
  );

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>{sessionId}</strong>
            <EditButton id={sessionId} />
          </div>
          <div className="card-body">
            <table className="table table-sm table-borderless mb-0">
              <tbody>
                <tr>
                  <td className="text-muted" style={{ width: "180px" }}>Name</td>
                  <td>{data.name}</td>
                </tr>
                <tr>
                  <td className="text-muted">Start Date</td>
                  <td>{data.start_date ?? "—"}</td>
                </tr>
                <tr>
                  <td className="text-muted">End Date</td>
                  <td>{data.end_date ?? "—"}</td>
                </tr>
                <tr>
                  <td className="text-muted">Status</td>
                  <td>{data.status ?? "—"}</td>
                </tr>
                <tr>
                  <td className="text-muted">Notes</td>
                  <td>{data.notes ?? "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <strong>Progress</strong>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-2">
                <div className="p-3 border rounded text-center">
                  <div className="h4 mb-0">{data.total_items ?? 0}</div>
                  <small className="text-muted">Total Items</small>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="p-3 border rounded text-center">
                  <div className="h4 mb-0">{data.counted_items ?? 0}</div>
                  <small className="text-muted">Counted Items</small>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="p-3 border rounded text-center">
                  <div className="h4 mb-0">
                    {data.total_items ? Math.round(((data.counted_items ?? 0) / data.total_items) * 100) : 0}%
                  </div>
                  <small className="text-muted">Progress</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <strong>Items</strong>
          </div>
          <div className="card-body">
            {itemsLoading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
            ) : items ? (
              <p className="text-muted">{(items as unknown as { items: unknown[] }).items?.length ?? 0} items</p>
            ) : (
              <p className="text-muted">No items found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="col-12">
        <CancelButton to={`/${moduleName}`} />
      </div>
    </div>
  );
};

export { ReadPage };
export default ReadPage;
