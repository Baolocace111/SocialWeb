export const callingUser = new Map();
//const waitingCandidateList = new Map();
export const settingCallWebsocket = (ws, key) => {
  if (callingUser.has(key)) {
    ws.close();
    //console.log(callingUser.keys());
    return;
  }
  callingUser.set(key, ws);
  // if (waitingCandidateList.has(key)) {
  //   ws.send(
  //     JSON.stringify({
  //       type: "candidate",
  //       candidate: waitingCandidateList.get(key),
  //     })
  //   );
  //   waitingCandidateList.delete(key);
  // }
  //console.log(callingUser.keys());
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case "offer":
        const rvkey = reverseString(key);
        if (callingUser.has(rvkey)) {
          callingUser
            .get(rvkey)
            .send(JSON.stringify({ type: "offer", offer: data.offer }));
        }
        break;
      case "answer":
        // Handle answer: forward the answer to the other user
        const targetKey = reverseString(key);
        if (callingUser.has(targetKey)) {
          callingUser
            .get(targetKey)
            .send(JSON.stringify({ type: "answer", answer: data.answer }));
        }
        break;
      case "candidate":
        // Handle ICE candidate: forward the candidate to the other user
        const otherKey = reverseString(key);
        if (callingUser.has(otherKey)) {
          callingUser
            .get(otherKey)
            .send(
              JSON.stringify({ type: "candidate", candidate: data.candidate })
            );
        } else {
          //waitingCandidateList.set(otherKey, data.candidate);
        }
        break;
    }
  });
  ws.on("close", () => {
    if (callingUser.has(key)) {
      callingUser.delete(key);
    }
    const rvkey = reverseString(key);
    if (callingUser.has(rvkey)) {
      callingUser.get(rvkey).send(JSON.stringify({ type: "quit" }));
    }
    // if (waitingCandidateList.has(rvkey)) {
    //   waitingCandidateList.delete(rvkey);
    // }
  });
};
const reverseString = (input) => {
  // Tách chuỗi thành các phần con, sử dụng hàm split
  const parts = input.split("to");

  // Đảo ngược thứ tự của các phần con và kết hợp lại với chuỗi "to" giữa chúng
  return parts.reverse().join("to");
};
