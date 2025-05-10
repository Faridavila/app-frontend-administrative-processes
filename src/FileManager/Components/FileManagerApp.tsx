import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./../../../app-assets/css/components.css";
import "./../../../app-assets/css/pages/app-file-manager.css";
import "./../../../app-assets/css/bootstrap-extended.css";
import "./../../../app-assets/css/bootstrap.css";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const FileManagerApp = () => {
  const [searchText, setSearchText] = useState("");
  const [fileView, setFileView] = useState("grid");

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchText(e.target.value);
  };

  const handleViewChange = (view: React.SetStateAction<string>) => {
    setFileView(view);
  };

  return (
    <div className="app-content content file-manager-application">
      <div className="content-overlay"></div>

      <div className="header-navbar-shadow"></div>

     
      <h3 className="header-title">
        Gestión de Archivos{" "}
        <FavoritoButton path="/file-manager" label="Gestión de archivos" />
      </h3>
      <p>Administre la gestión de archivos.</p>
      <div className="content-area-wrapper container-xxl p-0">
        <div className="sidebar-left">
          <div className="sidebar">
            <div className="sidebar-file-manager">
              <div className="sidebar-inner">
                <div className="dropdown dropdown-actions">
                  <button
                    className="btn btn-primary add-file-btn text-center w-100"
                    type="button"
                    id="addNewFile"
                  >
                    <span className="align-middle">Add New</span>
                  </button>
                  <div className="dropdown-menu">
                    <div className="dropdown-item">
                      <i className="me-25"></i>
                      <span className="align-middle">Folder</span>
                    </div>
                    <div className="dropdown-item">
                      <i className="me-25"></i>
                      <span className="align-middle">File Upload</span>
                      <input type="file" id="file-upload" hidden />
                    </div>
                    <div className="dropdown-item">
                      <i className="me-25"></i>
                      <span className="align-middle">Folder Upload</span>
                    </div>
                  </div>
                </div>
                <div className="sidebar-list">
                  <div className="list-group">
                    <a
                      href="#"
                      className="list-group-item list-group-item-action active"
                    >
                      <i className="me-50 font-medium-3"></i>
                      <span className="align-middle">Important</span>
                    </a>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="me-50 font-medium-3"></i>
                      <span className="align-middle">Recents</span>
                    </a>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="me-50 font-medium-3"></i>
                      <span className="align-middle">Deleted Files</span>
                    </a>
                  </div>
                  <div className="list-group list-group-labels">
                    <h6 className="section-label px-2 mb-1">Labels</h6>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="me-50 font-medium-3"></i>
                      <span className="align-middle">Documents</span>
                    </a>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="me-50 font-medium-3"></i>
                      <span className="align-middle">Images</span>
                    </a>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="me-50 font-medium-3"></i>
                      <span className="align-middle">Videos</span>
                    </a>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="me-50 font-medium-3"></i>
                      <span className="align-middle">Audio</span>
                    </a>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="me-50 font-medium-3"></i>
                      <span className="align-middle">Archives</span>
                    </a>
                  </div>
                  <div className="storage-status mb-1 px-2">
                    <h6 className="section-label mb-1">Storage Status</h6>
                    <div className="d-flex align-items-center cursor-pointer">
                      <i className="font-large-1"></i>
                      <div className="file-manager-progress ms-1">
                        <span>68GB used of 100GB</span>
                        <div
                          className="progress progress-bar-primary my-50"
                          style={{ height: "6px" }}
                        >
                          <div
                            className="progress-bar"
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-right">
          <div className="content-wrapper container-xxl p-0">
            {/* Header added here */}

            <div className="content-header row"></div>
            <div className="content-body">
              <div className="body-content-overlay"></div>

              <div className="file-manager-main-content">
                <div className="file-manager-content-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="input-group input-group-merge shadow-none m-0 flex-grow-1">
                      <span className="input-group-text border-0">
                        <i className="search-icon"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control files-filter border-0 bg-transparent"
                        placeholder="Search"
                        value={searchText}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="btn-group view-toggle ms-50" role="group">
                      <input
                        type="radio"
                        className="btn-check"
                        name="view-btn-radio"
                        data-view="grid"
                        id="gridView"
                        checked={fileView === "grid"}
                        onChange={() => handleViewChange("grid")}
                        autoComplete="off"
                      />
                      <label
                        className="btn btn-outline-primary p-50 btn-sm"
                        htmlFor="gridView"
                      >
                        <i className="grid-icon"></i>
                      </label>
                      <input
                        type="radio"
                        className="btn-check"
                        name="view-btn-radio"
                        data-view="list"
                        id="listView"
                        checked={fileView === "list"}
                        onChange={() => handleViewChange("list")}
                        autoComplete="off"
                      />
                      <label
                        className="btn btn-outline-primary p-50 btn-sm"
                        htmlFor="listView"
                      >
                        <i className="list-icon"></i>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="file-manager-content-body">
                  {/* Your additional components or content here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagerApp;
