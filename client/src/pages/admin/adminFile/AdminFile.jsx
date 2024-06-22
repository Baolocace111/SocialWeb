import { useLanguage } from "../../../context/languageContext";
import "./adminFile.scss";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube";
import FileBox from "../../../components/adminComponent/fileBox/FileBox";
const fetchFiles = (type, page) => {
  return makeRequest.get(`admin/files/${type}?page=${page}`).then((res) => {
    return res.data;
  });
};
const AdminFile = () => {
  const [type, setType] = useState("image");
  const { trl } = useLanguage();
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(
    [type, page],
    () => fetchFiles(type, page),
    { keepPreviousData: true }
  );
  return (
    <div className="adminFile">
      <h1>{trl("File Management") + " - " + trl(type)}</h1>
      <div className="changeType">
        <button
          className={`typeButton ${type === "image" ? "ison" : "isoff"}`}
          onClick={() => {
            setType("image");
          }}
        >
          {trl("image")}
        </button>
        <button
          className={`typeButton ${type === "video" ? "ison" : "isoff"}`}
          onClick={() => {
            setType("video");
          }}
        >
          {trl("video")}
        </button>
      </div>
      <div className="content">
        {isLoading ? (
          <NineCube />
        ) : error ? (
          <div className="error">{trl("Error")}</div>
        ) : (
          <div className="file-list">
            {data.files.map((file) => (
              <FileBox key={file} path={file} type={type} page={page}></FileBox>
            ))}
          </div>
        )}
      </div>
      <div className="pagination">
        <button
          className="paginationButton"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          {trl("Previous")}
        </button>
        <span className="pageIndicator">
          {trl("Page")} {page}
        </span>
        <button
          className="paginationButton"
          onClick={() =>
            setPage((old) => (!data || !data.files.length ? old : old + 1))
          }
          disabled={!data || !data.files.length}
        >
          {trl("Next")}
        </button>
      </div>
    </div>
  );
};
export default AdminFile;
