import ImageContainer from "../../components/profileComponents/gallery/ImageContainer/ImageContainer.jsx";
import "./gallery.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
const Gallery = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="gallery">
      <ImageContainer userId={currentUser.id} />
    </div>
  );
};
export default Gallery;
