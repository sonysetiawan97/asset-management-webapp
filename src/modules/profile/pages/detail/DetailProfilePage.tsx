import { useTranslation } from "react-i18next";
import { Password } from "@components/form/inputs/Password";
import { useAuth } from "@hooks/useAuth";
import { Link } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import useFileDownload from "@hooks/useFileDownload";
import { useEffect, useState } from "react";

export const DetailProfilePage = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const password = watch("password");
  const { getFileBlob } = useFileDownload();

  const [urlImage, setUrlImage] = useState<string>("");

  const { user } = useAuth();
  const fullNameUser =
    user && user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.username;

  useEffect(() => {
    let objectUrl: string;

    const fetchImage = async () => {
      if (user?.photo) {
        try {
          const photoObject = JSON.parse(user.photo);
          const blob = await getFileBlob(photoObject);

          if (blob instanceof Blob) {
            objectUrl = URL.createObjectURL(blob);
            setUrlImage(objectUrl);
          } else {
            console.warn("Expected Blob, but got:", blob);
          }
        } catch (error) {
          console.error("Error parsing user photo:", error);
        }
      }
    };

    fetchImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.photo]);

  return (
    <div className="card border-0">
      <div className="card-body">
        <div className="py-5">
          <div className="row">
            <div className="col-md-3 col-12 text-center mb-4">
              {urlImage ? (
                <img
                  src={urlImage}
                  alt="User Avatar"
                  style={{
                    width: 150,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <i className="bi bi-person-fill" style={{ fontSize: "150px", color: "#000" }}></i>
              )}
              <h4 className="mt-3">{fullNameUser}</h4>
              <p className="text-muted">{user?.email}</p>
              <div className="d-grid gap-2">
                <Link
                  to={`/profile/${user?.id}/update`}
                  className="btn btn-dark text-center"
                >
                  <i className="bi bi-pencil me-1"></i>
                  {t("button.edit_profile")}
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  {t("button.change_password")}
                </button>
              </div>
            </div>

            <div className="col-md-9 col-12">
              <div className="row row-gap-3">
                <div className="col-sm-2">
                  <strong>Full Name</strong>
                </div>
                <div className="col-sm-10">{fullNameUser}</div>

                <div className="col-sm-2">
                  <strong>Phone</strong>
                </div>
                <div className="col-sm-10">(123) 456-7890</div>

                <div className="col-sm-2">
                  <strong>Company</strong>
                </div>
                <div className="col-sm-10">PT Sagara Xinix Solusitama</div>

                <div className="col-sm-2">
                  <strong>Joined</strong>
                </div>
                <div className="col-sm-10">March 15, 2024</div>

                <div className="col-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("button.change_password")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form action="">
                <Password
                  name="old_password"
                  label={t("modules.products.create.form.old_password")}
                  required={true}
                  validation={{ required: "Old password is required" }}
                />
                <hr className="mt-4 mb-3 border-dark-subtle" />
                <Password
                  name="password"
                  label={t("modules.products.create.form.new_password")}
                  required={true}
                />
                <Password
                  name="confirm_password"
                  label={t("modules.users.create.form.confirm_password")}
                  required={true}
                  validate={(value: string) =>
                    value === password || "Passwords do not match"
                  }
                />
              </form>
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t("button.cancel")}
              </button>
              <button type="button" className="btn btn-dark">
                {t("button.change_password")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailProfilePage;
