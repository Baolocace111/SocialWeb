import PostManage from "../../../components/adminComponent/postManage/PostManage";

const AdminHome = () => {
  return (
    <div style={{ marginLeft: "80px" }}>
      <span>Welcome Admin</span>
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <PostManage></PostManage>
      </div>
    </div>
  );
};
export default AdminHome;
