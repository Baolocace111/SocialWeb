import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useState, useEffect } from "react";
import { useImperativeHandle } from "react";
import { URL_OF_BACK_END, makeRequest } from "../../axios";
import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import { useLanguage } from "../../context/languageContext";
import "./private.scss";

const Private = forwardRef((props, ref) => {
  const { trl } = useLanguage();
  const { post_id } = props;
  const savePrivate = () => {
    privateMutation.mutate(selectedUsers);
  };

  const queryClient = useQueryClient();
  useImperativeHandle(ref, () => ({
    savePrivate,
  }));

  const privateMutation = useMutation(
    (lists) =>
      makeRequest.post(`/posts/privatelist/${post_id}`, {
        list: lists.map((user) => user.id),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const {
    isLoading: ilFriend,
    error: eFriends,
    data: Friends,
  } = useQuery(["userData"], () => {
    return makeRequest.get("/friendship/allfriend").then((res) => res.data);
  });

  const {
    isLoading: ilPrivate,
    error: ePrivate,
    data: Privates,
  } = useQuery(["private"], () => {
    return makeRequest
      .post(`/posts/private/${post_id}`)
      .then((res) => res.data);
  });

  const [inputValue, setInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [validUsers, setValidUsers] = useState([]);
  const [firstcall, setFirstCall] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  useEffect(() => {
    if (firstcall && Friends && Privates) {
      setSelectedUsers(Privates);
      setValidUsers(
        Friends.filter(
          (item1) => !Privates.some((item2) => item1.id === item2.id)
        )
      );
      setFirstCall(false);
    }
  }, [firstcall, Friends, Privates]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value !== "") {
      setSuggestedUsers(
        validUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            user.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setSuggestedUsers(validUsers);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setValidUsers(validUsers.filter((u) => u.id !== user.id));
  };

  const handleSelectedUserClick = (user) => {
    setValidUsers([...validUsers, user]);
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  return (
    <div className="private-container">
      {ilFriend ? (
        <ThreePointLoading />
      ) : eFriends ? (
        <div className="error-message">Error loading friends list!</div>
      ) : (
        <>
          <input
            className="search-user-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={trl("Nhập tên người dùng...")}
          />
          <div className="users-suggestion">
            {validUsers.map((user) => (
              <div
                key={user.id}
                className="user-card"
                onClick={() => handleUserSelect(user)}
              >
                <img
                  className="profile-pic"
                  src={`${URL_OF_BACK_END}users/profilePic/${user.id}`}
                  alt={`${user.name}`}
                />
                <span className="user-name">{user.name}</span>
                <span className="action-icon">+</span>
              </div>
            ))}
          </div>
          <div className="selected-users-container">
            <h4>{trl("Danh sách người dùng được chọn:")}</h4>
            {ePrivate ? (
              <div className="error-message">Error loading private list!</div>
            ) : ilPrivate ? (
              <ThreePointLoading />
            ) : (
              <div className="selected-users">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="user-card"
                    onClick={() => handleSelectedUserClick(user)}
                  >
                    <img
                      className="profile-pic"
                      src={`/upload/${user.profilePic}`}
                      alt={`${user.name}`}
                    />
                    <span className="user-name">{user.name}</span>
                    <span className="action-icon">x</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
});
export default Private;
