import "./feedbackInformation.scss";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { useLanguage } from "../../../context/languageContext";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import StarRating from "../../adminComponent/display/StarRating";
import ShowPosts from "../../posts/ShowPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
const FeedbackInformation = ({ feedback }) => {
  const { trl, language } = useLanguage();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState(null);

  const [team, setTeam] = useState(null);
  const [stories, setStories] = useState(null);
  const [action, setAction] = useState(feedback.status);
  const [response, setResponse] = useState(feedback.response);
  const [imageFeedback, setImageFeedback] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleDeleteFeedback = () => {
    makeRequest
      .delete(`admin/feedback/delete/${feedback.id}`)
      .then((response) => {
        window.location.reload();
      })
      .catch((e) => {
        console.log(e.response);
        alert(e.response.data);
      });
  };
  const handleClickDO = () => {
    makeRequest
      .post("admin/feedback/handle", {
        type: parseInt(action),
        feedback: { id: feedback.id, response: response },
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((e) => {
        console.log(e.response);
        alert(e.response.data);
      });
  };
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
      makeRequest
        .get(`admin/comment/get/${feedback.comment_id}`)
        .then((res) => {
          setComment(res.data);

          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.data);
        });
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
      <div className="tabUserInfor">
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
        <div className="deleteBtn" onClick={handleDeleteFeedback}>
          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
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
            value={!(response === null) ? response : ""}
            onChange={(e) => {
              setResponse(e.target.value);
            }}
          ></input>
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
            }}
          >
            <option value="0">{trl("chưa xử lý")}</option>
            <option value="1">{trl("đang xử lý")}</option>
            <option value="2">{trl("đã xử lý")}</option>
            <option value="3">{trl("delete")}</option>
          </select>
          <button onClick={handleClickDO}>{trl("DO")}</button>
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
      {feedback.comment_id && !isLoading && comment && (
        <div className="commentbox">
          <div className="comment">
            <img
              className="avatar"
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
                {comment.userName}{" "}
                <span className="date">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </span>

              <p>{comment.desc}</p>
              {comment.image && (
                <img
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/upload/errorImage.png";
                  }}
                  src={`${URL_OF_BACK_END}admin/commentimage/get/${comment.id}`}
                  alt=""
                ></img>
              )}
            </div>
          </div>

          {
            <ShowPosts
              error={error}
              isLoading={null}
              posts={[comment.post]}
              hidden={true}
            ></ShowPosts>
          }
        </div>
      )}
    </div>
  );
};
export default FeedbackInformation;
