import "./friendSuggest.scss";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube";
import { makeRequest } from "../../../axios";
import React, { useEffect, useState } from "react";
import FriendSuggestion from "../../../components/friends/FriendSuggestion/FriendSuggestion";
import { useLanguage } from "../../../context/languageContext";

const FriendSuggest = () => {
  const { trl } = useLanguage();
  const [suggests, setSuggests] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSuggests = (fetchOffset) => {
    makeRequest
      .get("/users/getUsers?offset=" + fetchOffset)
      .then((res) => {
        setSuggests((suggests) =>
          removeDuplicateUnits([...suggests, ...res.data])
        );
        setOffset(fetchOffset);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSuggests(offset);
  }, [offset]);

  const handleShowMore = () => {
    const newOffset = offset + 8;
    fetchSuggests(newOffset);
  };

  return (
    <div className="friend-suggest">
      <div className="row">
        {suggests?.map((suggest) => (
          // <div className="card-invite" key={suggest.id}>
          //     <img src={"/upload/" + suggest.profilePic} alt="User" />
          //     <span>{suggest.name}</span>
          //     <button className="accept" onClick={() => SendRequest(suggest.id)}>
          //         Thêm bạn bè
          //     </button>
          //     <button className="deny">Xóa, gỡ</button>
          // </div>
          <FriendSuggestion suggest={suggest} key={suggest.id} />
        ))}
      </div>
      {loading && <NineCube />}
      {!loading && suggests.length !== 0 && (
        <button onClick={handleShowMore}>{trl("Show More")}</button>
      )}
    </div>
  );
};
export default FriendSuggest;

function removeDuplicateUnits(arr) {
  const uniqueUnits = new Map();

  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }

  return Array.from(uniqueUnits.values());
}
