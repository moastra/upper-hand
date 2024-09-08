import { useEffect, useState, useRef } from "react";

const useCountdown = (isActive, onEnd) => {
  const [countdown, setCountdown] = useState(3);
  const hasStarted = useRef(false);
  useEffect(() => {
    let countdownInterval;
    console.log("line 8 useCountdown");
    if (isActive) {
      if (!hasStarted.current) {
        setCountdown(3); // Reset countdown to 3 when isActive becomes true
        hasStarted.current = true;
      }
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            onEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // If countdown is not active, reset the `hasStarted` flag
      hasStarted.current = false;
    }

    return () => clearInterval(countdownInterval);
  }, [isActive]);

  return countdown;
};

export default useCountdown;