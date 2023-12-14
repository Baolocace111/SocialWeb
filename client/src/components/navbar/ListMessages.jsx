import "./listMessages.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize, faPenToSquare, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";

const ListMessages = ({ handleClose, ListMessages }) => {
  return (
    <div className="list-messages">
      <div className="title-messages">
        <span>Đoạn chat</span>
        <div className="more">
          <div className="icon"><MoreHorizIcon /></div>
          <div className="icon"><FontAwesomeIcon icon={faMaximize} /></div>
          <div className="icon"><FontAwesomeIcon icon={faPenToSquare} /></div>
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Search on Tiny messages..."
          className="input-field"
        />
        <span className="icon-container">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
      </div>
      {ListMessages.map((mess) => {
        return <Messages key={mess.message_id} mess={mess} handleClose={handleClose}></Messages>;
      })}
    </div>
  );
};
const Messages = ({ mess, handleClose }) => {
  const { chattingUser, setChattingUser } = useContext(ChatContext);
  const handleAddChatBox = (user) => {
    setChattingUser(removeDuplicateUnits([...chattingUser, ...[user]]));
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
      <img src={"/upload/" + mess.profilePic} alt="" />
      <div className="username">
        <div className="name">{mess.name}</div>
        <div className={`mess ${mess.status === 0 ? 'not-read' : ''}`}>
          {mess.isme !== 0 && "Bạn : "}
          {mess.message}
        </div>
        <div className="time">
          {moment(mess.message_created_at).fromNow()}
        </div>
      </div>
      {!mess.isme && mess.status === 0 && <div className="new-message"></div>}
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
