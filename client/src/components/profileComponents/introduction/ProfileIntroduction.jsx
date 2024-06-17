import "./profileIntroduction.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faMars,
  faVenus,
  faCakeCandles,
  faEnvelope,
  faLink,
  faLocationDot,
  faMarsAndVenus,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { makeRequest } from "../../../axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { useLanguage } from "../../../context/languageContext";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
const ProfileIntroduction = ({ userId }) => {
  const { trl, language } = useLanguage();
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [currentTab, setCurrentTab] = useState(1);
  const fetchUserData = async (userId, language) => {
    const response = await makeRequest.get(`users/find/${userId}`);
    const { birthDay, monthDay, birthYear } = extractAndFormatDateComponents(
      response.data.birthdate,
      language
    );
    const link = extractAndFormatDomainName(response.data.website);
    return {
      ...response.data,
      birthDay,
      monthDay,
      birthYear,
      link,
    };
  };
  const { data, error, isLoading } = useQuery(
    ["userData", userId, language],
    () => fetchUserData(userId, language)
  );
  const queryClient = useQueryClient();
  const handleRefetch = () => {
    // Invalidate the query to refetch the data
    queryClient.invalidateQueries(["userData", userId, language]);
  };

  useEffect(() => {
    if (data) {
      setUserInfo(data);
    }
  }, [data]);

  if (isLoading) return <div>{trl("Loading")}</div>;
  if (error)
    return (
      <div>
        {trl("An unexpected error occurred")} {trl(error.message)}
      </div>
    );

  const tabsData = [
    {
      id: 1,
      title: trl("Tổng quan"),
      content: (
        <>
          <div className="subject">
            <span className="title">{trl("Thông tin cơ bản")}</span>
            <div className="infor-section">
              <div className="info">
                {userInfo.gender === 0 ? (
                  <FontAwesomeIcon
                    icon={faMars}
                    style={{ marginTop: "5px" }}
                    size="xl"
                  />
                ) : userInfo.gender === 1 ? (
                  <FontAwesomeIcon
                    icon={faVenus}
                    style={{ marginTop: "5px" }}
                    size="xl"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faMarsAndVenus}
                    style={{ marginTop: "5px" }}
                    size="xl"
                  />
                )}
                <div className="detail-section">
                  <div className="detail">
                    <span className="main">
                      {userInfo.gender === 0
                        ? trl("Nam")
                        : userInfo.gender === 1
                        ? trl("Nữ")
                        : trl("Other")}
                    </span>
                    <span className="sub">{trl("Giới tính")}</span>
                  </div>
                </div>
                {currentUser.id === userId && (
                  <div className="edit-button" style={{ marginTop: "5px" }}>
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                )}
              </div>
              <div className="info">
                <FontAwesomeIcon
                  icon={faCakeCandles}
                  style={{ marginTop: "5px" }}
                  size="xl"
                />
                <div className="detail-section">
                  <div className="detail">
                    <span className="main">{userInfo.birthDay}</span>
                    <span className="sub">{trl("Birthday")}</span>
                  </div>
                  <div className="detail">
                    <span className="main">{userInfo.monthDay}</span>
                    <span className="sub">{trl("Birth month")}</span>
                  </div>
                  <div className="detail">
                    <span className="main">{userInfo.birthYear}</span>
                    <span className="sub">{trl("Birth year")}</span>
                  </div>
                </div>
                {currentUser.id === userId && (
                  <div className="edit-button" style={{ marginTop: "5px" }}>
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 2,
      title: trl("Thông tin liên hệ"),
      content: (
        <>
          <div className="subject">
            <span className="title">{trl("Thông tin liên hệ")}</span>
            <div className="infor-section">
              <div className="info">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ marginTop: "5px" }}
                  size="xl"
                />
                <div className="detail-section">
                  <div className="detail">
                    <span className="main">{userInfo.email}</span>
                    <span className="sub">Email</span>
                  </div>
                </div>
                {currentUser.id === userId && (
                  <div className="edit-button" style={{ marginTop: "5px" }}>
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="subject">
            <span className="title">
              {trl("Các trang web và liên kết xã hội")}
            </span>
            <div className="infor-section">
              <div className="info">
                <FontAwesomeIcon
                  icon={faLink}
                  style={{ marginTop: "5px" }}
                  size="lg"
                />
                <div className="detail-section">
                  <div className="detail">
                    <span className="main">{userInfo.website}</span>
                    <span className="sub">{userInfo.link}</span>
                  </div>
                </div>
                {currentUser.id === userId && (
                  <div className="edit-button" style={{ marginTop: "5px" }}>
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 3,
      title: trl("Nơi đang sống"),
      content: (
        <>
          <div className="subject">
            <span className="title">{trl("Nơi đang sống")}</span>
            <div className="infor-section">
              <div className="info">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ marginTop: "5px" }}
                  size="xl"
                />
                <div className="detail-section">
                  <div className="detail">
                    <span className="main">{userInfo.city}</span>
                    <span className="sub">{trl("Đang ở")}</span>
                  </div>
                </div>
                {currentUser.id === userId && (
                  <div className="edit-button" style={{ marginTop: "5px" }}>
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="profile-introduction">
      <div className="tabs">
        {tabsData.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${currentTab === tab.id ? "active" : ""}`}
            onClick={() => setCurrentTab(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className="content">
        {tabsData.find((tab) => tab.id === currentTab)?.content}
      </div>
    </div>
  );
};

export default ProfileIntroduction;

function extractAndFormatDateComponents(dateString, language) {
  const date = new Date(dateString);

  const day = date.getDate();
  const options = { month: "long" };

  // Định nghĩa locale dựa trên giá trị của biến language
  let locale;
  if (language === "jp") {
    locale = "ja-JP";
  } else if (language === "vn") {
    locale = "vi-VN";
  } else {
    locale = "en-US";
  }

  const month = date.toLocaleString(locale, options);
  const year = date.getFullYear();

  const birthDay = `${day}`;
  const birthYear = `${year}`;
  const monthDay = `${month}`;

  return { birthDay, monthDay, birthYear };
}

function extractAndFormatDomainName(url) {
  const domainNameMap = {
    facebook: "Facebook",
    youtube: "YouTube",
    twitter: "Twitter",
    instagram: "Instagram",
  };

  const cleanUrl = url.replace(/(https?:\/\/)?(www\.)?/, "");

  const parts = cleanUrl.split(".");

  return domainNameMap[parts[0].toLowerCase()] || parts[0];
}
