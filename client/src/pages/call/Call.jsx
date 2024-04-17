// App.js

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { WEBSOCKET_BACK_END, makeRequest } from "../../axios";
import PopupWindow from "../../components/PopupComponent/PopupWindow";
import "./call.scss";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import { useLanguage } from "../../context/languageContext";

const Call = () => {
  const { trl } = useLanguage();
  const { RTCPeerConnection, RTCSessionDescription } = window;
  const { id } = useParams();
  const [ws, setWs] = useState(null);
  const wsRef = useRef(null);
  const [callPopup, SetCallingPopup] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const popupType = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Error accessing media devices.", error));
    //Xử lý luồng
    const pc = new RTCPeerConnection();
    pc.onicecandidate = handleIceCandidate;
    pc.ontrack = handleTrack;
    setPeerConnection(pc);
  }, []);
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

  return (
    <div className="video-call">
      <PopupWindow show={callPopup} handleClose={onCloseCallPopup}>
        <div className="popup-content">
          <h1>{popupMessage && popupMessage}</h1>
          {callPopup && popupType.current === "call" && (
            <CountdownTimer
              seconds={60}
              handleTimeOut={onCloseCallPopup}
            ></CountdownTimer>
          )}
        </div>
        <div>
          <button onClick={onCloseCallPopup}>Cancel</button>
        </div>
      </PopupWindow>
      <div className="video-container">
        <div className="local-video">
          <video autoPlay ref={localVideoRef} muted></video>
        </div>
        <div className="remote-video">
          <video autoPlay ref={remoteVideoRef}></video>
        </div>
      </div>

      {!ws && <button onClick={handleReady}>Ready</button>}
    </div>
  );
};

export default Call;
