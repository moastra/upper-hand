import React, { useEffect, useState } from "react";
import Host from "./Host"; // Adjust the path according to your file structure
import Client from "./Client"; // Adjust the path according to your file structure
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision"; // Ensure to import necessary dependencies
import useStageMode from "./hooks/useStageMode";

function Video2() {
  const {
    mode,
    handleInitialize,
    handleClientConnected,
    handleClientReady,
    handleRoundStart,
    handleRoundEnd,
    handleMatchEnd,
  } = useStageMode();

  const [gestureRecognizer, setGestureRecognizer] = useState(null);

  useEffect(() => {
    if (mode === "INITIALIZE") {
      const loadModel = async () => {
        try {
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
          );
          const recognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
          });
          setGestureRecognizer(recognizer);
          handleInitialize();
        } catch (error) {
          console.error("Error loading gesture recognizer model:", error);
        }
      };
      loadModel();
    }
  }, [mode, handleInitialize]);

  return (
    <div className="App">
      <Host />
      <Client />
    </div>
  );
}

export default Video2;
