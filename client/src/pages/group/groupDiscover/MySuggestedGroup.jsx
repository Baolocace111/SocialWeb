import "./mySuggestedGroup.scss";
import "../../../components/groups/GroupsJoined/groupsJoined.scss";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import { makeRequest } from "../../../axios.js";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import GroupSuggested from "../../../components/groups/GroupSuggest/GroupSuggested";

const MySuggestedGroup = () => {
    const { isLoading, data } = useQuery(["groups-suggested"], () =>
        makeRequest.get("/groups/recommended-groups").then((res) => {
            return res.data;
        })
    );

    return (
        <div className="my-suggested-group">
            <div className="row">
                {data?.map((group) => (
                    <GroupSuggested group={group} key={group.id} />
                ))}
            </div>
            {isLoading && <NineCube />}
            {/* {!isLoading && data.length !== 0 && <button>Show More</button>} */}
        </div>
    );
}
export default MySuggestedGroup;


