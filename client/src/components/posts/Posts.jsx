import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import ShowPost from "./ShowPosts";
import { Waypoint } from "react-waypoint";
import { useEffect, useState } from "react";
const Posts = ({ userId }) => {
  // const { isLoading, error, data } = useQuery(["posts"], () =>
  //   makeRequest.get("/posts?userId=" + userId).then((res) => {
  //     return res.data;
  //   })
  // );
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isLoadingMore, setisLoadingMore] = useState(false);
  const fetchMoreData = () => {
    //console.log(offset);

    makeRequest
      .get("/posts?userId=" + userId + "&offset=" + offset)
      .then((res) => {
        if (isLoading) setLoading(false);
        setData(removeDuplicateUnits([...data, ...res.data.data]));
        setOffset(res.data.next);
        setisLoadingMore(false);
      })
      .catch((error) => {
        if (isLoading) setLoading(false);
        setError(error.response.data);
      })
      .finally(() => {
        //console.log(offset);
      });
  };
  useEffect(() => {
    fetchMoreData();
  }, []);
  const handleWaypointEnter = () => {
    if (offset !== -1) {
      setisLoadingMore(true);
      fetchMoreData();
    } // Khi Waypoint vào viewport, gọi hàm tải thêm dữ liệu
  };
  return (
    <>
      <ShowPost isLoading={isLoading} error={error} posts={data}></ShowPost>
      {!(error || isLoading || isLoadingMore) && (
        <Waypoint onEnter={handleWaypointEnter} />
      )}
      {isLoadingMore && <ThreePointLoading></ThreePointLoading>}
    </>
  );
};

export default Posts;
function removeDuplicateUnits(arr) {
  const uniqueUnits = new Map();
  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }
  return Array.from(uniqueUnits.values());
}
