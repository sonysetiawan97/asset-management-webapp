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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="150px"
                  viewBox="0 -960 960 960"
                  width="150px"
                  fill="#000000"
                >
                  <path d="M222-255q63-44 125-67.5T480-346q71 0 133.5 23.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.81-195q-57.81 0-97.31-39.69-39.5-39.68-39.5-97.5 0-57.81 39.69-97.31 39.68-39.5 97.5-39.5 57.81 0 97.31 39.69 39.5 39.68 39.5 97.5 0 57.81-39.69 97.31-39.68 39.5-97.5 39.5Zm.66 370Q398-80 325-111.5t-127.5-86q-54.5-54.5-86-127.27Q80-397.53 80-480.27 80-563 111.5-635.5q31.5-72.5 86-127t127.27-86q72.76-31.5 155.5-31.5 82.73 0 155.23 31.5 72.5 31.5 127 86t86 127.03q31.5 72.53 31.5 155T848.5-325q-31.5 73-86 127.5t-127.03 86Q562.94-80 480.47-80Zm-.47-60q55 0 107.5-16T691-212q-51-36-104-55t-107-19q-54 0-107 19t-104 55q51 40 103.5 56T480-140Zm0-370q34 0 55.5-21.5T557-587q0-34-21.5-55.5T480-664q-34 0-55.5 21.5T403-587q0 34 21.5 55.5T480-510Zm0-77Zm0 374Z" />
                </svg>
              )}
              <h4 className="mt-3">{fullNameUser}</h4>
              <p className="text-muted">{user?.email}</p>
              <div className="d-grid gap-2">
                <Link
                  to={`/profile/${user?.id}/update`}
                  className="btn btn-dark text-center"
                >
                  <svg
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#fff"
                    className="me-1"
                  >
                    <path d="M216-216h44.46l393.46-393.46-44.46-44.46L216-260.46V-216Zm-52 52v-118.38l497.62-498.39q8.07-8.24 17.37-11.73 9.3-3.5 19.49-3.5 10.2 0 19.47 3.27 9.28 3.27 17.97 11.58l44.85 44.46q8.31 8.69 11.77 18 3.46 9.31 3.46 19.17 0 10.51-3.64 20.06-3.65 9.55-11.59 17.46L282.38-164H164Zm580.38-535.15-45.23-45.23 45.23 45.23ZM631.3-631.3l-21.84-22.62 44.46 44.46-22.62-21.84Z" />
                  </svg>
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
