import { makeRequest } from "../../axios";
import Post from "../../components/post/Post";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
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
      <div>
        <span>
          Bạn đang tìm kiếm:{isHashtag ? "#" : ""} {searchText}
        </span>
      </div>
      <div>
        {error
          ? "Error!!!"
          : isLoading
          ? "loading"
          : data.map((post) => <Post post={post} key={post.id} />)}
      </div>
    </div>
  );
};
export default SearchPost;
