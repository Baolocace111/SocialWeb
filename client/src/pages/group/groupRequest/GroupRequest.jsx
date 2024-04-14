import './groupRequest.scss';
import React from 'react';
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MemberRequest from '../../../components/groups/MemberRequest/MemberRequest.jsx';
import NineCube from '../../../components/loadingComponent/nineCube/NineCube.jsx';
import { makeRequest } from '../../../axios';

const GroupRequest = () => {
    const { groupId } = useParams();

    const { data, isLoading } = useQuery(['group-join-requests', groupId], () =>
        makeRequest.get(`joins/groups/${groupId}/join-requests`).then(res => res.data)
    );

    return (
        <div className="group-request">
            {isLoading ? (
                <NineCube />
            ) : (
                <div className="row">
                    {data?.joinRequests?.length > 0 ? (
                        data.joinRequests.map(request => (
                            <MemberRequest request={request} key={request.id} />
                        ))
                    ) : (
                        <p>No member requests found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupRequest;