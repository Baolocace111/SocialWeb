import React, { useState, useEffect } from "react";
import "./countdowntimer.scss";

function CountdownTimer({ seconds, handleTimeOut }) {
  const [countdown, setCountdown] = useState(seconds);
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    const handleTimeOutCallback = () => {
      handleTimeOut();
    };

    if (isCounting && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setIsCounting(false);
      handleTimeOutCallback();
    }
  }, [countdown, isCounting, handleTimeOut]);

  return (
    <div className="countdowntimer">
      <div className="outer-circle"></div>
      <h1>{countdown}</h1>
    </div>
  );
}

export default CountdownTimer;
