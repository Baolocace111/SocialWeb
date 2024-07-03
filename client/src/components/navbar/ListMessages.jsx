import "./listMessages.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMaximize,
  faPenToSquare,
  faMagnifyingGlass,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { URL_OF_BACK_END, makeRequest } from "../../axios";
import { useLanguage } from "../../context/languageContext";
import { useEffect } from "react";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
const ListMessages = ({ handleClose, ListMessages, reset, setLoading }) => {
  const { trl } = useLanguage();

  return (
    <div className="list-messages">
      <div className="title-messages">
        <span>{trl("Đoạn chat")}</span>
        <div className="more">
          <div className="icon">
            <MoreHorizIcon />
          </div>
          <div className="icon">
            <FontAwesomeIcon icon={faMaximize} />
          </div>
          <div className="icon">
            <FontAwesomeIcon icon={faPenToSquare} />
          </div>
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder={trl("Search on Tiny messages...")}
          className="input-field"
        />
        <span className="icon-container">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
      </div>
      {ListMessages.map((mess) => {
        return (
          <Messages
            key={mess.message_id}
            mess={mess}
            handleClose={handleClose}
            reset={reset}
            setLoading={setLoading}
          ></Messages>
        );
      })}
    </div>
  );
};
const Messages = ({ mess, handleClose, reset, setLoading }) => {
  const { trl, language } = useLanguage();
  useEffect(() => {
    if (language === "jp") moment.locale("ja");
    if (language === "vn") moment.locale("vi");
    else moment.locale("en");
  }, []);
  const { chattingUser, setChattingUser } = useContext(ChatContext);
  const handleAddChatBox = (user) => {
    setChattingUser(removeDuplicateUnits([...chattingUser, ...[user]]));
  };
  const handleEraser = () => {
    if (
      window.confirm(
        trl("Bạn có muốn xóa tất cả tin nhắn của người này không ?") +
          " - " +
          mess.name
      )
    ) {
      setLoading(true);
      makeRequest
        .delete(`messages/deleteall/${mess.user_id}`)
        .then(() => {
          reset();
        })
        .catch((e) => {
          alert(e.response?.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div
      className="userContainer"
      onClick={() => {
        handleAddChatBox({
          id: mess.user_id,
          username: mess.username,
          name: mess.name,
          profilePic: mess.profilePic,
        });
        handleClose();
      }}
    >
      <img
        src={URL_OF_BACK_END + `users/profilePic/` + mess.user_id}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/upload/errorImage.png";
        }}
        alt={""}
      />
      <div className="username">
        <div className="name">{mess.name}</div>
        <div className={`mess ${mess.status === 0 ? "not-read" : ""}`}>
          {mess.isme !== 0 && `${trl("Bạn")}: `}
          {mess.isdelete
            ? ". . ."
            : mess.image
            ? trl("image") + "/" + trl("video")
            : mess.message}
        </div>
        <div className="time">{moment(mess.message_created_at).fromNow()}</div>
      </div>
      {!mess.isme && mess.status === 0 && <div className="new-message"></div>}
      <div className="btndel" onClick={handleEraser}>
        <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
      </div>
    </div>
  );
};
function removeDuplicateUnits(arr) {
  const uniqueUnits = new Map();

  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }

  return Array.from(uniqueUnits.values());
}
export default ListMessages;
