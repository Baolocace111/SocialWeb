import "./friendSuggest.scss";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube";
import { makeRequest } from "../../../axios";
import { AuthContext } from "../../../context/authContext";
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

const FriendSuggest = () => {
    const { currentUser } = useContext(AuthContext);

    const { isLoading, data } = useQuery(["suggestions"], () =>
        makeRequest.get("/users/getUsers").then((res) => {
            return res.data;
        })
    );

    const filteredData = data?.filter((user) => user.id !== currentUser.id);

    return (
        <div className="friend-suggest">
            <div className="row">
                {filteredData?.map((request) => (
                    <div className="card-invite" key={request.id}>
                        <img src={"/upload/" + request.profilePic} alt="User" />
                        <span>{request.name}</span>
                        <button className="accept">
                            Thêm bạn bè
                        </button>
                        <button className="deny">Xóa, gỡ</button>
                    </div>
                ))}
            </div>
            {isLoading && <NineCube />}
            {/* {!loading && <button onClick={handleShowMore}>Show More</button>} */}
        </div>
    );
}
export default FriendSuggest;
