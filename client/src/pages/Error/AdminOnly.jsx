import { useLanguage } from "../../context/languageContext";
const AdminOnly = () => {
  const { trl } = useLanguage();
  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        width: "100%",
        minHeight: "893px",
        zIndex: "10",
        height: "100%",
      }}
    >
      <h1>{trl("This page only for Admin")}</h1>

      <img
        src="notificationtype/erroranimegirl.png"
        alt=""
        style={{ position: "fixed", bottom: "0", right: "0", height: "100%" }}
      ></img>
    </div>
  );
};
export default AdminOnly;
