import { useState, useCallback } from "react";

// Define possible states
const MODES = {
  INITIALIZE: "INITIALIZE",
  READY: "READY",
  CLIENT_CONNECTED: "CLIENT_CONNECTED",
  CLIENT_READY: "CLIENT_READY",
  HOST_CONNECTED: "HOST_CONNECTED",
  HOST_READY: "HOST_READY",
  ROUND_START: "ROUND_START",
  ROUND_END: "ROUND_END",
  MATCH_END: "MATCH_END",
};

export default function useStageMode(initialMode = MODES.INITIALIZE) {
  const [mode, setMode] = useState(initialMode);

  const transitionTo = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  const handleInitialize = useCallback(() => {
    transitionTo(MODES.READY);
  }, [transitionTo]);

  const handleClientConnected = useCallback(() => {
    transitionTo(MODES.CLIENT_CONNECTED);
  }, [transitionTo]);

  const handleClientReady = useCallback(() => {
    transitionTo(MODES.CLIENT_READY);
  }, [transitionTo]);

  const handleHostConnected = useCallback(() => {
    transitionTo(MODES.HOST_CONNECTED);
  }, [transitionTo]);

  const handleHostReady = useCallback(() => {
    transitionTo(MODES.HOST_READY);
  }, [transitionTo]);

  const handleRoundStart = useCallback(() => {
    transitionTo(MODES.ROUND_START);
  }, [transitionTo]);

  const handleRoundEnd = useCallback(() => {
    transitionTo(MODES.ROUND_END);
  }, [transitionTo]);

  const handleMatchEnd = useCallback(() => {
    transitionTo(MODES.MATCH_END);
  }, [transitionTo]);

  return {
    mode,
    handleInitialize,
    handleClientConnected,
    handleClientReady,
    handleHostConnected,
    handleHostReady,
    handleRoundStart,
    handleRoundEnd,
    handleMatchEnd,
  };
}
