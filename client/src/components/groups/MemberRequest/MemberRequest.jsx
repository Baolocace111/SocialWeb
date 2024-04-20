import React from "react";
import { useLanguage } from "../../../context/languageContext";
import "./memberRequest.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";

const MemberRequest = ({ request }) => {
  const { trl } = useLanguage();
  const { groupId } = useParams();
  const queryClient = useQueryClient();

  const approveMutation = useMutation(
    async (joinRequestId) => {
      try {
        const response = await makeRequest.put(`/joins/join/approve`, {
          joinRequestId,
        });
        return response.data;
      } catch (error) {
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["group-join-requests"]);
        queryClient.invalidateQueries(['pendingRequestsCount', groupId]);
      },
    }
  );

  const rejectMutation = useMutation(
    async (joinRequestId) => {
      try {
        const response = await makeRequest.delete(`/joins/join/reject`, {
          data: { joinRequestId },
        });
        return response.data;
      } catch (error) {
        alert(error.response.data.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["group-join-requests"]);
        queryClient.invalidateQueries(['pendingRequestsCount', groupId]);
      },
    }
  );

  const handleApprove = () => {
    approveMutation.mutate(request.id);
  };

  const handleReject = () => {
    rejectMutation.mutate(request.id);
  };

  return (
    <div className="member-request">
      <div className="request-info">
        <img
          src={`${URL_OF_BACK_END}users/profilePic/${request.user_id}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/upload/errorImage.png";
          }}
          alt={""}
        />
        <span className="info-name">{request.name}</span>
      </div>
      <div className="request-action">
        <button
          className="accept"
          onClick={handleApprove}
          disabled={approveMutation.isLoading}
        >
          {trl("Phê duyệt")}
        </button>
        <button
          className="deny"
          onClick={handleReject}
          disabled={rejectMutation.isLoading}
        >
          {trl("Từ chối")}
        </button>
        <button className="more">
          <MoreHorizIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default MemberRequest;
