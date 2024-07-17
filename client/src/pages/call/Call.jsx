import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { WEBSOCKET_BACK_END, makeRequest } from "../../axios";
import PopupWindow from "../../components/PopupComponent/PopupWindow";
import "./call.scss";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import { useLanguage } from "../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faMicrophoneAlt,
   faMicrophoneAltSlash,
   faEye,
   faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { URL_OF_BACK_END } from "../../axios";
const Call = () => {
   const { trl } = useLanguage();
   const { RTCPeerConnection, RTCSessionDescription } = window;
   const { id } = useParams();
   const [ws, setWs] = useState(null);
   const wsRef = useRef(null);
   const { currentUser } = useContext(AuthContext);
   const [callPopup, SetCallingPopup] = useState(false);
   const [localStream, setLocalStream] = useState(null);
   const microphone = useRef(null);
   const [camera, setCamera] = useState(false);
   const localVideoRef = useRef(null);
   const remoteVideoRef = useRef(null);
   const [remoteStream, setRemoteStream] = useState(null);
   const [peerConnection, setPeerConnection] = useState(null);
   const [popupMessage, setPopupMessage] = useState(null);
   const popupType = useRef(null);
   const [Audio, setAudio] = useState(true);
   const [Video, setVideo] = useState(true);
   const [popupQuestion, setPopupQuestion] = useState(true);
   const [question, setQuestion] = useState("Bạn có camera không?");
   const [isQuit, setIsQuit] = useState(false);
   const {
      isLoading,
      data: friendinfo,
      error: userError,
   } = useQuery(["user"], () =>
      makeRequest.get("/users/find/" + id).then((res) => {
         return res.data;
      })
   );
   const handleAnswerTheQuestion = (answer) => {
      if (question === "Bạn có camera không?") {
         if (answer) {
            setCamera(true);
         } else setCamera(false);
         setQuestion("Bạn có Micro không?");
      } else {
         if (answer) {
            microphone.current = true;
         } else microphone.current = false;
         navigator.mediaDevices
            .getUserMedia(
               camera
                  ? { video: true, audio: microphone.current }
                  : { audio: microphone.current }
            )
            .then((stream) => {
               setLocalStream(stream);
               if (localVideoRef.current) {
                  localVideoRef.current.srcObject = stream;
               }
            })
            .catch((error) => {
               alert(trl("Bạn đã không có cả 2 thiết bị"));
            });
         //Xử lý luồng
         const pc = new RTCPeerConnection();
         pc.onicecandidate = handleIceCandidate;
         pc.ontrack = handleTrack;
         setPeerConnection(pc);
         setPopupQuestion(false);
      }
   };

   const onCloseCallPopup = () => {
      if (popupType.current === "call") {
         //wsRef.current.send(JSON.stringify({ type: "cancel" }));
         if (ws) ws.close();
         setPopupType(null);
      } else if (popupType.current === "deny") {
         setPopupType(null);
      }
      SetCallingPopup(false);
      //ws.close();
   };
   const setPopupType = (PopupType) => {
      popupType.current = PopupType;
   };
   const handleDeny = (deny) => {
      if (popupType.current === "call") {
         if (wsRef.current) wsRef.current.close();
         setPopupType("deny");
         setPopupMessage(deny);
      }
   };
   const handleIceCandidate = (event) => {
      if (event.candidate && wsRef.current) {
         wsRef.current.send(
            JSON.stringify({ type: "candidate", candidate: event.candidate })
         );
      }
   };
   const handleTrack = (event) => {
      setRemoteStream(event.streams[0]);

      remoteVideoRef.current.srcObject = event.streams[0];
   };
   const handleOffer = async (offer) => {
      try {
         localStream
            .getTracks()
            .forEach((track) => peerConnection.addTrack(track, localStream));
      } catch (error) {
         console.error(error);
      }
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Gửi answer tới server
      if (wsRef.current) {
         await wsRef.current.send(
            JSON.stringify({ type: "answer", answer: answer })
         );
      }
   };

   const handleAnswer = async (answer) => {
      await peerConnection.setRemoteDescription(
         new RTCSessionDescription(answer)
      );
   };

   const handleCandidate = async (candidate) => {
      try {
         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
         if (popupType.current === "ready") {
            SetCallingPopup(false);
         }
      } catch (e) {
         console.error("Error adding received ice candidate", e);
      }
   };

   const handleCall = async (message) => {
      try {
         localStream
            .getTracks()
            .forEach((track) => peerConnection.addTrack(track, localStream));

         if (popupType.current === "call") {
            setPopupType("ready");
            setPopupMessage(message + " - Đang xử lý ...");
         }

         const offer = await peerConnection.createOffer();
         await peerConnection.setLocalDescription(offer);

         // Gửi offer đến server
         wsRef.current.send(JSON.stringify({ type: "offer", offer: offer }));
      } catch (error) {
         window.location.reload();
         console.error("Error during handleCall:", error);
      }
   };

   const handleHangUp = () => {
      setIsQuit(true);
      if (ws) {
         ws.close();
         setWs(null);
      }
      if (peerConnection) {
         peerConnection.close();
         setPeerConnection(null);
      }
      if (localStream) {
         localStream.getTracks().forEach((track) => track.stop());
         setLocalStream(null);
      }
      if (remoteStream) {
         remoteStream.getTracks().forEach((track) => track.stop());
         setRemoteStream(null);
      }
      SetCallingPopup(false);
      setPopupMessage("Cuộc gọi đã kết thúc");
      setPopupType("end");
   };

   const handleReady = () => {
      //Thiết lập websocket
      if (!ws) {
         const websocket = new WebSocket(`${WEBSOCKET_BACK_END}/call/${id}`);
         setWs(websocket);
         wsRef.current = websocket;
         websocket.onopen = () => {
            websocket.onmessage = (message) => {
               const data = JSON.parse(message.data);
               switch (data.type) {
                  case "ready":
                     handleCall(data.message);
                     break;
                  case "deny":
                     handleDeny(data.message);
                     break;
                  case "offer":
                     //console.log("Get offer");
                     handleOffer(data.offer);
                     break;
                  case "answer":
                     //console.log("Get answer");
                     handleAnswer(data.answer);
                     break;
                  case "candidate":
                     //console.log("Get candidate:", data.candidate);
                     handleCandidate(data.candidate);
                     break;
                  case "quit":
                     // Xử lý khi người dùng khác kết thúc cuộc gọi hoặc ngắt kết nối
                     setPopupMessage("Đối phương đã thoát");
                     setIsQuit(true);
                     setPopupType("quit");
                     SetCallingPopup(true);
                     wsRef.current.close();
                     break;
                  default:
                     // Handle other message types or errors
                     // console.log("Received an unknown message type:", data.type);

                     break;
               }
            };
            websocket.onclose = () => {
               wsRef.current = null;
               setWs(null);
               console.log("canceled");
            };

            console.log("Calling ...");
         };
      }
      makeRequest
         .post(`messages/call/${id}`)
         .then((res) => {
            setPopupMessage(res.data.message);
            setPopupType(res.data.type);

            SetCallingPopup(true);
         })
         .catch((e) => {
            console.error(e);
            if (ws) ws.close();
            setPopupMessage(e.response.data);
            setPopupType("fail");
            SetCallingPopup(true);
         });
   };
   const toggleCamera = () => {
      if (localStream) {
         const videoTrack = localStream.getVideoTracks()[0];
         if (videoTrack) {
            setVideo(!videoTrack.enabled);
            videoTrack.enabled = !videoTrack.enabled;
         }
      }
   };

   const toggleMicrophone = () => {
      if (localStream) {
         const audioTrack = localStream.getAudioTracks()[0];
         if (audioTrack) {
            setAudio(!audioTrack.enabled);
            audioTrack.enabled = !audioTrack.enabled;
         }
      }
   };

   return (
      <div className="video-call">
         <PopupWindow show={callPopup} handleClose={onCloseCallPopup}>
            <div className="popup-content">
               <h1>{popupMessage && trl(popupMessage)}</h1>
               {callPopup && popupType.current === "call" && (
                  <CountdownTimer
                     seconds={60}
                     handleTimeOut={onCloseCallPopup}
                  ></CountdownTimer>
               )}
            </div>
            <div className="button-box">
               <button onClick={onCloseCallPopup}>{trl("Cancel")}</button>
            </div>
         </PopupWindow>
         <PopupWindow show={popupQuestion}>
            <div className="popup-content">
               <h1>{question && trl(question)}</h1>
            </div>
            <div className="button-box">
               <button
                  onClick={() => {
                     handleAnswerTheQuestion(true);
                  }}
               >
                  {trl("Yes")}
               </button>
               <button
                  onClick={() => {
                     handleAnswerTheQuestion(false);
                  }}
               >
                  {trl("No")}
               </button>
            </div>
         </PopupWindow>
         <div className="video-container">
            <div className="local-video">
               <div className="userInfo">
                  <img
                     src={URL_OF_BACK_END + `users/profilePic/` + currentUser.id}
                     onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/upload/errorImage.png";
                     }}
                     alt={""}
                  />
                  <div className="details">
                     <span
                        className="name"
                        onClick={() => {
                           window.location.href = `/profile/${currentUser.id}`;
                        }}
                     >
                        {currentUser.name}
                     </span>
                  </div>
               </div>
               <video autoPlay ref={localVideoRef} muted></video>
            </div>
            <div className="remote-video">
               {userError ? (
                  <div className="userInfo"> {trl("Có lỗi xảy ra")}</div>
               ) : (
                  <div className="userInfo">
                     <img
                        src={URL_OF_BACK_END + `users/profilePic/` + id}
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = "/upload/errorImage.png";
                        }}
                        alt={""}
                     />
                     <div className="details">
                        <span
                           className="name"
                           onClick={() => {
                              window.location.href = `/profile/${id}`;
                           }}
                        >
                           {isLoading ? trl("Loading") + "..." : friendinfo?.name}
                        </span>
                     </div>
                  </div>
               )}
               <video autoPlay ref={remoteVideoRef}></video>
            </div>
         </div>
         <div className="control-panel">
            {camera && (
               <button className="control-button" onClick={toggleCamera}>
                  <FontAwesomeIcon icon={Video ? faEye : faEyeSlash} />
               </button>
            )}
            {microphone.current && (
               <button className="control-button" onClick={toggleMicrophone}>
                  <FontAwesomeIcon
                     icon={Audio ? faMicrophoneAlt : faMicrophoneAltSlash}
                  />
               </button>
            )}
         </div>
         {ws && <button onClick={handleHangUp}>{trl("Thoát")}</button>}
         {!ws && !isQuit && <button onClick={handleReady}>{trl("Gọi/Nghe")}</button>}
         {isQuit && <button onClick={() => window.close() }>{trl("Close")}</button>}
      </div>
   );
};

export default Call;
