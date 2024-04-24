import { useState, useEffect, useCallback } from "react";
import { makeRequest } from "../../../axios";
import { URL_OF_BACK_END } from "../../../axios";
import "./adminFeedback.scss";
import { useLanguage } from "../../../context/languageContext";
import StarRating from "../../../components/adminComponent/display/StarRating";
const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const { trl } = useLanguage();

  const getFeedbacks = useCallback(async () => {
    try {
      let url;
      if (status === "all") {
        url = `/admin/feedback/get/${page}`;
      } else {
        url = `/admin/feedback/getbystatus?status=${status}&page=${page}`;
      }
      const response = await makeRequest.get(url);
      setFeedbacks(response.data);
    } catch (error) {
      console.error(`Error getting feedbacks: ${error}`);
    }
  }, [page, status]);

  useEffect(() => {
    getFeedbacks();
  }, [getFeedbacks]);

  const handleRowClick = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <div className="adminfeedback">
      <h1>{trl("Feedbacks")}</h1>
      <select value={status} onChange={handleStatusChange}>
        <option value="all">{trl("All")}</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{trl("Description")}</th>
            <th>{trl("User Name")}</th>
            <th>{trl("Rate")}</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr
              key={feedback.id}
              onClick={() => handleRowClick(feedback)}
              className={`status-${feedback.status}`}
            >
              <td>{feedback.id}</td>
              <td>{feedback.desc}</td>
              <td>
                <img
                  className="userimg"
                  src={URL_OF_BACK_END + `users/profilePic/` + feedback.userid}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/upload/errorImage.png";
                  }}
                  alt={""}
                />
                {feedback.name}
              </td>
              <td>
                <StarRating rate={feedback.rate}></StarRating>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handlePageChange(page - 1)}>Prev</button>
      <span>{page && page}</span>
      <button onClick={() => handlePageChange(page + 1)}>Next</button>
      {selectedFeedback && (
        <div>
          <h2>Feedback Details</h2>
          <p>ID: {selectedFeedback.id}</p>
          <p>Description: {selectedFeedback.desc}</p>
          <p>User ID: {selectedFeedback.userid}</p>
          <p>Rate: {selectedFeedback.rate}</p>
          <img
            src={URL_OF_BACK_END + `users/profilePic/` + selectedFeedback.userid}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/upload/errorImage.png";
            }}
            alt={""}
          />
        </div>
      )}
    </div>
  );
};
export default AdminFeedback;
