import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import moment from "moment";
import Stories from "react-insta-stories";

const UserStoryPage = () => {

  const userId = parseInt(useLocation().pathname.split("/")[2]);
  //Get Stories of All Users
  const { data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      return res.data;
    })
  );
  //Get UserInfo
  const data_user = useQuery(["users", userId], () =>
    makeRequest.get(`users/find/${userId}`).then((res) => {
      return res.data;
    })
  );
  const name = data_user.data ? data_user.data.name :"is loading"
  const profilePic = data_user.data ? data_user.data.profilePic :"is loading"
  
  // Lọc các story có userId trùng với userId đã nhận được
  const userStories = data ? data.filter((story) => story.userId === userId) : [];

  const stories = userStories.map((story) => ({
    header: {
      heading: name,
      subheading: moment(story.createdAt).fromNow(),
      profileImage: '/upload/' + profilePic,
    },
    url: "/upload/" + story.img,
  }));

  return (
    <Stories
      stories={stories}
      defaultInterval={4500}
      loop={true}
    />
  );

};

export default UserStoryPage;