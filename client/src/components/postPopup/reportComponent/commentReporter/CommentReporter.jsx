import { useLanguage } from "../../../../context/languageContext";
import { useState } from "react";
import { makeRequest } from "../../../../axios";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import RateStarInput from "../inputComponent/rateInput/RateStarInput";
import { TextareaAutosize } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { URL_OF_BACK_END } from "../../../../axios";
import moment from "moment";
import "./commentReporter.scss";
const CommentReporter = ({ comment, setShowReportPopup, showReportPopup }) => {
  const { trl } = useLanguage();
  const [rate, setRate] = useState(1);
  const [reportDesc, setReportDesc] = useState("");
  const [selectedReportFile, setSelectedReportFile] = useState(null);
  const [previewReport, setPreviewReport] = useState("");
  const handleReport = () => {
    setReportDesc("");
    setShowReportPopup(!showReportPopup);
  };
  const handleRemoveReportFile = () => {
    setSelectedReportFile(null);
    setPreviewReport("");
  };
  const handleReportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedReportFile(file);
      setPreviewReport(URL.createObjectURL(file));
    }
  };
  const handleReportApi = () => {
    const formData = new FormData();
    formData.append("file", selectedReportFile);
    formData.append("desc", reportDesc);
    formData.append("id", comment.id);
    formData.append("rate", rate);
    makeRequest
      .post("/feedback/comment", formData)
      .then((res) => {
        setSelectedReportFile(null);
        setRate(1);
        setReportDesc("");
        console.log(res);
        handleReport();
      })
      .catch((e) => {
        alert(e);
        console.log(e);
      });
  };
  return (
    <div className="comment-report-popup">
      <div className="title">
        <ReportOutlinedIcon sx={{ marginRight: "8px", fontSize: "22px" }} />
        <span style={{ fontSize: "22px", fontWeight: "700" }}>
          {trl("Report")}
        </span>
      </div>
      <div className="popup-content">
        <RateStarInput onHandle={setRate}></RateStarInput>

        <TextareaAutosize
          className="text-input"
          minRows={1}
          placeholder={trl("Mô tả báo cáo của bạn")}
          defaultValue={reportDesc}
          onChange={(e) => setReportDesc(e.target.value)}
        />
        <div className="file-input">
          <input
            id="reportInput"
            type="file"
            accept="image/*,video/*"
            onChange={handleReportFileChange}
          />
          <label htmlFor="reportInput">
            <FontAwesomeIcon icon={faImages} />
          </label>
        </div>
        {previewReport && (
          <div className="file-preview">
            <div className="file-selected">
              {selectedReportFile &&
              selectedReportFile.type.startsWith("image") ? (
                <img src={previewReport} alt="Preview" />
              ) : (
                <video src={previewReport} controls />
              )}
              <button onClick={handleRemoveReportFile}>X</button>
            </div>
          </div>
        )}
        <div
          style={{
            pointerEvents: "none",
            maxHeight: "250px",
          }}
        >
          <div className="comment">
            <img
              src={URL_OF_BACK_END + `users/profilePic/` + comment.userId}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/upload/errorImage.png";
              }}
              alt={""}
              onClick={() => {
                window.location.href = `/profile/${comment.userId}`;
              }}
            />
            <div className="infocomment">
              <span
                onClick={() => {
                  window.location.href = `/profile/${comment.userId}`;
                }}
              >
                {comment.name}{" "}
                <span className="date">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </span>

              <p>{comment.desc}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="popup-action">
        <button className="report" onClick={handleReportApi}>
          {trl("REPORT")}
        </button>
        <button className="cancel" onClick={handleReport}>
          {trl("CANCEL")}
        </button>
      </div>
    </div>
  );
};
export default CommentReporter;
