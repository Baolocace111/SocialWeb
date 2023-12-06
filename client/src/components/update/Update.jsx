import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { FormThemeProvider } from "react-form-component";
import Form, { Input } from "react-form-component";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const Update = ({ setOpenUpdate, user }) => {
  const [texts, setTexts] = useState({
    email: user.email || "",
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
  });
  const [CPerror, setCPError] = useState(null);
  const [changePassword, setChangePassword] = useState({
    password: "",
    repassword: "",
    oldpassword: "",
  });
  const [profile, setProfile] = useState(user.profilePic);

  const classes = useStyles();
  const [value, setValue] = useState(0);
  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };
  const queryClient = useQueryClient();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setProfile(file);
  };
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await makeRequest.post("/upload", formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleUpdate = async () => {
    if (profile) {
      const profileUrl = await uploadImage(profile);
      imageMutation.mutate({ ...user, profilePic: profileUrl });
    } else {
      // Handle update without image
      imageMutation.mutate(user);
    }
    setOpenUpdate(false);
  };

  const handleChange = (value, name) => {
    setTexts((prevTexts) => ({
      ...prevTexts,
      [name]: value,
    }));
  };
  const handleChangeCP = (value, name) => {
    setChangePassword((prevPassword) => ({ ...prevPassword, [name]: value }));
  };

  const imageMutation = useMutation(
    (updatedUser) => {
      return makeRequest.put("/users", updatedUser);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

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
  const ChangePasswordmutation = useMutation(
    (CPassword) => {
      return makeRequest.post("/users/changepassword", CPassword);
    },
    {
      onSuccess: () => {
        try {
          makeRequest.post("/auth/logout");
          window.location.href = "/login";
        } catch (err) {
          console.log(err);
        }
      },
      onError: (error) => {
        //console.log(error);
        setCPError(error.response.data);
      },
    }
  );

  const handleClick = async (e) => {
    mutation.mutate({ ...texts });
    setOpenUpdate(false);
  };
  const handleClickCP = async (e) => {
    ChangePasswordmutation.mutate({ ...changePassword });
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
              <Tab label="Thông tin" />
              <Tab label="Ảnh hồ sơ" />
              <Tab label="Tài khoản" />
            </Tabs>
          </Paper>
        </div>

        {value === 0 && (
          <>
            <span className="title-update">Update Your Infor</span>
            <FormThemeProvider>
              <Form
                className="form-update"
                fields={["name", "city", "website"]}
              >
                <Input
                  name="email"
                  type="email"
                  label="E-mail"
                  id="email"
                  initialValue={texts.email || ""}
                  onChange={(value) => handleChange(value, "email")}
                />
                <Input
                  name="name"
                  type="text"
                  label="Name"
                  id="name"
                  initialValue={texts.name || ""}
                  onChange={(value) => handleChange(value, "name")}
                />
                <Input
                  name="city"
                  type="text"
                  label="Country / City"
                  id="city"
                  initialValue={texts.city || ""}
                  onChange={(value) => handleChange(value, "city")}
                />
                <Input
                  name="website"
                  type="url"
                  label="Website"
                  id="website"
                  initialValue={texts.website || ""}
                  onChange={(value) => handleChange(value, "website")}
                />
              </Form>
              <button className="btn-save" onClick={handleClick}>
                Save
              </button>
            </FormThemeProvider>
          </>
        )}

        {value === 1 && (
          <>
            <h2>Update User</h2>
            <div>
              <label htmlFor="fileInput">Select Image:</label>
              <input
                type="file"
                id="fileInput"
                onChange={handleFileSelect}
              />
            </div>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setOpenUpdate(false)}>Cancel</button>
          </>
        )}

        {value === 2 && (
          <>
            <span className="title-update">Change Your Password</span>
            <FormThemeProvider>
              <Form
                className="form-update"
                fields={["password", "repassword", "oldpassword"]}
              >
                <Input
                  name="password"
                  type="password"
                  label="New password"
                  id="password"
                  onChange={(value) => handleChangeCP(value, "password")}
                />
                <Input
                  name="repassword"
                  type="password"
                  label="Re-enter password"
                  id="repassword"
                  onChange={(value) => handleChangeCP(value, "repassword")}
                />
                <Input
                  name="oldpassword"
                  type="password"
                  label="Current password"
                  id="oldpassword"
                  onChange={(value) => handleChangeCP(value, "oldpassword")}
                />
              </Form>
              {CPerror && <span className="error">{CPerror}</span>}
              <button className="btn-save" onClick={handleClickCP}>
                Save
              </button>
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
