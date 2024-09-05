import { useEffect, useState } from "react";

export default useCountdown = (initialCount, onEnd) => {
  const [countdown, setCountdown] = useState(initialCount);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let countdownInterval;

    if (isActive) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setIsActive(false);
            onEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [isActive]);

  return { countdown, isActive, setIsActive };
};
