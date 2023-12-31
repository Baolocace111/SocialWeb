import { useContext, useEffect, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../axios";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MovieIcon from "@mui/icons-material/Movie";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import FlipCube from "../loadingComponent/flipCube/FlipCube";
import { useRef } from "react";
import Slider from "react-slick";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const inputRef = useRef(null);
  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories/story").then((res) => {
      return res.data;
    })
  );

  //Get userInfo
  const [users, setUsers] = useState({});
  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        const response = await makeRequest.get(`/users/find/${userId}`);
        const user = response.data;
        setUsers((prevUsers) => ({
          ...prevUsers,
          [userId]: user,
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (data) {
      data.forEach((story) => {
        if (!users[story.userId]) {
          fetchUser(story.userId);
        }
      });
    }
  }, [data, users]);

  //Show dialog add-story
  const [selectedImage, setSelectedImage] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const handleDialogOpen = () => {
    setOpenAdd(true);
  };

  const handleDialogClose = () => {
    setOpenAdd(false);
    setSelectedImage(null);
    setFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };
  //TODO Add story using react-query mutations and use upload function.
  const [file, setFile] = useState(null);

  // const upload = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     const res = await makeRequest.post("/upload", formData);
  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (newStory) => {
      try {
        return await makeRequest.post("/stories/add", newStory);
      } catch (error) {
        console.log(error.response.data);
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );
  const handleAddStoryClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    console.log(file);
    mutation.mutate(formData);
    setFile(null);
    setSelectedImage(null);
    setOpenAdd(false);
  };

  const settings = {
    dots: true, // Show pagination dots
    infinite: false, // Enable infinite loop
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 4, // Number of stories to show on a slide
    slidesToScroll: 1, // Number of stories to scroll when dragging or clicking the arrows
    cssEase: "ease-in-out",
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    <div className="story" key={1}>
      <img src={URL_OF_BACK_END + `users/profilePic/` + currentUser.id} alt="" />
      <span>{currentUser.name}</span>
      <button onClick={handleDialogOpen}>+</button>

      <Dialog open={openAdd} onClose={handleDialogClose}>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            mt: "-5px",
            mb: "-10px",
          }}
        >
          <MovieIcon sx={{ marginRight: "8px" }} />
          <Typography variant="title1" sx={{ flexGrow: 1 }}>
            Create a story
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Typography
              variant="body1"
              sx={{ alignSelf: "flex-start", mb: "25px", textAlign: "left" }}
            >
              Câu chuyện là hình ảnh/video được đăng lên và sẽ biến mất sau 24 giờ
            </Typography>
            <input
              type="file"
              accept="image/*, video/*"
              ref={inputRef}
              onChange={(e) => {
                if (isImageAndVideo(e.target.files[0])) {
                  setFile(e.target.files[0]);
                  handleImageChange(e);
                } else {
                  inputRef.current.value = "";
                }
              }}
            />
            {selectedImage && isImage(file) ?
              <img
                src={selectedImage}
                alt=""
                style={{ marginTop: "8px", maxWidth: "300px" }}
              />
              : isImageAndVideo(file) ?
                <video src={selectedImage} preload="metadata" style={{ marginTop: "8px", maxWidth: "300px" }} /> : <></>
            }
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleAddStoryClick} color="primary">
            Add Story
          </Button>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>,
  ];

  if (error) {
    return "Something went wrong";
  } else if (isLoading) {
    return <FlipCube />;
  } else {
    const userLatestStories = {};
    data.forEach((story) => {
      const user = users[story.userId];
      if (user) {
        if (
          !userLatestStories[user.id] ||
          story.id > userLatestStories[user.id].id
        ) {
          userLatestStories[user.id] = story;
        }
      }
    });
    Object.keys(userLatestStories).forEach((userId) => {
      const user = users[userId];
      const latestStory = userLatestStories[userId];
      slides.push(
        <Link to={`/stories/${userId}`} key={userId}>
          <div className="story">
            <div className="profile-pic">
              {user && <img src={URL_OF_BACK_END + `users/profilePic/` + latestStory.userId} alt="" />}
            </div>
            <div className="story-content">
              {(latestStory.img.endsWith("mp4") || latestStory.img.endsWith("avi") || latestStory.img.endsWith("mov"))
                ? <video src={URL_OF_BACK_END + `stories/image/` + latestStory.id} preload="metadata" />
                : <img src={URL_OF_BACK_END + `stories/image/` + latestStory.id} alt="" />}
              <span>{latestStory.name}</span>
            </div>
          </div>
        </Link>
      );
    });
  }

  return (
    <div className="stories">
      <Slider
        {...settings}
        afterChange={(currentSlide) => setCurrentSlide(currentSlide)}
        className="slider-container"
      >
        {slides}
      </Slider>
    </div>
  );
};

export default Stories;
function isImageAndVideo(file) {
  return file && (file["type"].split("/")[0] === "image" || file["type"].split("/")[0] === "video");
}
function isImage(file) {
  return file && (file["type"].split("/")[0] === "image");
}

