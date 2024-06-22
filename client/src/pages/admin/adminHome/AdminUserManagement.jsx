import "./adminUserManagement.scss";
import { useState } from "react";
import { useEffect } from "react";
import { makeRequest } from "../../../axios";
import { useLanguage } from "../../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMars,
  faVenus,
  faMarsAndVenus,
  faCheck,
  faTimes,
  faUserTie,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { URL_OF_BACK_END } from "../../../axios";
import Dotfloating from "../../../components/loadingComponent/dotfloating/Dotfloating";
const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { trl } = useLanguage();

  const fetchData = async () => {
    setIsLoading(true); // Bắt đầu hiển thị màn hình tải
    try {
      const response = await makeRequest.post("/admin/users/getuser", {
        page: currentPage,
        key: searchKey,
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      alert(trl("Error fetching data: "), trl(error));
    } finally {
      setIsLoading(false); // Tắt màn hình tải sau khi request hoàn thành
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchKey]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (key) => {
    setSearchKey(key);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleReputation = async (userId, reputation) => {
    setIsLoading(true); // Bắt đầu hiển thị màn hình tải
    try {
      await makeRequest.post("/admin/users/reputation", {
        id: userId,
        reputation,
      });
      fetchData();
    } catch (e) {
      alert(e.response?.data);
    } finally {
      setIsLoading(false); // Tắt màn hình tải sau khi request hoàn thành
    }
  };

  return (
    <div className="admin-user-management">
      {isLoading && (
        <div className="loadingfull">
          <Dotfloating />
        </div>
      )}
      <SearchBar onSearch={handleSearch} />
      <UserList users={users} changeReputation={handleReputation} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const UserList = ({ users, changeReputation }) => {
  const { trl } = useLanguage();
  const goProfilePage = (id) => {
    window.open(`/profile/${id}`, "_blank");
  };
  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <img
            src={`${URL_OF_BACK_END}users/profilePic/${user.id}`}
            onClick={() => {
              goProfilePage(user.id);
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/upload/errorImage.png";
            }}
            alt={`${user.username}${trl("'s profile")}`}
            className="profile-pic"
          />
          <h3
            onClick={() => {
              goProfilePage(user.id);
            }}
          >
            {user.name}
          </h3>
          <div className="more-info">
            <p>
              {trl("Username")}: {user.username}
            </p>
            <p>Email: {user.email}</p>
            {user.city && (
              <p>
                {trl("City")}: {user.city}
              </p>
            )}
            {user.website && (
              <p>
                Website:{" "}
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </a>
              </p>
            )}
            <p>
              {trl("Gender")}:
              {user.gender === 0 && <FontAwesomeIcon icon={faMars} />}
              {user.gender === 1 && <FontAwesomeIcon icon={faVenus} />}
              {user.gender === 2 && <FontAwesomeIcon icon={faMarsAndVenus} />}
            </p>
            <p>
              {trl("State")}:
              {user.state === 0 ? (
                <FontAwesomeIcon icon={faTimes} className="state-inactive" />
              ) : (
                <FontAwesomeIcon icon={faCheck} className="state-active" />
              )}
            </p>
            {user.birthdate && (
              <p>
                {trl("Birthdate")}:{" "}
                {new Date(user.birthdate).toLocaleDateString()}
              </p>
            )}
            <p>
              {trl("Joined on")}:{" "}
              {new Date(user.create_at).toLocaleDateString()}
            </p>
            <p>
              {trl("Last updated")}:{" "}
              {new Date(user.update_at).toLocaleDateString()}
            </p>
            <p>
              {trl("Role")}:
              {user.role === 1 ? (
                <FontAwesomeIcon icon={faUserTie} />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </p>
            <p>
              {trl("Reputation")}:
              {user.reputation <= 3 ? user.reputation : `3+`}
            </p>
            <div className="actionbox">
              <button
                onClick={() => {
                  changeReputation(user.id, user.reputation + 1);
                }}
              >
                {trl(["+1", " ", "Reputation"])}
              </button>
              <button
                onClick={() => {
                  changeReputation(user.id, user.reputation - 1);
                }}
              >
                {trl(["-1", " ", "Reputation"])}
              </button>
              <button
                onClick={() => {
                  changeReputation(user.id, 0);
                }}
              >
                {trl("Ban")}
              </button>
              <button
                onClick={() => {
                  changeReputation(user.id, 3);
                }}
              >
                {trl("Unban")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { trl } = useLanguage();
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination">
      <ul>
        {currentPage > 1 && (
          <li>
            <button onClick={() => onPageChange(currentPage - 1)}>
              {trl("Previous")}
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li>
            <button onClick={() => onPageChange(currentPage + 1)}>
              {trl("Next")}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

const SearchBar = ({ onSearch }) => {
  const { trl } = useLanguage();
  const [input, setInput] = useState("");

  const handleSearch = () => {
    onSearch(input);
  };

  return (
    <div className="search-bar-user">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={trl("Search users...")}
      />
      <button onClick={handleSearch}>{trl("Search")}</button>
    </div>
  );
};

export default AdminUserManagement;
