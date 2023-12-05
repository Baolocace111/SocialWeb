import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FormThemeProvider } from 'react-form-component';
import Form, { Input } from 'react-form-component'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email || "",
    password: user.password || "",
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
  });
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };

  const upload = async (file) => {
    console.log(file)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    //TODO: find a better way to get image URL

    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <div className="menu">
          <Paper className={classes.root}>
            <Tabs
              value={value}
              onChange={handleChangeValue}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                label="Thông tin"
              />
              <Tab
                label="Ảnh hồ sơ"
              />
              <Tab
                label="Tài khoản"
              />
            </Tabs>
          </Paper>
        </div>

        {value === 0 && (
          <>
            <span className="title-update">Update Your Profile</span>
            {/* <div className="files">
              <label htmlFor="coverPic">
                <span>Cover Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      cover
                        ? URL.createObjectURL(cover)
                        : "/upload/" + user.coverPic
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                id="coverPic"
                style={{ display: "none" }}
                onChange={(e) => setCover(e.target.files[0])}
              />
              <label htmlFor="profilePic">
                <span>Profile Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      profile
                        ? URL.createObjectURL(profile)
                        : "/upload/" + user.profilePic
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                id="profilePic"
                style={{ display: "none" }}
                onChange={(e) => setProfile(e.target.files[0])}
              />
            </div> */}
            {/* <form>
              <label>Email</label>
              <input
                type="text"
                value={texts.email}
                name="email"
                onChange={handleChange}
              />
              <label>Name</label>
              <input
                type="text"
                value={texts.name}
                name="name"
                onChange={handleChange}
              />
              <label>Country / City</label>
              <input
                type="text"
                name="city"
                value={texts.city}
                onChange={handleChange}
              />
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={texts.website}
                onChange={handleChange}
              />
              <button onClick={handleClick}>Update</button>
            </form> */}
            <FormThemeProvider>
              <Form className="form-update" fields={['email', 'name', 'city', 'website']}>
                <Input
                  name='email'
                  type='text'
                  label='E-mail'
                  initialValue={texts.email || ''}
                  onChange={handleChange}
                />
                <Input
                  name='name'
                  label='Username'
                />
                <Input
                  name='city'
                  label='Country / City'
                />
                <Input
                  name='website'
                  label='Website'
                />
                <button className="btn-save" onClick={handleClick}>Save</button>
              </Form>
            </FormThemeProvider>
          </>
        )}

        <button className="close" onClick={() => setOpenUpdate(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};
export default Update;
