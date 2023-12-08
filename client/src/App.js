import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Story from "./pages/story/Story";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  Link,
  useLocation
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import StoriesBar from "./components/stories/StoriesBar/storiesBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Search from "./pages/search/Search";
import SearchBar from "./components/searchComponents/searchBar/SearchBar";
import FriendsBar from "./components/friends/FriendsBar";

import "./style.scss";
import "./pages/story/story.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import { useCookies } from "react-cookie";
import { useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import SearchPost from "./pages/searchPost/SearchPost";
import PostPage from "./pages/postPage/PostPage";
import Error from "./pages/Error/Error";
import AdminOnly from "./pages/Error/AdminOnly";
import AdminHome from "./pages/admin/adminHome/AdminHome";
import { makeRequest } from "./axios";
import NineCube from "./components/loadingComponent/nineCube/NineCube";
import AdminLogin from "./pages/admin/adminLogin/AdminLogin";
import FriendInvite from "./pages/friend/friendinvite/FriendInvite";


function App() {
  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
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
          <Outlet />
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

  const FriendsLayout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <div style={{ flex: "25%" }}>
            <FriendsBar />
          </div>
          <div style={{ flex: "75%", backgroundColor: "#f6f3f3" }}>
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  const SearchLayout = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const searchText = pathSegments[2];
    const isSearchUrl = pathSegments.length === 3 && pathSegments[1] === "search";
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
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <div style={{ display: "flex" }}>
          <StoriesBar />
          <div
            className="story-page"
            style={{
              flex: 8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Story />
            <Link to="/">
              <button className="close-button">
                <FontAwesomeIcon icon={faX} />
              </button>
            </Link>
          </div>
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
      path: "/profile/:userId",
      element: <ProfileLayout />,
    },
    {
      path: "/stories/:userId",
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
          element: <Error />,
        },
      ]
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
      ],
    },
    {
      path: "/seepost/:postId",
      element: <PostPage />,
    },
    {
      path: "/error",
      element: <Error />,
    },
    {
      path: "/adminlogin",
      element: <AdminLogin />
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "/admin/home",
          element: <AdminHome />
        }],
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
