import './groupPendingPost.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import moment from "moment";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from '../../../axios';
import PendingPost from '../../../components/groups/PendingPost/PendingPost.jsx';
import NineCube from '../../../components/loadingComponent/nineCube/NineCube.jsx';
import { Waypoint } from "react-waypoint";
import { useState } from 'react';
import { useLanguage } from "../../../context/languageContext";

const GroupPendingPost = () => {
    const { groupId } = useParams();
    const { trl, language } = useLanguage();
    useEffect(() => {
        if (language === "jp") {
            moment.locale("ja");
        } else if (language === "vn") {
            moment.locale("vi");
        } else {
            moment.locale("en");
        }
    }, [language]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        error
    } = useInfiniteQuery(
        ['group-pending-posts', groupId],
        ({ pageParam = 1 }) => makeRequest.get(`/groups/${groupId}/pending-posts?offset=${pageParam}`).then((res) => res.data),
        {
            getNextPageParam: (lastPage) => lastPage.next !== -1 ? lastPage.next : undefined,
            refetchOnWindowFocus: false
        }
    );

    const handleWaypointEnter = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <div className="group-pending-post">
            <div className="header">
                <span className="manage-header">Đang chờ phê duyệt</span>
                <div className="sort-info">
                    <input type="text" placeholder="Tìm kiếm theo tên" className="search-input" />
                    <button className="filter-button" onClick={toggleDropdown}>
                        <span>Loại nội dung</span>
                        <FontAwesomeIcon icon={faCaretDown} />
                        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                            <div className="option">Ảnh</div>
                            <div className="option">Video</div>
                        </div>
                    </button>
                </div>
            </div>
            {isFetching && !isFetchingNextPage ? (
                <NineCube />
            ) : (
                <div className="row">
                    {data?.pages.flatMap(page => page.data).length > 0 ? (
                        data.pages.flatMap(page => page.data).map(post => (
                            <PendingPost post={post} key={post.id} />
                        ))
                    ) :
                        (
                            <div className="not-found">
                                <img src="https://www.facebook.com/images/comet/empty_states_icons/people/null_states_people_gray_wash.svg" alt="No request" />
                                <p>No pending post found.</p>
                            </div>
                        )}
                </div>
            )}
            {error && <p>Some error when loading posts...</p>}
            {hasNextPage && (
                <Waypoint onEnter={handleWaypointEnter} />
            )}
            {isFetchingNextPage && <NineCube />}
        </div>
    );
};

export default GroupPendingPost;