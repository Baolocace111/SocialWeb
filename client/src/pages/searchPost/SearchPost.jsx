import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/searchComponents/searchBar/SearchBar";
import "./searchPost.scss";
import ShowPosts from "../../components/posts/ShowPosts";
const SearchPost = ({ isHashtag }) => {
  const { searchText } = useParams();
  const query = isHashtag ? "posts/hashtag" : "/posts/content";
  const body = isHashtag ? { hashtag: searchText } : { content: searchText };
  const search = { num: isHashtag ? 2 : 1, text: searchText };
  //Gọi api
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.post(query, body).then((res) => {
      return res.data;
    })
  );
  return (
    <div>
      <SearchBar search={search}></SearchBar>
      <div className="search-container">
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
