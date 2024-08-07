import "./myDeclinedPosts.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import moment from "moment";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../../axios";
import MyDeclinedPost from "../../../../components/groups/GroupContent/myDeclinedPost/MyDeclinedPost.jsx";
import NineCube from "../../../../components/loadingComponent/nineCube/NineCube.jsx";
import { Waypoint } from "react-waypoint";
import { useState } from "react";
import { useLanguage } from "../../../../context/languageContext";

const MyDeclinedPosts = () => {
  const { groupId } = useParams();
  const { trl, language } = useLanguage();
  useEffect(() => {
    if (language === "jp") {
      moment.locale("ja");
    } else if (language === "vn") {
      moment.locale("vi");
    } else {
      moment.locale("en");
    }
  }, [language]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    error,
  } = useInfiniteQuery(
    ["my-declined-posts", groupId],
    ({ pageParam = 1 }) =>
      makeRequest
        .post(`/groups/${groupId}/my-group-contents?offset=${pageParam}`, {
          status: -1,
        })
        .then((res) => res.data),
    {
      getNextPageParam: (lastPage) =>
        lastPage.next !== -1 ? lastPage.next : undefined,
      refetchOnWindowFocus: false,
    }
  );

  const handleWaypointEnter = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="my-declined-posts">
      <div className="header">
        <span className="manage-header">{trl("Bị từ chối")}</span>
        <div className="sort-info">
          <input
            type="text"
            placeholder={trl("Tìm kiếm theo tên")}
            className="search-input"
          />
          <button className="filter-button" onClick={toggleDropdown}>
            <span>{trl("Loại nội dung")}</span>
            <FontAwesomeIcon icon={faCaretDown} />
            <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
              <div className="option">{trl("Ảnh")}</div>
              <div className="option">{trl("Video")}</div>
            </div>
          </button>
        </div>
      </div>
      {isFetching && !isFetchingNextPage ? (
        <NineCube />
      ) : (
        <div className="row">
          {data?.pages.flatMap((page) => page.data).length > 0 ? (
            data.pages
              .flatMap((page) => page.data)
              .map((post) => <MyDeclinedPost post={post} key={post.id} />)
          ) : (
            <div className="not-found">
              <img
                src="https://static.xx.fbcdn.net/rsrc.php/y_/r/Krj1JsX3uTI.svg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
                }}
                alt="No request"
              />
              <p>{trl("Không có bài viết nào để hiển thị")}</p>
            </div>
          )}
        </div>
      )}
      {error && <p>Some error when loading posts...</p>}
      {hasNextPage && <Waypoint onEnter={handleWaypointEnter} />}
      {isFetchingNextPage && <NineCube />}
    </div>
  );
};

export default MyDeclinedPosts;
