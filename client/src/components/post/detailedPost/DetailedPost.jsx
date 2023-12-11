import "./detailedPost.scss";
import moment from "moment";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThreePointLoading from "../../loadingComponent/threepointLoading/ThreePointLoading";

import Description from "../desc";
import Comments from "../../comments/Comments";
import { makeRequest } from "../../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";

const DetailedPost = ({ post }) => {
    const { currentUser } = useContext(AuthContext);
    const { isLoading, data } = useQuery(["likes", post.id], () =>
        makeRequest.get("/likes?postId=" + post.id).then((res) => {
            return res.data;
        })
    );
    const queryClient = useQueryClient();

    const mutation = useMutation(
        (liked) => {
            if (liked) return makeRequest.delete("/likes?postId=" + post.id);
            return makeRequest.post("/likes", { postId: post.id });
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries(["likes"]);
            },
        }
    );
    const handleLike = () => {
        mutation.mutate(data.includes(currentUser.id));
    };

    const [imageLoaded, setImageLoaded] = useState(false);
    const handleImageLoad = () => {
        setImageLoaded(true);
    };


    return (
        <div className="detail-post">
            <div className="image-area">
                {!imageLoaded && <ThreePointLoading />}
                <img src={"/upload/" + post.img} alt="" onLoad={handleImageLoad} />
            </div>
            {imageLoaded && (
                <div className="content-area">
                    <div className="userInfo">
                        <img src={"/upload/" + post.profilePic} alt="" />
                        <div className="details">
                            <span className="name"
                                onClick={() => {
                                    window.location.href = `/profile/${post.userId}`;
                                }}>
                                {post.name}
                            </span>
                            <span className="date">{moment(post.createdAt).fromNow()}</span>
                        </div>
                        <div className="more"><MoreHorizIcon /></div>
                    </div>
                    <div className="post-content">
                        <Description text={post.desc}></Description>
                    </div>
                    <div className="post-info">
                        <div className="item">
                            {isLoading ? (
                                <ThreePointLoading />
                            ) : data.includes(currentUser.id) ? (
                                <FavoriteOutlinedIcon
                                    style={{ color: "red" }}
                                    onClick={handleLike}
                                />
                            ) : (
                                <FavoriteBorderOutlinedIcon onClick={handleLike} />
                            )}
                            {data?.length} Likes
                        </div>
                        <div className="item">
                            <TextsmsOutlinedIcon />
                            See Comments
                        </div>
                    </div>
                    <div className="post-comment">
                        <Comments postId={post.id} />
                    </div>
                </div>
            )}
        </div>
    )
}
export default DetailedPost;