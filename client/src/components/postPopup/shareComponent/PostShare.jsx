import { useLanguage } from "../../../context/languageContext";
import "./postShare.scss";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { TextareaAutosize } from "@mui/material";
import MiniPost from "../../post/MiniPost";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../../axios";

const PostShare = ({ post, setShowSharePopup, showSharePopup }) => {
    const { trl } = useLanguage();
    const [shareDesc, setShareDesc] = useState("");
    const handleShare = () => {
        setShareDesc("");
        setShowSharePopup(!showSharePopup);
    };
    const { currentUser } = useContext(AuthContext);

    const queryClient = useQueryClient();
    const shareMutation = useMutation(
        (data) => {
            return makeRequest.post("/posts/share", { post: data });
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries(["posts"]);
            },
        }
    );

    const handleShareApi = () => {
        shareMutation.mutate({
            desc: shareDesc,
            shareId: post.id,
        });
        handleShare();
    };
    return (
        <div className="share-popup">
            <div className="title">
                <ShareOutlinedIcon sx={{ marginRight: "8px", fontSize: "20px" }} />
                <span style={{ fontSize: "22px", fontWeight: "700" }}>
                    {trl("Share this post")}
                </span>
            </div>
            <div className="popup-content">
                <div className="user-info">
                    <img
                        src={
                            URL_OF_BACK_END + `users/profilePic/` + currentUser.id
                        }
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/upload/errorImage.png";
                        }}
                        alt={""}
                    />
                    <span>{currentUser.name}</span>
                </div>
                <TextareaAutosize
                    minRows={1}
                    placeholder={trl("Nhập nội mô tả của bạn")}
                    defaultValue={shareDesc}
                    onChange={(e) => setShareDesc(e.target.value)}
                    className="text-input"
                />
                <div
                    style={{
                        pointerEvents: "none",
                        maxHeight: "300px",
                    }}
                >
                    <MiniPost post={post} />
                </div>
            </div>
            <div className="popup-action">
                <button className="share" onClick={handleShareApi}>
                    {trl("SHARE")}
                </button>
                <button className="cancel" onClick={handleShare}>
                    {trl("CANCEL")}
                </button>
            </div>
        </div>
    );
};
export default PostShare;