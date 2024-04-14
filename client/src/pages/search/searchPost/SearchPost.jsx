import { makeRequest } from "../../../axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import "./searchPost.scss";
import ShowPosts from "../../../components/posts/ShowPosts";
const SearchPost = ({ isHashtag }) => {
  const { searchText } = useParams();
  const query = isHashtag ? "posts/hashtag" : "/posts/content";
  const body = isHashtag ? { hashtag: searchText } : { content: searchText };

  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.post(query, body).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="search-post">
      <ShowPosts error={error} isLoading={isLoading} posts={data}></ShowPosts>
    </div>
  );
};
export default SearchPost;
