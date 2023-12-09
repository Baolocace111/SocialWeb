import "./friendSuggest.scss";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube";
import { makeRequest } from "../../../axios";
import React, { useEffect, useState, useCallback } from "react";

const FriendSuggest = () => {
    const [suggests, setSuggests] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchSuggests = useCallback(() => {
        makeRequest.get("/users/getUsers?offset=" + offset)
            .then((res) => {
                setSuggests((suggests) => removeDuplicateUnits([...suggests, ...res.data]));
                setOffset((prevOffset) => prevOffset + 8);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [offset]);

    useEffect(() => {
        fetchSuggests();
    }, [fetchSuggests]);

    const handleShowMore = () => {
        fetchSuggests();
    };

    return (
        <div className="friend-suggest">
            <div className="row">
                {suggests?.map((suggest) => (
                    <div className="card-invite" key={suggest.id}>
                        <img src={"/upload/" + suggest.profilePic} alt="User" />
                        <span>{suggest.name}</span>
                        <button className="accept">
                            Thêm bạn bè
                        </button>
                        <button className="deny">Xóa, gỡ</button>
                    </div>
                ))}
            </div>
            {loading && <NineCube />}
            {!loading && <button onClick={handleShowMore}>Show More</button>}
        </div>
    );
}
export default FriendSuggest;

function removeDuplicateUnits(arr) {
    const uniqueUnits = new Map();

    for (const unit of arr) {
        uniqueUnits.set(unit.id, unit);
    }

    return Array.from(uniqueUnits.values());
}

