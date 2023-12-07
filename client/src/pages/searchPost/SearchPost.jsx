import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import "./searchPost.scss";
import ShowPosts from "../../components/posts/ShowPosts";
const SearchPost = ({ isHashtag }) => {
  const { searchText } = useParams();
  const query = isHashtag ? "posts/hashtag" : "/posts/content";
  const body = isHashtag ? { hashtag: searchText } : { content: searchText };
  //Gọi api
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.post(query, body).then((res) => {
      return res.data;
    })
  );
  return (
    <div>
      <div className="search-post">
        <div>
          <span>
            Bạn đang tìm kiếm:{isHashtag ? "#" : ""}
            {searchText}
          </span>
        </div>
        <ShowPosts error={error} isLoading={isLoading} posts={data}></ShowPosts>
      </div>
    </div>
  );
};
export default SearchPost;
