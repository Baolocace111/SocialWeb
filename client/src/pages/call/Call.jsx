// App.js

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { WEBSOCKET_BACK_END } from "../../axios";
import PopupWindow from "../../components/PopupComponent/PopupWindow";
import { useCallback } from "react";
const Call = () => {
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
    //ws.close();
  };
  const handleIceCandidate = (event) => {
    console.log("icecadidate");
    if (event.candidate && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({ type: "candidate", candidate: event.candidate })
      );
    }
  };
  const handleTrack = (event) => {
    console.log("HandleTrack");
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
    } catch (e) {
      console.error("Error adding received ice candidate", e);
    }
  };

  const handleCall = async () => {
    try {
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Gửi offer đến server
      ws.send(JSON.stringify({ type: "offer", offer: offer }));
    } catch (error) {
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
            case "offer":
              console.log("Get offer");
              handleOffer(data.offer);
              break;
            case "answer":
              console.log("Get answer");
              handleAnswer(data.answer);
              break;
            case "candidate":
              console.log("Get candidate:", data.candidate);
              handleCandidate(data.candidate);
              break;
            case "quit":
              // Xử lý khi người dùng khác kết thúc cuộc gọi hoặc ngắt kết nối
              console.log("The other user has ended the call or disconnected.");
              break;
            default:
              // Handle other message types or errors
              console.log("Received an unknown message type:", data.type);
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
  };

  return (
    <div className="App">
      <h1>Video Call App</h1>
      <PopupWindow show={callPopup} handleClose={onCloseCallPopup}>
        <div>
          <h1>Calling ...</h1>
        </div>
        <div>
          <button onClick={onCloseCallPopup}>Cancel</button>
        </div>
      </PopupWindow>
      <div className="video-container">
        <div className="local-video">
          <h1>Your camera</h1>
          <video autoPlay ref={localVideoRef} muted></video>
        </div>
        <div className="remote-video">
          <h1>Your friend's camera</h1>
          <video autoPlay ref={remoteVideoRef}></video>
        </div>
      </div>
      <button onClick={handleCall}>Call</button>
      {!ws && <button onClick={handleReady}>Ready</button>}
    </div>
  );
};

export default Call;
