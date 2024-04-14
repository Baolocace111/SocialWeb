import GroupTab from "../../../components/searchComponents/groupTab/GroupTab.jsx";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useParams } from "react-router-dom";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube";
import "./searchGroup.scss";

const SearchGroup = () => {
    const { searchText } = useParams();

    const { isLoading, error, data } = useQuery(["groups", searchText], () =>
        makeRequest.post("/groups/search", { searchText }).then((res) => {
            return res.data;
        })
    );

    return (
        <div className="search-group">
            {error ? (
                "Error!!!"
            ) : isLoading ? (
                <NineCube />
            ) : (
                data.map((group) => <GroupTab group={group} key={group.id} />)
            )}
        </div>
    );
};
export default SearchGroup;