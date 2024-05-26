import { useEffect, useState } from "react";
import { makeRequest } from "../../../axios";
import MPost from "./MPost";
import "./userTable.scss";
import { useLanguage } from "../../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
const UserTable = ({ year, month }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [draggedPost, setDraggedPost] = useState(null);
  const { trl } = useLanguage();
  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await makeRequest.post("/admin/user", {
        year,
        month,
        page: currentPage,
      });
      setUsers(response.data.lists);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error.response?.data || trl("An unexpected error occurred"));
    }
  };

  // Fetch posts by user
  const fetchPostsByUser = async (userId, postPage) => {
    try {
      const response = await makeRequest.post("/admin/post", {
        year,
        month,
        page: postPage,
        user_id: userId,
      });
      setPosts(response.data.posts);
      // Update currentPostPage state here if necessary
      setCurrentPostPage(postPage);
    } catch (error) {
      setError(error.response?.data || trl("An unexpected error occurred"));
    }
  };
  const onclickUser = (user) => {
    setSelectedUser(user);
    fetchPostsByUser(user.id, 1);
  };
  const handleDragStart = (post) => {
    setDraggedPost(post);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định
  };
  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedPost) {
      // Hiển thị hộp thoại xác nhận
      if (
        window.confirm(
          `${trl("Are you sure you want to delete the post with ID")}: ${
            draggedPost.id
          }?`
        )
      ) {
        // Gọi API để xóa bài viết
        makeRequest
          .delete(`/admin/deletepost?postid=${draggedPost.id}`)
          .then((response) => {
            // Xử lý sau khi xóa thành công
            //console.log("Post deleted:", response);
            // Cập nhật UI
            fetchUserData();
            fetchPostsByUser();
          })
          .catch((error) => {
            // Xử lý lỗi
            console.error("Error deleting post:", error);
          });
      }
      setDraggedPost(null); // Reset post đã kéo
    }
  };
  // Effects
  useEffect(() => {
    fetchUserData();
  }, [currentPage, month, year]);

  useEffect(() => {
    if (selectedUser) {
      fetchPostsByUser(selectedUser.id, currentPostPage);
    }
  }, [selectedUser, currentPostPage]);

  // Render pagination buttons
  const renderPagination = (total, callback) => (
    <div className="pagination">
      {Array.from({ length: total }, (_, index) => (
        <button key={index + 1} onClick={() => callback(index + 1)}>
          {index + 1}
        </button>
      ))}
    </div>
  );
  const handleDeletePost = (id) => {
    if (
      window.confirm(
        `${trl("Are you sure you want to delete the post with ID")}: ${id}?`
      )
    ) {
      // Gọi API để xóa bài viết
      makeRequest
        .delete(`/admin/deletepost?postid=${id}`)
        .then((response) => {
          // Xử lý sau khi xóa thành công
          //console.log("Post deleted:", response);
          // Cập nhật UI
          fetchUserData();
          fetchPostsByUser();
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error("Error deleting post:", error);
        });
    }
  };
  return (
    <div className="manage_layout">
      {error && <h2>{error.toString()}</h2>}
      <div className="m_postusertable">
        <h1>
          {trl("Admin User Page")} {month} - {year}
        </h1>
        {error && (
          <div>
            <h2>{error.toString()}</h2>
          </div>
        )}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{trl("Username")}</th>
              <th>{trl("Name")}</th>
              <th>{trl("Total Posts")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                className="m_user"
                key={user.id}
                onClick={() => onclickUser(user)}
              >
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.total_posts}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>{renderPagination(totalPages, setCurrentPage)}</div>
      </div>
      <div className="m_posttable">
        {selectedUser && (
          <>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="delete-zone"
            >
              {trl("Drag posts here to delete")}
            </div>
            <div>
              {posts.map((post) => (
                <div
                  className="managePostBox"
                  key={post.id}
                  draggable
                  onDragStart={() => handleDragStart(post)}
                >
                  {" "}
                  <button
                    className="deleteBtn"
                    onClick={() => {
                      handleDeletePost(post.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  </button>
                  <MPost post={post} />
                </div>
              ))}
            </div>
            {renderPagination(Math.ceil(selectedUser.total_posts / 3), (page) =>
              fetchPostsByUser(selectedUser.id, page)
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default UserTable;
