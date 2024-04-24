import { useLanguage } from "../../../../context/languageContext";
import "./postReporter.scss";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import RateStarInput from "../../reportComponent/inputComponent/rateInput/RateStarInput";
import { useState } from "react";
import { TextareaAutosize } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import MiniPost from "../../../post/MiniPost";
import { makeRequest } from "../../../../axios";
const PostReporter = ({ post, setShowReportPopup, showReportPopup }) => {
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
    formData.append("id", post.id);
    formData.append("rate", rate);
    makeRequest
      .post("/feedback/post", formData)
      .then((res) => {
        setSelectedReportFile(null);
        setRate(1);
        setReportDesc("");
        console.log(res);
        handleReport();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className="report-popup">
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
          <MiniPost post={post} />
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
export default PostReporter;
