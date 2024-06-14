import './profileIntroduction.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faMars, faVenus, faCakeCandles, faEnvelope, faLink, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../../axios';

const ProfileIntroduction = () => {
   const [userInfo, setUserInfo] = useState({});
   const [currentTab, setCurrentTab] = useState(1);

   useEffect(() => {
      makeRequest.get('users/find/23')
         .then(response => {
            const { birthDay, birthYear } = extractAndFormatDateComponents(response.data.birthdate);
            const link = extractAndFormatDomainName(response.data.website);
            setUserInfo({
               ...response.data,
               birthDay,
               birthYear,
               link
            });
         })
         .catch(error => console.error("There was an error!", error));
   }, []);

   const tabsData = [
      {
         id: 1,
         title: "Tổng quan",
         content: (
            <>
               <div className="subject">
                  <span className="title">Thông tin cơ bản</span>
                  <div className="infor-section">
                     <div className="info">
                        {userInfo.gender === 0
                           ? <FontAwesomeIcon icon={faMars} style={{ marginTop: "5px" }} size="xl" />
                           : <FontAwesomeIcon icon={faVenus} style={{ marginTop: "5px" }} size="xl" />}
                        <div className="detail-section">
                           <div className="detail">
                              <span className="main">{userInfo.gender === 0 ? 'Nam' : 'Nữ'}</span>
                              <span className="sub">Giới tính</span>
                           </div>
                        </div>
                        <div className="edit-button" style={{ marginTop: "5px" }}>
                           <FontAwesomeIcon icon={faPen} />
                        </div>
                     </div>
                     <div className="info">
                        <FontAwesomeIcon icon={faCakeCandles} style={{ marginTop: "5px" }} size="xl" />
                        <div className="detail-section">
                           <div className="detail">
                              <span className="main">{userInfo.birthDay}</span>
                              <span className="sub">Ngày sinh</span>
                           </div>
                           <div className="detail">
                              <span className="main">{userInfo.birthYear}</span>
                              <span className="sub">Năm sinh</span>
                           </div>
                        </div>
                        <div className="edit-button" style={{ marginTop: "5px" }}>
                           <FontAwesomeIcon icon={faPen} />
                        </div>
                     </div>
                  </div>
               </div>
            </>
         )
      },
      {

         id: 2,
         title: "Thông tin liên hệ",
         content: (
            <>
               <div className="subject">
                  <span className="title">Thông tin liên hệ</span>
                  <div className="infor-section">
                     <div className="info">
                        <FontAwesomeIcon icon={faEnvelope} style={{ marginTop: "5px" }} size="xl" />
                        <div className="detail-section">
                           <div className="detail">
                              <span className="main">{userInfo.email}</span>
                              <span className="sub">Email</span>
                           </div>
                        </div>
                        <div className="edit-button" style={{ marginTop: "5px" }}>
                           <FontAwesomeIcon icon={faPen} />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="subject">
                  <span className="title">Các trang web và liên kết xã hội</span>
                  <div className="infor-section">
                     <div className="info">
                        <FontAwesomeIcon icon={faLink} style={{ marginTop: "5px" }} size="lg" />
                        <div className="detail-section">
                           <div className="detail">
                              <span className="main">{userInfo.website}</span>
                              <span className="sub">{userInfo.link}</span>
                           </div>
                        </div>
                        <div className="edit-button" style={{ marginTop: "5px" }}>
                           <FontAwesomeIcon icon={faPen} />
                        </div>
                     </div>
                  </div>
               </div>
            </>
         )
      },
      {
         id: 3,
         title: "Nơi đang sống",
         content: (
            <>
               <div className="subject">
                  <span className="title">Nơi đang sống</span>
                  <div className="infor-section">
                     <div className="info">
                        <FontAwesomeIcon icon={faLocationDot} style={{ marginTop: "5px" }} size="xl" />
                        <div className="detail-section">
                           <div className="detail">
                              <span className="main">{userInfo.city}</span>
                              <span className="sub">Đang ở</span>
                           </div>
                        </div>
                        <div className="edit-button" style={{ marginTop: "5px" }}>
                           <FontAwesomeIcon icon={faPen} />
                        </div>
                     </div>
                  </div>
               </div>
            </>
         )
      },
   ];

   return (
      <div className="profile-introduction">
         <div className="tabs">
            {tabsData.map(tab => (
               <div
                  key={tab.id}
                  className={`tab ${currentTab === tab.id ? 'active' : ''}`}
                  onClick={() => setCurrentTab(tab.id)}
               >
                  {tab.title}
               </div>
            ))}
         </div>
         <div className="content">
            {tabsData.find(tab => tab.id === currentTab)?.content}
         </div>
      </div>
   );
};

export default ProfileIntroduction;

function extractAndFormatDateComponents(dateString) {
   const date = new Date(dateString);

   const day = date.getDate();
   const month = date.toLocaleString('vi-VN', { month: 'long' });
   const year = date.getFullYear();

   const birthDay = `${day} ${month}`;
   const birthYear = `${year}`;

   return { birthDay, birthYear };
}

function extractAndFormatDomainName(url) {
   const domainNameMap = {
      "facebook": "Facebook",
      "youtube": "YouTube",
      "twitter": "Twitter",
      "instagram": "Instagram"
   };

   const cleanUrl = url.replace(/(https?:\/\/)?(www\.)?/, '');

   const parts = cleanUrl.split('.');

   return domainNameMap[parts[0].toLowerCase()] || parts[0];
}
