import React from "react";
import { makeRequest, URL_OF_BACK_END } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import moment from "moment";
import Stories from "react-insta-stories";
import FlipCube from "../../components/loadingComponent/flipCube/FlipCube";

const UserStoryPage = () => {
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  // Lấy thông tin người dùng
  const { data: userData, isLoading: isUserDataLoading } = useQuery(
    ["users", userId],
    () => makeRequest.get(`users/find/${userId}`).then((res) => res.data)
  );

  // Lấy danh sách stories của người dùng
  const { data: storiesData, isLoading: isStoriesLoading } = useQuery(
    ["stories"],
    () => makeRequest.get("/stories/story").then((res) => res.data)
  );

  // Xử lý khi dữ liệu về người dùng và stories đã sẵn sàng
  if (isUserDataLoading || isStoriesLoading) {
    return <FlipCube />;
  }

  const name = userData ? userData.name : "??????";

  // Lọc các story có userId trùng với userId đã nhận được
  const userStories = storiesData.filter((story) => story.userId === userId);

  const stories = userStories.map((story) => {
    const mediaType =
      story.img.endsWith("mp4") ||
      story.img.endsWith(".avi") ||
      story.img.endsWith(".mov")
        ? "video"
        : "image";
    return {
      header: {
        heading: name,
        subheading: moment(story.createdAt).fromNow(),
        profileImage: URL_OF_BACK_END + `users/profilePic/` + story.userId,
      },
      url: URL_OF_BACK_END + `stories/image/${story.id}`,
      type: mediaType,
    };
  });

  return (
    <Stories
      storyContainerStyles={{ borderRadius: "10px" }}
      stories={stories}
      height={680}
      width={380}
      defaultInterval={9000}
      loop={true}
      keyboardNavigation={true}
    />
  );
};

export default UserStoryPage;
