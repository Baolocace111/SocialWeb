import "./myGroup.scss";
import "../../../components/groups/GroupsJoined/groupsJoined.scss";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import { makeRequest } from "../../../axios.js";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import GroupsJoined from "../../../components/groups/GroupsJoined/GroupsJoined";

const MyGroup = () => {
    const { isLoading, data } = useQuery(["stories"], () =>
        makeRequest.get("/groups").then((res) => {
            return res.data;
        })
    );

    return (
        <div className="my-group">
            <div className="row">
                {data?.map((group) => (
                    <GroupsJoined group={group} key={group.id} />
                ))}
            </div>
            {isLoading && <NineCube />}
            {!isLoading && data.length !== 0 && <button>Show More</button>}
        </div>
    );
}
export default MyGroup;


