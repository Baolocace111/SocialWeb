import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FormThemeProvider } from 'react-form-component';
import Form, { Input } from 'react-form-component';

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

  const handleChange = (value, name) => {
    setTexts((prevTexts) => ({
      ...prevTexts,
      [name]: value,
    }));
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
    mutation.mutate({ ...texts });
    setOpenUpdate(false);
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
            <FormThemeProvider>
              <Form className="form-update" fields={['name', 'city', 'website']}>
                <Input
                  name='email'
                  type='email'
                  label='E-mail'
                  id='email'
                  initialValue={texts.email || ''}
                  onChange={(value) => handleChange(value, 'email')}
                />
                <Input
                  name='name'
                  type='text'
                  label='Name'
                  id='name'
                  initialValue={texts.name || ''}
                  onChange={(value) => handleChange(value, 'name')}
                />
                <Input
                  name='city'
                  type='text'
                  label='Country / City'
                  id='city'
                  initialValue={texts.city || ''}
                  onChange={(value) => handleChange(value, 'city')}
                />
                <Input
                  name='website'
                  type='url'
                  label='Website'
                  id='website'
                  initialValue={texts.website || ''}
                  onChange={(value) => handleChange(value, 'website')}
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
