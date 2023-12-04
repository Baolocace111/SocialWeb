import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { forwardRef, useState } from "react";
import { useImperativeHandle, useEffect } from "react";
import { makeRequest } from "../../axios";
import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";

const Private = forwardRef((props, ref) => {
  const { post_id } = props;
  const savePrivate = () => {
    privateMutation.mutate(selectedUsers);
  };
  const queryClient = useQueryClient();
  useImperativeHandle(ref, () => ({
    savePrivate,
  }));

  const privateMutation = useMutation(
    (lists) => {
      return makeRequest.post("/posts/privatelist/" + post_id, {
        list: lists.map((user) => user.id),
      });
    },
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
    return makeRequest.get("/friendship/allfriend").then((res) => {
      return res.data;
    });
  });
  const {
    isLoading: ilPrivate,
    error: ePrivate,
    data: Privates,
  } = useQuery(["private"], () => {
    return makeRequest.post("/posts/private/" + post_id).then((res) => {
      return res.data;
    });
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [validUsers, setValidUsers] = useState([]);
  const [firstcall, setFirstCall] = useState(true);

  //   if (firstcall && Friends && Privates) {
  //     setValidUsers(Friends);
  //     setSuggestedUsers(validUsers);
  //     setSelectedUsers(Privates);
  //     setValidUsers(
  //       Friends
  //       //   Friends.filter(
  //       //     (item1) => !Privates.find((item2) => item1.id === item2.id)
  //       //   )
  //     );
  //     console.log("value:", validUsers);
  //     console.log(
  //       "function:",
  //       Friends.filter(
  //         (item1) => !Privates.find((item2) => item1.id === item2.id)
  //       )
  //     );

  //     setFirstCall(false);
  //   }

  useEffect(() => {
    if (firstcall && Friends && Privates) {
      setSelectedUsers(Privates);
      setValidUsers(
        Friends.filter(
          (item1) => !Privates.find((item2) => item1.id === item2.id)
        )
      );
      setFirstCall(false);
    }
  }, [firstcall, Friends, Privates]);
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    // Tìm kiếm người dùng có username hoặc name chứa giá trị nhập vào
    if (value !== "") {
      setSuggestedUsers(
        validUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            user.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else setSuggestedUsers(validUsers);
  };

  const handleUserSelect = (user) => {
    // Thêm người dùng vào danh sách được chọn và loại bỏ khỏi danh sách gợi ý
    setSelectedUsers([...selectedUsers, user]);
    setSuggestedUsers(suggestedUsers.filter((u) => u.id !== user.id));
    setValidUsers(validUsers.filter((u) => u.id !== user.id));
  };

  const handleSelectedUserClick = (user) => {
    setValidUsers([...validUsers, user]);
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  return (
    <>
      {ilFriend ? (
        <>
          <ThreePointLoading></ThreePointLoading>
        </>
      ) : eFriends ? (
        <>
          <p>X X</p>
          <p> _ </p>
          <p>Im Dead!!</p>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Nhập tên người dùng"
            />
            <div style={{ border: "solid", height: "150px", width: "160px" }}>
              {suggestedUsers.map((user) => (
                <div
                  key={user.id}
                  style={{
                    background: "grey",
                    width: "fit-content",
                    gap: "10px",
                    borderRadius: "30px",
                    cursor: "pointer",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => handleUserSelect(user)}
                >
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "99%",
                    }}
                    src={"/upload/" + user.profilePic}
                    alt=""
                  />
                  {user.name}
                  <span style={{ margin: "10px" }}>+</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4>Danh sách người dùng được chọn:</h4>
            {ePrivate ? (
              <>
                <p>X X</p>
                <p> _ </p>
                <p>Im Dead!!</p>
              </>
            ) : ilPrivate ? (
              <ThreePointLoading></ThreePointLoading>
            ) : (
              <div style={{ border: "solid", height: "150px", width: "160px" }}>
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectedUserClick(user)}
                    style={{
                      background: "grey",
                      width: "fit-content",
                      gap: "10px",
                      borderRadius: "30px",
                      cursor: "pointer",
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "99%",
                      }}
                      src={"/upload/" + user.profilePic}
                      alt=""
                    />
                    {user.name}
                    <span style={{ margin: "10px" }}>X</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
});
export default Private;
