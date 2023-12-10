import "./listMessages.scss";
import moment from "moment";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";

const ListMessages = ({ ListMessages }) => {
  return (
    <>
      {ListMessages.map((mess) => {
        return <Messages key={mess.message_id} mess={mess}></Messages>;
      })}
    </>
  );
};
const Messages = ({ mess }) => {
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
