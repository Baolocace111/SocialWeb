import { makeRequest } from "../../axios";
import Post from "../../components/post/Post";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/searchComponents/searchBar/SearchBar";
import "./searchPost.scss";
import NineCube from "../../components/loadingComponent/nineCube/NineCube";
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
        {error ? (
          "Error!!!"
        ) : isLoading ? (
          <NineCube />
        ) : (
          data.map((post) => <Post post={post} key={post.id} />)
        )}
      </div>
    </div>
  );
};
export default SearchPost;
