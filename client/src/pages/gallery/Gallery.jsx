import ImageContainer from "../../components/galleryComponent/ImageContainer/ImageContainer";
import "./gallery.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
const Gallery = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="gallery">
      <ImageContainer userid={currentUser.id} />
    </div>
  );
};
export default Gallery;
