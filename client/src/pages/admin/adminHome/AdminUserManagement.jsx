import "./adminUserManagement.scss";
import { useState } from "react";
import { useEffect } from "react";
import { makeRequest } from "../../../axios";
const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeRequest.post("/admin/users/getuser", {
          page: currentPage,
          key: "", // Set key for search if needed
        });
        setUsers(response.data.users);
        // set other data like currentPage, totalPages, etc.
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (key) => {
    // Call API with the search key and update state
  };

  return (
    <div style={{ marginLeft: "80px" }}>
      <SearchBar onSearch={handleSearch} />
      <UserList users={users} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
const UserList = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
        <div
          key={user.id}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <img
            src={`http://localhost:8800/api/admin/profilePic/${user.id}`}
            alt={`${user.username}'s profile`}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <h3>{user.name}</h3>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {user.city && <p>City: {user.city}</p>}
          {user.website && (
            <p>
              Website:{" "}
              <a href={user.website} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            </p>
          )}
          <p>Gender: {user.gender === 0 ? "Male" : "Female"}</p>
          <p>State: {user.state === 0 ? "Inactive" : "Active"}</p>
          {user.birthdate && (
            <p>Birthdate: {new Date(user.birthdate).toLocaleDateString()}</p>
          )}
          <p>Joined on: {new Date(user.create_at).toLocaleDateString()}</p>
          <p>Last updated: {new Date(user.update_at).toLocaleDateString()}</p>
          <p>Role: {user.role === 1 ? "Admin" : "User"}</p>
          <p>Reputation: {user.reputation}</p>
        </div>
      ))}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul
        style={{
          listStyleType: "none",
          display: "flex",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {currentPage > 1 && (
          <li style={{ margin: "0 5px" }}>
            <button onClick={() => onPageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number} style={{ margin: "0 5px" }}>
            <button
              onClick={() => onPageChange(number)}
              style={{ fontWeight: currentPage === number ? "bold" : "normal" }}
            >
              {number}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li style={{ margin: "0 5px" }}>
            <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    onSearch(input);
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};
export default AdminUserManagement;