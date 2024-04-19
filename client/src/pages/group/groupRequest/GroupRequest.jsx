import './groupRequest.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MemberRequest from '../../../components/groups/MemberRequest/MemberRequest.jsx';
import NineCube from '../../../components/loadingComponent/nineCube/NineCube.jsx';
import { makeRequest } from '../../../axios';
import { useState } from 'react';

const GroupRequest = () => {
    const { groupId } = useParams();

    const { data, isLoading } = useQuery(['group-join-requests', groupId], () =>
        makeRequest.get(`joins/groups/${groupId}/join-requests`).then(res => res.data)
    );

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


    return (
        <div className="group-request">
            <div className="header">
                <span className="manage-header">Yêu cầu làm thành viên</span>
                <div className="sort-info">
                    <input type="text" placeholder="Tìm kiếm theo tên" className="search-input" />
                    <button className="filter-button" onClick={toggleDropdown}>
                        <span>Giới tính</span>
                        <FontAwesomeIcon icon={faCaretDown} />
                        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                            <div className="option">Nam</div>
                            <div className="option">Nữ</div>
                        </div>
                    </button>
                </div>
            </div>
            {isLoading ? (
                <NineCube />
            ) : (
                <div className="row">
                    {data?.joinRequests?.length > 0 ? (
                        data.joinRequests.map(request => (
                            <MemberRequest request={request} key={request.id} />
                        ))
                    ) : (
                        <div className="not-found">
                            <img src="https://www.facebook.com/images/comet/empty_states_icons/people/null_states_people_gray_wash.svg" alt="No request" />
                            <p>No member request found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupRequest;