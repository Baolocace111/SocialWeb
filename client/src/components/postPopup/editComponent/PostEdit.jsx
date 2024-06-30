import { useLanguage } from "../../../context/languageContext";
import "./postEdit.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { TextareaAutosize } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faX } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../../axios";

const PostEdit = ({ post, setShowEditPopup, showEditPopup }) => {
   const { trl } = useLanguage();
   const [desc, setDesc] = useState(post.desc);
   const handleEdit = () => {
      setDesc("");
      setShowEditPopup(!showEditPopup);
   };
   const { currentUser } = useContext(AuthContext);

   const isVideoContent = post.img
      ? post.img.endsWith(".mp4") ||
      post.img.endsWith(".avi") ||
      post.img.endsWith(".mov")
      : false;

   const [deleteImage, setDeleteImage] = useState(false);
   const [file, setFile] = useState(null);
   const [selectedImage, setSelectedImage] = useState(
      URL_OF_BACK_END + `posts/videopost/` + post.id
   );

   const handleImageChange = (e) => {
      if (deleteImage) {
         const file = e.target.files[0];
         if (file) setSelectedImage(URL.createObjectURL(file));
         // console.log(selectedImage);
      }
   };

   const queryClient = useQueryClient();
   const updateMutation = useMutation(
      async (data) => {
         try {
            return await makeRequest.put(`/posts/updatedesc`, data);
         } catch (error) {
            alert(error.response.data);
         }
      },
      {
         onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["posts"]);
            queryClient.invalidateQueries(["my-pending-posts"]);
         },
      }
   );
   const updateVideoMutation = useMutation(
      async (data) => {
         return await makeRequest.put(
            `/posts/updateimage/${data.postId}`,
            data.formData
         );
      },
      {
         onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["posts"]);
            queryClient.invalidateQueries(["my-pending-posts"]);
         },
      }
   );

   const handleUpdate = async (e) => {
      await updateMutation.mutateAsync({ postId: post.id, desc: desc });

      if (deleteImage && file) {
         const formData = new FormData();
         formData.append("file", file);
         await updateVideoMutation.mutateAsync({ postId: post.id, formData });
      }
      setShowEditPopup(false);
      setFile(null);
   };

   return (
      <div className="edit-popup">
         <div className="title">
            <FontAwesomeIcon style={{ marginRight: "8px", fontSize: "16px" }} icon={faPen} />
            <span style={{ fontSize: "22px", fontWeight: "700" }}>
               {trl("Chỉnh sửa bài viết")}
            </span>
         </div>
         <div className="popup-content">
            <div className="user-info">
               <img
                  src={
                     URL_OF_BACK_END + `users/profilePic/` + currentUser.id
                  }
                  onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = "/upload/errorImage.png";
                  }}
                  alt={""}
               />
               <span>{currentUser.name}</span>
            </div>
            <TextareaAutosize
               minRows={1}
               placeholder={trl("Nhập nội mô tả của bạn")}
               defaultValue={post.desc}
               onChange={(e) => setDesc(e.target.value)}
               className="text-input"
            />
            {post.img && selectedImage && !isVideoContent && (
               <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ position: "relative", display: "inline-flex" }}>
                     <img
                        src={selectedImage}
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = "/upload/errorImage.png";
                        }}
                        alt={""}
                        style={{ maxWidth: "400px" }}
                     />
                     <button
                        style={{
                           position: "absolute",
                           top: "5px",
                           right: "5px",
                           borderRadius: "50%",
                           width: "30px",
                           height: "30px",
                           cursor: "pointer",
                           zIndex: "1",
                        }}
                        onClick={() => {
                           setSelectedImage(null);
                           setDeleteImage(true);
                           console.log(file);
                        }}
                     >
                        <FontAwesomeIcon icon={faX} />
                     </button>
                  </div>
               </div>
            )}

            {deleteImage && !selectedImage && (
               <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                     setFile(e.target.files[0]);
                     handleImageChange(e);
                  }}
               />
            )}
         </div>
         <div className="popup-action">
            <button className="share" onClick={handleUpdate}>
               {trl("SAVE")}
            </button>
            <button className="cancel" onClick={handleEdit}>
               {trl("CANCEL")}
            </button>
         </div>
      </div>
   );
};
export default PostEdit;