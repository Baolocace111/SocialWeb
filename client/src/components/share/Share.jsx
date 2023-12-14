import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newPost) => {
      try {
        return await makeRequest.post("/posts/post", newPost);
      } catch (error) {
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const video_mutation = useMutation(
    async (newPost) => {
      try {
        return await makeRequest.post("/posts/videopost", newPost);
      } catch (error) {
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    if ((file && isImage(file)) || !file) {
      if (file) {
        let imgUrl = await upload();
        mutation.mutate({ desc, img: imgUrl });
      } else {
        mutation.mutate({ desc });
      }
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("desc", desc);
      video_mutation.mutate(formData);
    }
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              accept="image/*, video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (isImageAndVideo(e.target.files[0])) setFile(e.target.files[0]);
                else {
                  alert("Unacceptable file");
                }
              }}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
function isImageAndVideo(file) {
  return file && (file["type"].split("/")[0] === "image" || file["type"].split("/")[0] === "video");
}
function isImage(file) {
  return file && (file["type"].split("/")[0] === "image");
}
