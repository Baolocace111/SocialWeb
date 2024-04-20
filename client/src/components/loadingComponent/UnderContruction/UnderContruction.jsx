import { useLanguage } from "../../../context/languageContext";
import "./underContruction.scss";
const UnderContruction = () => {
  const { trl } = useLanguage();
  return (
    <div className="contruction-site">
      <div className="overlay"></div>
      <div className="stars" aria-hidden="true"></div>
      <div className="starts2" aria-hidden="true"></div>
      <div className="stars3" aria-hidden="true"></div>
      <div className="main">
        <section className="contact">
          <h1 className="title">Tiny Social</h1>
          <h2 className="sub-title">{trl("Đang xây dựng")}</h2>
        </section>
      </div>
    </div>
  );
};
export default UnderContruction;
