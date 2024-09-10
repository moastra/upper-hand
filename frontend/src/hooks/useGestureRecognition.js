import { useEffect, useState, useRef, useCallback } from "react";
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

const useGestureRecognition = (videoRef, canvasRef) => {
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [gestureData, setGestureData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading gesture recognizer model:", error);
      }
    };

    loadModel();

    return () => {
      // Cleanup function to stop any ongoing tasks
      if (gestureRecognizer) {
        gestureRecognizer.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gestureRecognizer && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      let lastVideoTime = -1;

      const predict = async () => {
        const nowInMs = Date.now();

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            try {
              const results = await gestureRecognizer.recognizeForVideo(
                video,
                nowInMs
              );

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const drawingUtils = new DrawingUtils(ctx);

              if (results.landmarks) {
                for (const landmarks of results.landmarks) {
                  drawingUtils.drawConnectors(
                    landmarks,
                    GestureRecognizer.HAND_CONNECTIONS,
                    { color: "#00FF00", lineWidth: 5 }
                  );
                  drawingUtils.drawLandmarks(landmarks, {
                    color: "#FF0000",
                    lineWidth: 2,
                  });
                }
              }

              // const gestureOutput = document.getElementById("gesture_output");
              // if (gestureOutput) {
              if (results.gestures.length > 0) {
                const categoryName = results.gestures[0][0].categoryName;
                // const categoryScore = parseFloat(
                //   results.gestures[0][0].score * 100
                // ).toFixed(2);
                // const handedness = results.handednesses[0][0].displayName;
                // gestureOutput.innerText = `Gesture: ${categoryName}\nConfidence: ${categoryScore}%\nHandedness: ${handedness}`;
                // gestureOutput.style.display = "block";
                setGestureData(categoryName);
              }
              // else {
              //     gestureOutput.style.display = "none";
              //   }
              // }
            } catch (error) {
              console.error("Error recognizing gesture:", error);
            }
          }
          requestAnimationFrame(predict);
        } else {
          requestAnimationFrame(predict);
        }
      };

      predict();

      return () => {
        cancelAnimationFrame(predict);
      };
    }
  }, [gestureRecognizer, videoRef, canvasRef]);

  return { gestureData, isLoading };
};

export default useGestureRecognition;
