import React from 'react';
import "./memberRequest.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";

const MemberRequest = ({ request }) => {
    const queryClient = useQueryClient();

    const approveMutation = useMutation(
        async (joinRequestId) => {
            try {
                const response = await makeRequest.put(`/joins/join/approve`, { joinRequestId });
                return response.data;
            } catch (error) {
                alert(error.response.data);
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['group-join-requests']);
            }
        }
    );

    const handleApprove = () => {
        approveMutation.mutate(request.id);
    };

    return (
        <div className="member-request">
            <div className="request-info">
                <img src={`${URL_OF_BACK_END}users/profilePic/${request.user_id}`} alt="User" />
                <span className="info-name">{request.name}</span>
            </div>
            <div className="request-action">
                <button className="accept" onClick={handleApprove} disabled={approveMutation.isLoading}>
                    Phê duyệt
                </button>
                <button className="more">
                    <MoreHorizIcon fontSize="small" />
                </button>
            </div>
        </div>
    );
};

export default MemberRequest;