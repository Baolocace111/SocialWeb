import "./feedbackInformation.scss";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { useLanguage } from "../../../context/languageContext";
import { useEffect, useState } from "react";
import moment from "moment";
import StarRating from "../../adminComponent/display/StarRating";
import ShowPosts from "../../posts/ShowPosts";
const FeedbackInformation = ({ feedback }) => {
  const { trl, language } = useLanguage();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState(null);
  const [team, setTeam] = useState(null);
  const [stories, setStories] = useState(null);
  const [imageFeedback, setImageFeedback] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (language === "jp") {
      moment.locale("ja");
    } else if (language === "vn") {
      moment.locale("vi");
    } else {
      moment.locale("en");
    }
  }, []);
  useEffect(() => {
    setImageFeedback(true);
    if (feedback.comment_id) {
    } else if (feedback.post_id) {
      makeRequest
        .get(`admin/post/${feedback.post_id}`)
        .then((res) => {
          setPost(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.data);
        });
    } else if (feedback.user_reported_userid) {
    } else if (feedback.teamid) {
    } else if (feedback.stories_id) {
    }
  }, [feedback]);
  const progressType = (progress) => {
    if (progress === 0) return trl("chưa xử lý");
    else if (progress === 1) return trl("đang xử lý");
    else if (progress === 2) return trl("đã xử lý");
    else return "x";
  };
  return (
    <div className="feedback">
      <div className="userinfor">
        <img
          src={URL_OF_BACK_END + `users/profilePic/` + feedback.userid}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/upload/errorImage.png";
          }}
          alt={""}
        />
        <div className="details">
          <span
            className="name"
            onClick={() => {
              window.location.href = `/profile/${feedback.userid}`;
            }}
          >
            {feedback.name}
          </span>
          <span className="date">{moment(feedback.createdAt).fromNow()}</span>
        </div>
      </div>
      <div className="feedbackinfor">
        <div className="desc">{feedback?.desc}</div>
        {imageFeedback && (
          <img
            src={URL_OF_BACK_END + "admin/feedback/getimage/" + feedback.id}
            onError={(e) => {
              setImageFeedback(false);
            }}
            alt=""
          ></img>
        )}
        <div className="rate">
          <StarRating rate={feedback.rate}></StarRating>
        </div>
        <div className="state">
          {trl("State")}: {progressType(feedback.status)}
        </div>
        <div className="response">
          <input
            placeholder={trl("Enter your response")}
            value={!(feedback.response === null) ? feedback.response : ""}
            onChange={() => {}}
          ></input>
        </div>
      </div>
      {feedback.post_id && (
        <div>
          <ShowPosts
            error={error}
            isLoading={isLoading}
            posts={[post]}
          ></ShowPosts>
        </div>
      )}
      <div></div>
    </div>
  );
};
export default FeedbackInformation;
