import { useContext, useEffect, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import axios from "axios";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MovieIcon from '@mui/icons-material/Movie';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      return res.data;
    })
  );

  //Get userInfo
  const [users, setUsers] = useState({});
  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:8800/api/users/find/${userId}`);
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

  //TODO View story details

  //Show dialog add-story
  const [selectedImage, setSelectedImage] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const handleDialogOpen = () => {
    setOpenAdd(true);
  };

  const handleDialogClose = () => {
    setOpenAdd(false);
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };
  //TODO Add story using react-query mutations and use upload function.
  const [file, setFile] = useState(null);

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
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newStory) => {
      return makeRequest.post("/stories", newStory);
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
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ img: imgUrl });
    setFile(null);
    setSelectedImage(null);
    setOpenAdd(false);
  };

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        {/* Click to add story*/}
        <button onClick={handleDialogOpen}>+</button>
      </div>

      {/* Dialog */}
      <Dialog open={openAdd} onClose={handleDialogClose}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', mt: '-5px', mb: '-10px' }}>
          <MovieIcon sx={{ marginRight: '8px' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Create a story
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="body1" sx={{ alignSelf: 'flex-start', mb: '25px', textAlign: 'left' }}>
              Câu chuyện là hình ảnh được đăng lên và sẽ biến mất sau 24 giờ
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                handleImageChange(e);
              }}
            />
            {selectedImage && (
              <img src={selectedImage} alt="" style={{ marginTop: '8px', maxWidth: '300px' }} />
            )}
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          {/* Button to add story */}
          <Button onClick={handleAddStoryClick} color="primary">
            Add Story
          </Button>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {error ? (
        "Something went wrong"
      ) : isLoading ? (
        "loading"
      ) : (
        data.map((story) => {
          const user = users[story.userId];
          return (
            <div className="story" key={story.id}>
              <div className="profile-pic">
                {user && <img src={`/upload/${user.profilePic}`} alt="" />}
              </div>
              <div className="story-content">
                <img src={"/upload/" + story.img} alt="" />
                <span>{story.name}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Stories;
