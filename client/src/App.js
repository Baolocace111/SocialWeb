import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Story from "./pages/story/Story";
import {
   createBrowserRouter,
   RouterProvider,
   Outlet,
   Navigate,
   useLocation,
   useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import StoriesBar from "./components/stories/StoriesBar/storiesBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import GroupDetail from "./pages/group/groupDetail/GroupDetail";
import GroupPostDetail from "./pages/group/groupPostDetail/GroupPostDetail";
import GroupRequest from "./pages/group/groupRequest/GroupRequest";
import GroupPendingPost from "./pages/group/groupPendingPost/GroupPendingPost";
import MyPendingPosts from "./pages/group/groupContent/myPendingPost/MyPendingPosts";
import MyPostedPosts from "./pages/group/groupContent/myPostedPost/MyPostedPosts";
import Search from "./pages/search/searchUser/Search";
import SearchGroup from "./pages/search/searchGroup/SearchGroup";
import SearchBar from "./components/searchComponents/searchBar/SearchBar";
import FriendsBar from "./components/friends/FriendsBar";

import "./style.scss";
import "./pages/story/story.scss";

import { useCookies } from "react-cookie";
import { useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FriendInvite from "./pages/friend/friendinvite/FriendInvite";
import FriendSuggest from "./pages/friend/friendSuggest/FriendSuggest";
import SearchPost from "./pages/search/searchPost/SearchPost";
import PostPage from "./pages/post/detailedPost/PostPage";
import NotifiedPost from "./pages/post/notifiedPost/NotifiedPost";
import Error from "./pages/Error/Error";
import AdminOnly from "./pages/Error/AdminOnly";
import AdminHome from "./pages/admin/adminHome/AdminHome";
import { makeRequest } from "./axios";
import NineCube from "./components/loadingComponent/nineCube/NineCube";
import AdminLogin from "./pages/admin/adminLogin/AdminLogin";
import AdminLeftBar from "./components/adminComponent/leftBar/LeftBar";
import GroupsBar from "./components/groups/GroupsBar";
import GroupCreate from "./components/groups/GroupCreate/GroupCreate";
import GroupManage from "./components/groups/GroupManage/GroupManage";
import GroupContent from "./components/groups/GroupContent/GroupContent";
import MyGroup from "./pages/group/groupJoined/MyGroup";
import CreateGroup from "./pages/group/groupCreate/CreateGroup";
import AdminUserManagement from "./pages/admin/adminHome/AdminUserManagement";
import Gameindex from "./pages/games/Gameindex";
import Carogames from "./pages/games/Carogame";
import Call from "./pages/call/Call";
import AdminLanguageManagement from "./pages/admin/adminLanguageManagement/AdminLanguageManagement";
import FriendDashBoard from "./pages/friend/friendDashboard/FriendDashboard";
import UnderContructionPage from "./pages/Error/UnderContruction";
import AdminFeedback from "./pages/admin/adminFeedback/AdminFeedback";
import OnlyFanPage from "./pages/home/onlyFan/OnlyFan";
import Gallery from "./pages/gallery/Gallery";

function App() {
   const { currentUser } = useContext(AuthContext);

   const { darkMode } = useContext(DarkModeContext);

   const queryClient = new QueryClient();

   const Layout = () => {
      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <div style={{ display: "flex" }}>
               <div style={{ flex: 2 }}>
                  <LeftBar />
               </div>
               <div style={{ flex: 5 }}>
                  <Outlet />
               </div>
               <div style={{ flex: 3 }}>
                  <RightBar />
               </div>
            </div>
         </div>
      );
   };
   const AdminLayout = () => {
      const [isLoading, setisLoading] = useState(true);
      const [error, setError] = useState(null);
      if (isLoading)
         makeRequest
            .get("/auth/admin/check")
            .then((res) => {
               setisLoading(false);
            })
            .catch((e) => {
               setError(true);
               setisLoading(false);
               console.log(error);
            });
      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            {error ? (
               <AdminOnly />
            ) : isLoading ? (
               <NineCube />
            ) : (
               <div>
                  <AdminLeftBar></AdminLeftBar>
                  <Outlet />
               </div>
            )}
         </div>
      );
   };

   const ProfileLayout = () => {
      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <Profile />
         </div>
      );
   };

   const PostNotificationLayout = () => {
      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <NotifiedPost />
         </div>
      );
   };

   const FriendsLayout = () => {
      const location = useLocation();
      const navigate = useNavigate();

      useEffect(() => {
         if (location.pathname === "/friends") {
            navigate("/friends/dashboard");
         }
      }, [location.pathname, navigate]);

      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <div style={{ display: "flex" }}>
               <div style={{ flex: "25%" }}>
                  <FriendsBar />
               </div>
               <div
                  style={{
                     flex: "75%",
                     backgroundColor: darkMode ? "#333" : "#f6f3f3",
                  }}
               >
                  <Outlet />
               </div>
            </div>
         </div>
      );
   };

   const GroupsLayout = () => {
      const location = useLocation();
      const navigate = useNavigate();

      useEffect(() => {
         if (location.pathname === "/groups") {
            navigate("/groups/joins");
         }
      }, [location.pathname, navigate]);

      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <div style={{ display: "flex" }}>
               <div style={{ flex: "25%" }}>
                  <GroupsBar />
               </div>
               <div style={{ flex: "75%", backgroundColor: "#f6f3f3" }}>
                  <Outlet />
               </div>
            </div>
         </div>
      );
   };

   const GroupCreateLayout = () => {
      const [groupName, setGroupName] = useState("");
      const [groupPrivacy, setGroupPrivacy] = useState("");

      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <div style={{ display: "flex" }}>
               <div style={{ flex: "25%" }}>
                  <GroupCreate
                     setGroupName={setGroupName}
                     setGroupPrivacy={setGroupPrivacy}
                     groupPrivacy={groupPrivacy}
                     groupName={groupName}
                  />
               </div>
               <div style={{ flex: "75%", backgroundColor: "#f6f3f3" }}>
                  <CreateGroup groupName={groupName} groupPrivacy={groupPrivacy} />
               </div>
            </div>
         </div>
      );
   };

   const GroupDetailLayout = () => {
      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <div style={{ display: "flex" }}>
               <div style={{ flex: "25%" }}>
                  <GroupManage />
               </div>
               <div
                  style={{
                     flex: "75%",
                     backgroundColor: darkMode ? "#333" : "#f6f3f3",
                  }}
               >
                  <Outlet />
               </div>
            </div>
         </div>
      );
   };

   const GroupContentLayout = () => {
      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <div style={{ display: "flex" }}>
               <div style={{ flex: "25%" }}>
                  <GroupContent />
               </div>
               <div
                  style={{
                     flex: "75%",
                     backgroundColor: darkMode ? "#333" : "#f6f3f3",
                  }}
               >
                  <Outlet />
               </div>
            </div>
         </div>
      );
   };

   const PostLayout = () => {
      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <PostPage />
         </div>
      );
   };

   const SearchLayout = () => {
      const location = useLocation();
      const pathSegments = location.pathname.split("/");
      const searchText = pathSegments[2];
      const isSearchUrl =
         pathSegments.length === 3 && pathSegments[1] === "search";
      if (isSearchUrl) {
         return <Navigate to={`/search/${searchText}/people`} />;
      }

      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <Navbar />
            <div style={{ display: "flex" }}>
               <div style={{ flex: "25%" }}>
                  <SearchBar />
               </div>
               <div style={{ flex: "75%", backgroundColor: "#f6f3f3" }}>
                  <Outlet />
               </div>
            </div>
         </div>
      );
   };

   const StoryLayout = () => {
      const [selectedUserId, setSelectedUserId] = useState(null);
      const [activeStoryUserId, setActiveStoryUserId] = useState(null);
      const location = useLocation();

      useEffect(() => {
         // Kiểm tra xem có state được truyền qua không
         if (location.state && location.state.selectedUserId) {
            setSelectedUserId(location.state.selectedUserId);
         }
      }, [location]);

      return (
         <div className={`theme-${darkMode ? "dark" : "light"}`}>
            <div style={{ display: "flex" }}>
               <StoriesBar
                  selectedUserId={activeStoryUserId}
                  onUserSelect={setSelectedUserId}
               />
               <Story
                  userId={selectedUserId}
                  onActiveUserChange={setActiveStoryUserId}
               />
            </div>
         </div>
      );
   };

   const ProtectedRoute = ({ children }) => {
      const [cookies] = useCookies(["accessToken"]);
      if (!currentUser || !cookies.accessToken) {
         return <Navigate to="/login" />;
      }
      return children;
   };

   const router = createBrowserRouter([
      {
         path: "/",
         element: (
            <ProtectedRoute>
               <Layout />
            </ProtectedRoute>
         ),
         children: [
            {
               path: "/",
               element: <Home />,
            },
            {
               path: "/market",
               element: <UnderContructionPage></UnderContructionPage>,
            },
            {
               path: "/watch",
               element: <UnderContructionPage></UnderContructionPage>,
            },
            {
               path: "/memories",
               element: <UnderContructionPage></UnderContructionPage>,
            },
            {
               path: "/event",
               element: <UnderContructionPage></UnderContructionPage>,
            },
            {
               path: "/gallery",
               element: <Gallery />,
            },
            {
               path: "/video",
               element: <UnderContructionPage></UnderContructionPage>,
            },
            {
               path: "/messages",
               element: <UnderContructionPage></UnderContructionPage>,
            },
            {
               path: "/fund",
               element: <UnderContructionPage></UnderContructionPage>,
            },
            {
               path: "/tutorial",
               element: <UnderContructionPage></UnderContructionPage>,
            },
            {
               path: "/course",
               element: <UnderContructionPage></UnderContructionPage>,
            },
         ],
      },
      {
         path: "/login",
         element: <Login />,
      },
      {
         path: "/register",
         element: <Register />,
      },
      {
         path: "/onlyfan",
         element: <OnlyFanPage></OnlyFanPage>,
      },
      {
         path: "/profile/:userId",
         element: <ProfileLayout />,
      },
      {
         path: "/stories",
         element: <StoryLayout />,
      },
      {
         path: "/friends",
         element: <FriendsLayout />,
         children: [
            {
               path: "/friends/requests",
               element: <FriendInvite />,
            },
            {
               path: "/friends/suggestions",
               element: <FriendSuggest />,
            },
            {
               path: "/friends/dashboard",
               element: <FriendDashBoard />,
            },
         ],
      },
      {
         path: "/groups",
         element: <GroupsLayout />,
         children: [
            {
               path: "/groups/discover",
               element: <FriendInvite />,
            },
            {
               path: "/groups/joins",
               element: <MyGroup />,
            },
         ],
      },
      {
         path: "/groups/create",
         element: <GroupCreateLayout />,
      },
      {
         path: "/groups/:groupId/my-content",
         element: <GroupContentLayout />,
         children: [
            {
               path: "/groups/:groupId/my-content",
               element: <MyPendingPosts />,
            },
            {
               path: "/groups/:groupId/my-content/pending",
               element: <MyPendingPosts />,
            },
            {
               path: "/groups/:groupId/my-content/posted",
               element: <MyPostedPosts />,
            },
            {
               path: "/groups/:groupId/my-content/declined",
               element: <FriendInvite />,
            },
         ],
      },
      {
         path: "/groups/:groupId",
         element: <GroupDetailLayout />,
         children: [
            {
               path: "/groups/:groupId",
               element: <GroupDetail />,
            },
            {
               path: "/groups/:groupId/overview",
               element: <FriendSuggest />,
            },
            {
               path: "/groups/:groupId/member-requests",
               element: <GroupRequest />,
            },
            {
               path: "/groups/:groupId/pending_posts",
               element: <GroupPendingPost />,
            },
            {
               path: "/groups/:groupId/posts/:postId",
               element: <GroupPostDetail />,
            },
         ],
      },
      {
         path: "/search/:searchText",
         element: <SearchLayout />,
         children: [
            {
               path: "/search/:searchText",
               element: <Error />,
            },
            {
               path: "/search/:searchText/people",
               element: <Search />,
            },
            {
               path: "/search/:searchText/post",
               element: <SearchPost isHashtag={false} />,
            },
            {
               path: "/search/:searchText/hashtag",
               element: <SearchPost isHashtag={true} />,
            },
            {
               path: "/search/:searchText/groups",
               element: <SearchGroup />,
            },
         ],
      },
      {
         path: "/seepost/:postId",
         element: <PostLayout />,
      },
      {
         path: "/notification/post/:postId",
         element: <PostNotificationLayout />,
      },
      {
         path: "/error",
         element: <Error />,
      },
      {
         path: "/adminlogin",
         element: <AdminLogin />,
      },
      {
         path: "/admin",
         element: <AdminLayout />,
         children: [
            {
               path: "/admin/home",
               element: <AdminHome />,
            },
            {
               path: "/admin/user",
               element: <AdminUserManagement />,
            },
            {
               path: "/admin/language",
               element: <AdminLanguageManagement />,
            },
            {
               path: "/admin/feedback",
               element: <AdminFeedback></AdminFeedback>,
            },
         ],
      },
      {
         path: "/game",
         element: <Gameindex />,
         children: [
            {
               path: "/game/caro",
               element: <Carogames />,
            },
         ],
      },
      {
         path: "/call/:id",
         element: <Call />,
      },
   ]);

   return (
      <QueryClientProvider client={queryClient}>
         <div>
            <RouterProvider router={router} />
         </div>
      </QueryClientProvider>
   );
}

export default App;
