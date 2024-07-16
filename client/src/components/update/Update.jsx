import { useState } from "react";
import { URL_OF_BACK_END, makeRequest } from "../../axios";
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
import { useLanguage } from "../../context/languageContext";

import BallInBar from "../loadingComponent/ballInBar/BallInBar";

const useStyles = makeStyles({
   root: {
      flexGrow: 1,
   },
});

const Update = ({ setOpenUpdate, user }) => {
   const { trl } = useLanguage();
   const [texts, setTexts] = useState({
      email: user.email || "",
      name: user.name || "",
      city: user.city || "",
      website: user.website || "",
   });
   const [CPerror, setCPError] = useState(null);
   const [onLoading, setOnLoading] = useState(false);
   const [changePassword, setChangePassword] = useState({
      password: "",
      repassword: "",
      oldpassword: "",
   });

   const [selectedProfile, setSelectedProfile] = useState({
      profilePic: null,
      coverPic: null,
   });
   const [updatedProfile, setUpdatedProfile] = useState({
      profilePic: null,
      coverPic: null,
   });
   const [profile] = useState({
      profilePic: user.profilePic || null,
      coverPic: user.coverPic || null,
   });

   const classes = useStyles();
   const [value, setValue] = useState(0);
   const handleChangeValue = (event, newValue) => {
      setValue(newValue);
   };
   const queryClient = useQueryClient();

   const handleProfileSelect = (event) => {
      const file = event.target.files[0];
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isValidExtension = allowedExtensions.includes(fileExtension);

      if (isValidExtension) {
         const imageUrl = URL.createObjectURL(file);
         setSelectedProfile({ ...selectedProfile, profilePic: imageUrl });
         setUpdatedProfile({ ...updatedProfile, profilePic: file });
      } else {
         alert(`${trl("Vui lòng chỉ chọn tệp ảnh")} (jpg, jpeg, png, gif)`);
         event.target.value = null;
      }
   };
   const handleCoverSelect = (event) => {
      const file = event.target.files[0];
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isValidExtension = allowedExtensions.includes(fileExtension);

      if (isValidExtension) {
         const imageUrl = URL.createObjectURL(file);
         setSelectedProfile({ ...selectedProfile, coverPic: imageUrl });
         setUpdatedProfile({ ...updatedProfile, coverPic: file });
      } else {
         alert(`${trl("Vui lòng chỉ chọn tệp ảnh")} (jpg, jpeg, png, gif).`);
         event.target.value = null;
      }
   };
   const handleUpdate = async () => {
      try {
         const mutationPromises = [];

         if (updatedProfile.profilePic) {
            const formDataProfile = new FormData();
            formDataProfile.append("file", updatedProfile.profilePic);
            mutationPromises.push(
               imageProfileMutation.mutateAsync(formDataProfile)
            );
         }

         if (updatedProfile.coverPic) {
            const formDataCover = new FormData();
            formDataCover.append("file", updatedProfile.coverPic);
            mutationPromises.push(imageCoverMutation.mutateAsync(formDataCover));
         }

         await Promise.all(mutationPromises); // Chờ tất cả các mutations hoàn thành

         setOpenUpdate(false);
         window.location.reload();
      } catch (error) {
         console.error("Error occurred during update:", error);
         // Xử lý lỗi nếu cần thiết
      }
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

   const imageProfileMutation = useMutation(
      async (image) => {
         setOnLoading(true);
         try {
            await makeRequest.put("/users/profilePic", image);
            setOnLoading(false);
         } catch (e) {
            alert(trl(e.response?.data));
            setOnLoading(false);
         }
      },
      {
         onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["user"]);
         },
      }
   );
   const imageCoverMutation = useMutation(
      async (image) => {
         setOnLoading(true);
         try {
            await makeRequest.put("/users/coverPic", image);
            setOnLoading(false);
         } catch (e) {
            alert(trl(e.response?.data));
            setOnLoading(false);
         }
      },
      {
         onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["user"]);
         },
      }
   );

   const mutation = useMutation(
      async (user) => {
         setOnLoading(true);
         try {
            await makeRequest.put("/users", user);
            setOnLoading(false);
         } catch (e) {
            alert(trl(e.response?.data));
            setOnLoading(false);
         }
      },
      {
         onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["user"]);
         },
      }
   );
   const ChangePasswordmutation = useMutation(
      async (CPassword) => {
         setOnLoading(true);
         try {
            await makeRequest.post("/users/changepassword", CPassword);
            try {
               setOnLoading(true);
               makeRequest.post("/auth/logout");
               window.location.href = "/login";
            } catch (err) {
               console.log(err);
            }
            setOnLoading(false);
         } catch (e) {
            setOnLoading(false);
            setCPError(e.response?.data);
         }
      }
   );

   const handleClick = async (e) => {
      mutation.mutate({ ...texts });
      setOpenUpdate(false);
   };
   const handleClickCP = async (e) => {
      ChangePasswordmutation.mutate({ ...user, ...changePassword });
   };

   return (
      <div className="update">
         {onLoading && (
            <div className="overloading">
               <BallInBar></BallInBar>
            </div>
         )}

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
                     <Tab label={trl("Thông tin")} />
                     <Tab label={trl("Ảnh hồ sơ")} />
                     <Tab label={trl("Tài khoản")} />
                  </Tabs>
               </Paper>
            </div>

            {value === 0 && (
               <>
                  <span className="title-update">
                     {trl("Update Your Information")}
                  </span>
                  <FormThemeProvider>
                     <Form
                        className="form-update"
                        fields={["name", "city", "website"]}
                     >
                        <Input
                           name="name"
                           type="text"
                           label={trl("Name")}
                           id="name"
                           initialValue={texts.name || ""}
                           onChange={(value) => handleChange(value, "name")}
                        />
                        <Input
                           name="city"
                           type="text"
                           label={`${trl("Country")} / ${trl("City")}`}
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
                        {trl("Save")}
                     </button>
                  </FormThemeProvider>
               </>
            )}

            {value === 1 && (
               <>
                  <div className="form-image">
                     <div className="update-profile">
                        <span className="avatar">{trl("Ảnh đại diện")}</span>
                        <input
                           style={{ display: "none" }}
                           type="file"
                           id="profileInput"
                           onChange={handleProfileSelect}
                           accept="image/*"
                        />
                        <label className="edit-avatar" htmlFor="profileInput">
                           {trl("Chỉnh sửa")}
                        </label>
                     </div>
                     <div className="image-profile">
                        {selectedProfile.profilePic && (
                           <img
                              className="img-profile"
                              src={selectedProfile.profilePic}
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "/upload/errorImage.png";
                              }}
                              alt={""}
                           />
                        )}
                        {!selectedProfile.profilePic && profile.profilePic && (
                           <img
                              className="img-profile"
                              src={URL_OF_BACK_END + `users/profilePic/` + user.id}
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "/upload/errorImage.png";
                              }}
                              alt={""}
                           />
                        )}
                     </div>
                     <div className="update-profile">
                        <span className="avatar">{trl("Ảnh bìa")}</span>
                        <input
                           style={{ display: "none" }}
                           type="file"
                           id="coverInput"
                           onChange={handleCoverSelect}
                           accept="image/*"
                        />
                        <label className="edit-avatar" htmlFor="coverInput">
                           {trl("Chỉnh sửa")}
                        </label>
                     </div>
                     <div className="image-profile">
                        {selectedProfile.coverPic && (
                           <img
                              className="img-cover"
                              src={selectedProfile.coverPic}
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "/upload/errorImage.png";
                              }}
                              alt={""}
                           />
                        )}
                        {!selectedProfile.coverPic && profile.coverPic && (
                           <img
                              className="img-cover"
                              src={URL_OF_BACK_END + `users/coverPic/` + user.id}
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "/upload/errorImage.png";
                              }}
                              alt={""}
                           />
                        )}
                     </div>
                  </div>
                  <button className="btn-save" onClick={handleUpdate}>
                     {trl("Save")}
                  </button>
               </>
            )}

            {value === 2 && (
               <>
                  <span className="title-update">{trl("Change Your Password")}</span>
                  <FormThemeProvider>
                     <Form
                        className="form-update"
                        fields={["password", "repassword", "oldpassword"]}
                     >
                        <Input
                           name="password"
                           type="password"
                           label={trl("New password")}
                           id="password"
                           onChange={(value) => handleChangeCP(value, "password")}
                        />
                        <Input
                           name="repassword"
                           type="password"
                           label={trl("Re-enter password")}
                           id="repassword"
                           onChange={(value) => handleChangeCP(value, "repassword")}
                        />
                        <Input
                           name="oldpassword"
                           type="password"
                           label={trl("Current password")}
                           id="oldpassword"
                           onChange={(value) => handleChangeCP(value, "oldpassword")}
                        />
                     </Form>
                     {CPerror && <span className="error">{trl(CPerror)}</span>}
                     <button className="btn-save" onClick={handleClickCP}>
                        {trl("Save")}
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
