import GroupPost from "../../groups/GroupPost/GroupPost";
import "./groupPosts.scss";

import ThreePointLoading from "../../loadingComponent/threepointLoading/ThreePointLoading";
const ShowGroupPosts = ({ isLoading, error, posts }) => {
    return (
        <div className="posts">
            {error ? (
                "Something went wrong!"
            ) : isLoading ? (
                <ThreePointLoading></ThreePointLoading>
            ) : Array.isArray(posts) ? (
                posts.map((post) => (
                    <div key={post.id}>
                        <GroupPost post={post} />
                    </div>
                ))
            ) : (
                "No data available"
            )}
        </div>
    );
};
export default ShowGroupPosts;