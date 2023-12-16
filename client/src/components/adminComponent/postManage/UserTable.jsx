import { useEffect, useState } from "react";
import { makeRequest } from "../../../axios";
const UserTable = ({ year, month, needload, setLoading }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  //const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchData = () => {
    makeRequest
      .post("/admin/user", {
        year,
        month,
        page: currentPage,
      })
      .then((res) => {
        setUsers(res.data.lists);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        setError(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (needload) fetchData();
  }, [currentPage, month, year]);
  return (
    <div>
      <h1>Admin User Page</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Total Posts</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.total_posts}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {/* Pagination */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
export default UserTable;
