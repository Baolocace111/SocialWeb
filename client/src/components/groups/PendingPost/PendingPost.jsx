import React from 'react';
import { useLanguage } from "../../../context/languageContext";
import "./pendingPost.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../../axios";
import moment from "moment";

const PendingPost = ({ post }) => {
    const { trl } = useLanguage();
    const { groupId } = useParams();
    const queryClient = useQueryClient();

    const approveMutation = useMutation(
        async (postId) => {
            return makeRequest.put(`/groups/${groupId}/approve-post`, {
                postId
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['group-pending-posts']);
                queryClient.invalidateQueries(['group-posts', groupId]);
                queryClient.invalidateQueries(['pendingPostsCount', groupId]);
            }
        }
    );

    const rejectMutation = useMutation(
        async (postId) => {
            return makeRequest.put(`/groups/${groupId}/reject-post`, {
                postId
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['group-pending-posts']);
                queryClient.invalidateQueries(['group-posts', groupId]);
                queryClient.invalidateQueries(['pendingPostsCount', groupId]);
            }
        }
    );

    const handleApprove = () => {
        approveMutation.mutate(post.id);
    };

    const handleReject = () => {
        rejectMutation.mutate(post.id);
    };

    return (
        <div className="pending-post">
            <div className="post-info">
                <img src={`${URL_OF_BACK_END}users/profilePic/${post.user_id}`} alt="User" />
                <div className="detail">
                    <span className="info-name">{post.name}</span>
                    <span className="date">{moment(post.createdAt).fromNow()}</span>
                </div>
            </div>
            <div className="post-content">
                <span className="post-desc">{post.desc}</span>
                <img src={URL_OF_BACK_END + `posts/videopost/` + post.id} alt="" />
            </div>
            <div className="post-action">
                <button className="accept" onClick={handleApprove} disabled={approveMutation.isLoading}>
                    {trl("Phê duyệt")}
                </button>
                <button className="deny" onClick={handleReject} disabled={rejectMutation.isLoading}>
                    {trl("Từ chối")}
                </button>
                <button className="more">
                    <MoreHorizIcon fontSize="small" />
                </button>
            </div>
        </div>
    );
};

export default PendingPost;