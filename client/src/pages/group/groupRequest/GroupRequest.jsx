import './groupRequest.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MemberRequest from '../../../components/groups/MemberRequest/MemberRequest.jsx';
import NineCube from '../../../components/loadingComponent/nineCube/NineCube.jsx';
import { makeRequest } from '../../../axios';
import { useState } from 'react';
import { useLanguage } from "../../../context/languageContext";

const GroupRequest = () => {
    const { trl } = useLanguage();
    const { groupId } = useParams();

    const { data, isLoading } = useQuery(['group-join-requests', groupId], () =>
        makeRequest.get(`joins/groups/${groupId}/join-requests`).then(res => res.data)
    );

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


    return (
        <div className="group-request">
            <div className="header">
                <span className="manage-header">{trl("Yêu cầu làm thành viên")}</span>
                <div className="sort-info">
                    <input type="text" placeholder={trl("Tìm kiếm theo tên")} className="search-input" />
                    <button className="filter-button" onClick={toggleDropdown}>
                        <span>{trl("Giới tính")}</span>
                        <FontAwesomeIcon icon={faCaretDown} />
                        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                            <div className="option">{trl("Nam")}</div>
                            <div className="option">{trl("Nữ")}</div>
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
                            <p>{trl("Không có yêu cầu tham gia nhóm.")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupRequest;