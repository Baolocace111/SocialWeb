import PostManage from "../../../components/adminComponent/postManage/PostManage";
import { useLanguage } from "../../../context/languageContext";

const AdminHome = () => {
  const { trl } = useLanguage();
  return (
    <div style={{ marginLeft: "80px" }}>
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <PostManage></PostManage>
      </div>
    </div>
  );
};
export default AdminHome;
