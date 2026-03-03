"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import MergeRoundedIcon from "@mui/icons-material/MergeRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeDownRoundedIcon from "@mui/icons-material/VolumeDownRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import SpeakerRoundedIcon from "@mui/icons-material/SpeakerRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import { getSocket } from "@/utils/socket";
import { trackCallAnomaly } from "@/utils/callAnomalyTracker";
import { resolveChatAssetUrl } from "@/utils/chatAssetUrl";

const Chat = ({ userID, contactPerson, messages, contactPersonId, contactPersonEmail, contactProfileImage = null, fromID, fromEmail, contactIsOnline = false, contactLastSeen = null, incomingCallOffer = null, onIncomingCallOfferConsumed, onCallOverlayChange, overlayOnlyMode = false, isMobile = false, onBack }) => {
    const FLOATING_CALL_CORNER_KEY = "whatsapp_floating_call_corner_v1";
    const DRAG_HINT_SEEN_KEY_PREFIX = "whatsapp_floating_call_drag_hint_seen_v1";
    const socket = getSocket();
    const chatContainerRef = useRef(null);
    const floatingCallPanelRef = useRef(null);
    const dragRef = useRef({
        pointerId: null,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        dragging: false,
    });
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const pendingCandidatesRef = useRef([]);
    const incomingOfferRef = useRef(null);
    const peerEmailRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const callPhaseRef = useRef("idle");
    const unmountingRef = useRef(false);
    const outgoingTimeoutRef = useRef(null);
    const disconnectedTimeoutRef = useRef(null);
    const handledOfferIdRef = useRef(null);
    const activeCallIdRef = useRef(null);
    const toneAudioContextRef = useRef(null);
    const outgoingRingIntervalRef = useRef(null);
    const incomingRingIntervalRef = useRef(null);
    const toneTimeoutsRef = useRef([]);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callType, setCallType] = useState("audio");
    const [callPhase, setCallPhase] = useState("idle");
    const [callPeerEmail, setCallPeerEmail] = useState(null);
    const [callStartedAt, setCallStartedAt] = useState(null);
    const [callMessage, setCallMessage] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Not connected");
    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [isOnHold, setIsOnHold] = useState(false);
    const [isRenegotiating, setIsRenegotiating] = useState(false);
    const [remoteOnHold, setRemoteOnHold] = useState(false);
    const [remoteMediaState, setRemoteMediaState] = useState({ micEnabled: true, cameraEnabled: true });
    const [audioLevelPreset, setAudioLevelPreset] = useState("normal");
    const [availableOutputDevices, setAvailableOutputDevices] = useState([]);
    const [selectedOutputDeviceId, setSelectedOutputDeviceId] = useState("default");
    const [outputMenuAnchorEl, setOutputMenuAnchorEl] = useState(null);
    const [isCallPanelCollapsed, setIsCallPanelCollapsed] = useState(false);
    const [floatingCallPosition, setFloatingCallPosition] = useState(null);
    const [showDragInstruction, setShowDragInstruction] = useState(false);

    const volumeByPreset = useMemo(
        () => ({
            mute: 0,
            low: 0.35,
            normal: 0.75,
            loud: 1,
        }),
        []
    );

    const RTC_ICE_SERVERS = useMemo(
        () => [
            { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
        ],
        []
    );

    const canCall = Boolean(contactPersonEmail && fromEmail && socket);
    const normalizedFromEmail = String(fromEmail || "").toLowerCase();
    const normalizedContactEmail = String(contactPersonEmail || "").toLowerCase();
    const dragHintSeenStorageKey = `${DRAG_HINT_SEEN_KEY_PREFIX}:${normalizedFromEmail || "anonymous"}`;

    const reportCallAnomaly = useCallback((code, message, details = null, severity = "warn") => {
        trackCallAnomaly({
            socket,
            code,
            message,
            severity,
            from: normalizedFromEmail,
            contact: normalizedContactEmail,
            callId: activeCallIdRef.current || null,
            details: {
                callPhase: callPhaseRef.current,
                ...(details && typeof details === "object" ? details : {}),
            },
        });
    }, [normalizedContactEmail, normalizedFromEmail, socket]);

    const formatDuration = (startAt) => {
        if (!startAt) return "00:00";
        const elapsed = Math.max(0, Math.floor((Date.now() - startAt) / 1000));
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
        const seconds = (elapsed % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const [callDurationLabel, setCallDurationLabel] = useState("00:00");

    useEffect(() => {
        callPhaseRef.current = callPhase;
    }, [callPhase]);

    useEffect(() => {
        if (!callStartedAt || callPhase !== "active") {
            setCallDurationLabel("00:00");
            return;
        }

        setCallDurationLabel(formatDuration(callStartedAt));
        const timer = setInterval(() => {
            setCallDurationLabel(formatDuration(callStartedAt));
        }, 1000);

        return () => clearInterval(timer);
    }, [callStartedAt, callPhase]);

    useEffect(() => {
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream || null;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream || null;
        }
    }, [remoteStream]);

    useEffect(() => {
        if (!remoteAudioRef.current) return;
        remoteAudioRef.current.srcObject = remoteStream || null;
        const shouldMuteRemoteAudio = Boolean(isOnHold || remoteOnHold || audioLevelPreset === "mute");
        remoteAudioRef.current.muted = shouldMuteRemoteAudio;
        remoteAudioRef.current.volume = volumeByPreset[audioLevelPreset] ?? 0.75;

        if (remoteStream) {
            const playPromise = remoteAudioRef.current.play?.();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
            }
        }
    }, [audioLevelPreset, isOnHold, remoteOnHold, remoteStream, callPhase, volumeByPreset]);

    useEffect(() => {
        const audioElement = remoteAudioRef.current;
        if (!audioElement) return;

        audioElement.volume = volumeByPreset[audioLevelPreset] ?? 0.75;
    }, [audioLevelPreset, volumeByPreset]);

    const stopStream = (stream) => {
        if (!stream) return;
        stream.getTracks().forEach((track) => track.stop());
    };

    const releaseMediaElements = useCallback(() => {
        const elements = [localVideoRef.current, remoteVideoRef.current, remoteAudioRef.current];

        elements.forEach((element) => {
            if (!element) return;

            const srcObject = element.srcObject;
            if (srcObject && typeof srcObject.getTracks === "function") {
                srcObject.getTracks().forEach((track) => {
                    try {
                        track.stop();
                    } catch {
                        // no-op
                    }
                });
            }

            try {
                element.pause?.();
            } catch {
                // no-op
            }

            element.srcObject = null;
        });
    }, []);

    const releaseToneAudioContext = useCallback(() => {
        if (!toneAudioContextRef.current) return;

        try {
            toneAudioContextRef.current.close?.().catch(() => {});
        } catch {
            // no-op
        }

        toneAudioContextRef.current = null;
    }, []);

    const clearToneTimeouts = useCallback(() => {
        toneTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        toneTimeoutsRef.current = [];
    }, []);

    const stopRingtones = useCallback(() => {
        clearToneTimeouts();

        if (outgoingRingIntervalRef.current) {
            clearInterval(outgoingRingIntervalRef.current);
            outgoingRingIntervalRef.current = null;
        }

        if (incomingRingIntervalRef.current) {
            clearInterval(incomingRingIntervalRef.current);
            incomingRingIntervalRef.current = null;
        }
    }, [clearToneTimeouts]);

    const ensureToneAudioContext = useCallback(async () => {
        if (typeof window === "undefined") return null;

        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return null;

        if (!toneAudioContextRef.current) {
            toneAudioContextRef.current = new AudioContextCtor();
        }

        if (toneAudioContextRef.current.state === "suspended") {
            try {
                await toneAudioContextRef.current.resume();
            } catch (error) {
                console.error("Unable to resume ringtone audio context", error);
            }
        }

        return toneAudioContextRef.current;
    }, []);

    const playTone = useCallback(async ({ frequency = 440, durationMs = 250, volume = 0.05, type = "sine", delayMs = 0 }) => {
        const ctx = await ensureToneAudioContext();
        if (!ctx) return;

        const startAt = ctx.currentTime + Math.max(0, delayMs) / 1000;
        const endAt = startAt + Math.max(0.08, durationMs / 1000);

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0.0001, startAt);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0001), startAt + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startAt);
        oscillator.stop(endAt + 0.03);
        oscillator.onended = () => {
            oscillator.disconnect();
            gainNode.disconnect();
        };
    }, [ensureToneAudioContext]);

    const playOutgoingRingbackPattern = useCallback(() => {
        // Natural PSTN-style ringback: 2s ON, 4s OFF using dual tones (440Hz + 480Hz)
        const pulseOffsets = [0, 400, 800, 1200, 1600];

        pulseOffsets.forEach((delayMs) => {
            playTone({ frequency: 440, durationMs: 320, volume: 0.04, type: "sine", delayMs });
            playTone({ frequency: 480, durationMs: 320, volume: 0.04, type: "sine", delayMs });
        });
    }, [playTone]);

    const playIncomingTeamsPattern = useCallback(() => {
        // Teams-like incoming melody (synthetic approximation)
        const sequence = [
            { delayMs: 0, frequency: 659 },
            { delayMs: 180, frequency: 784 },
            { delayMs: 360, frequency: 988 },
            { delayMs: 860, frequency: 659 },
            { delayMs: 1040, frequency: 784 },
            { delayMs: 1220, frequency: 988 },
        ];

        sequence.forEach(({ delayMs, frequency }) => {
            playTone({ frequency, durationMs: 150, volume: 0.05, type: "triangle", delayMs });
        });
    }, [playTone]);

    const startOutgoingRingback = useCallback(() => {
        if (outgoingRingIntervalRef.current || incomingRingIntervalRef.current) return;

        playOutgoingRingbackPattern();
        outgoingRingIntervalRef.current = setInterval(playOutgoingRingbackPattern, 6000);
    }, [playOutgoingRingbackPattern]);

    const startIncomingRingtone = useCallback(() => {
        if (incomingRingIntervalRef.current || outgoingRingIntervalRef.current) return;

        playIncomingTeamsPattern();
        incomingRingIntervalRef.current = setInterval(playIncomingTeamsPattern, 2200);
    }, [playIncomingTeamsPattern]);

    const refreshOutputDevices = useCallback(async () => {
        if (!navigator?.mediaDevices?.enumerateDevices) {
            setAvailableOutputDevices([]);
            return;
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const outputs = devices.filter((device) => device.kind === "audiooutput");
            setAvailableOutputDevices(outputs);
        } catch (error) {
            console.error("Unable to enumerate audio output devices", error);
        }
    }, []);

    const applyOutputDevice = useCallback(async (deviceId = "default") => {
        const audioElement = remoteAudioRef.current;
        if (!audioElement) return;

        const sinkIdSupported = typeof audioElement.setSinkId === "function";
        if (!sinkIdSupported) return;

        try {
            await audioElement.setSinkId(deviceId);
            setSelectedOutputDeviceId(deviceId);
            setCallMessage(deviceId === "default" ? "Audio output: default" : "Audio output switched");
        } catch (error) {
            console.error("Failed to set audio output device", error);
            setCallMessage("Unable to switch output device");
        }
    }, []);

    const cycleAudioLevelPreset = useCallback(() => {
        const order = ["mute", "low", "normal", "loud"];
        const currentIndex = order.indexOf(audioLevelPreset);
        const nextPreset = order[(currentIndex + 1) % order.length];
        setAudioLevelPreset(nextPreset);
    }, [audioLevelPreset]);

    useEffect(() => {
        if (callPhase === "incoming") {
            startIncomingRingtone();
            return;
        }

        if (callPhase === "outgoing") {
            startOutgoingRingback();
            return;
        }

        stopRingtones();
    }, [callPhase, startIncomingRingtone, startOutgoingRingback, stopRingtones]);

    useEffect(() => {
        if (callPhase === "active" || callPhase === "incoming" || callPhase === "outgoing" || callPhase === "connecting") {
            refreshOutputDevices();
        }
    }, [callPhase, refreshOutputDevices]);

    useEffect(() => {
        if (!isRenegotiating) return;
        setOutputMenuAnchorEl(null);
    }, [isRenegotiating]);

    const clearCallTimers = useCallback(() => {
        if (outgoingTimeoutRef.current) {
            clearTimeout(outgoingTimeoutRef.current);
            outgoingTimeoutRef.current = null;
        }

        if (disconnectedTimeoutRef.current) {
            clearTimeout(disconnectedTimeoutRef.current);
            disconnectedTimeoutRef.current = null;
        }
    }, []);

    const resetCallUi = useCallback((message = "") => {
        setCallPhase("idle");
        callPhaseRef.current = "idle";
        setCallStartedAt(null);
        setCallPeerEmail(null);
        setCallMessage(message);
        setConnectionStatus("Not connected");
        setMicEnabled(true);
        setCameraEnabled(false);
        setIsOnHold(false);
        setIsRenegotiating(false);
        setRemoteOnHold(false);
        setRemoteMediaState({ micEnabled: true, cameraEnabled: true });
        incomingOfferRef.current = null;
        peerEmailRef.current = null;
        activeCallIdRef.current = null;
        pendingCandidatesRef.current = [];
    }, []);

    const cleanupPeerConnection = useCallback(() => {
        const pc = peerConnectionRef.current;
        if (pc) {
            pc.onicecandidate = null;
            pc.ontrack = null;
            pc.oniceconnectionstatechange = null;
            pc.onconnectionstatechange = null;
            pc.close();
        }
        peerConnectionRef.current = null;
    }, []);

    const stopAllMedia = useCallback(() => {
        stopStream(localStreamRef.current);
        stopStream(remoteStreamRef.current);
        localStreamRef.current = null;
        remoteStreamRef.current = null;

        releaseMediaElements();

        setLocalStream(null);
        setRemoteStream(null);
    }, [releaseMediaElements]);

    const clearRemoteVideoOutput = useCallback(() => {
        const remote = remoteStreamRef.current;
        if (!remote) return;

        remote.getVideoTracks().forEach((track) => {
            remote.removeTrack(track);
        });

        const normalizedRemote = new MediaStream(remote.getTracks());
        remoteStreamRef.current = normalizedRemote;
        setRemoteStream(normalizedRemote.getTracks().length ? normalizedRemote : null);
    }, []);

    const mergeRemoteTracks = useCallback((incomingTracks = []) => {
        if (!incomingTracks.length) return;

        const targetStream = remoteStreamRef.current || new MediaStream();
        incomingTracks.forEach((track) => {
            if (!track) return;
            const hasTrack = targetStream.getTracks().some((existingTrack) => existingTrack.id === track.id);
            if (!hasTrack) {
                targetStream.addTrack(track);
            }
        });

        remoteStreamRef.current = targetStream;
        setRemoteStream(new MediaStream(targetStream.getTracks()));
    }, []);

    const finishCallLocally = useCallback((message = "") => {
        stopRingtones();
        clearCallTimers();
        cleanupPeerConnection();
        stopAllMedia();
        releaseToneAudioContext();
        resetCallUi(message);
    }, [cleanupPeerConnection, clearCallTimers, releaseToneAudioContext, resetCallUi, stopAllMedia, stopRingtones]);

    const getSenderByKind = useCallback((kind) => {
        const pc = peerConnectionRef.current;
        if (!pc) return null;
        return pc.getSenders().find((sender) => sender.track?.kind === kind) || null;
    }, []);

    const emitToPeer = useCallback((eventName, payload = {}) => {
        const socketPeerEmail = String(peerEmailRef.current || callPeerEmail || "").toLowerCase();
        const callId = String(activeCallIdRef.current || "").trim();
        if (!socket || !socketPeerEmail || !callId || !normalizedFromEmail) return;

        socket.emit(eventName, {
            callId,
            from: normalizedFromEmail,
            to: socketPeerEmail,
            ...payload,
        });
    }, [callPeerEmail, normalizedFromEmail, socket]);

    const syncLocalTrackState = useCallback((nextMicEnabled, nextCameraEnabled, nextOnHold, nextRemoteOnHold = remoteOnHold) => {
        const stream = localStreamRef.current;
        const pc = peerConnectionRef.current;

        const effectiveHold = Boolean(nextOnHold || nextRemoteOnHold);
        const effectiveMic = effectiveHold ? false : nextMicEnabled;
        const effectiveCamera = effectiveHold ? false : nextCameraEnabled;

        if (stream) {
            stream.getAudioTracks().forEach((track) => {
                track.enabled = effectiveMic;
            });
            stream.getVideoTracks().forEach((track) => {
                track.enabled = effectiveCamera;
            });
        }

        if (pc) {
            pc.getSenders().forEach((sender) => {
                if (!sender?.track) return;
                if (sender.track.kind === "audio") {
                    sender.track.enabled = effectiveMic;
                }
                if (sender.track.kind === "video") {
                    sender.track.enabled = effectiveCamera;
                }
            });
        }

        return {
            micEnabled: effectiveMic,
            cameraEnabled: effectiveCamera,
        };
    }, [remoteOnHold]);

    const sendMediaState = useCallback((nextMicEnabled, nextCameraEnabled) => {
        emitToPeer("call:media-state", {
            micEnabled: nextMicEnabled,
            cameraEnabled: nextCameraEnabled,
        });
    }, [emitToPeer]);

    useEffect(() => {
        if (callPhase === "idle") return;

        const effectiveState = syncLocalTrackState(micEnabled, cameraEnabled, isOnHold, remoteOnHold);
        const audioElement = remoteAudioRef.current;
        if (audioElement) {
            audioElement.muted = Boolean(isOnHold || remoteOnHold || audioLevelPreset === "mute");
        }

        if (effectiveState) {
            sendMediaState(effectiveState.micEnabled, effectiveState.cameraEnabled);
        }
    }, [audioLevelPreset, callPhase, cameraEnabled, isOnHold, micEnabled, remoteOnHold, sendMediaState, syncLocalTrackState]);

    const renegotiateConnection = useCallback(async (nextCallType) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        try {
            setIsRenegotiating(true);
            setCallMessage("Updating call...");

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            emitToPeer("call:offer", {
                phase: "renegotiate",
                callType: nextCallType || callType,
                sdp: offer,
            });
        } catch (error) {
            console.error("Failed to renegotiate call", error);
            setIsRenegotiating(false);
            setCallMessage("Unable to switch call mode");
            throw error;
        }
    }, [callType, emitToPeer]);

    const createPeerConnection = useCallback((peerEmail) => {
        const pc = new RTCPeerConnection({ iceServers: RTC_ICE_SERVERS });
        peerEmailRef.current = peerEmail;

        pc.onicecandidate = (event) => {
            if (!event.candidate || !socket) return;
            socket.emit("call:ice-candidate", {
                callId: activeCallIdRef.current,
                from: normalizedFromEmail,
                to: peerEmail,
                candidate: event.candidate,
            });
        };

        pc.ontrack = (event) => {
            const streamTracks = event.streams?.[0]?.getTracks?.() || [];
            const tracksToMerge = streamTracks.length ? streamTracks : [event.track];
            mergeRemoteTracks(tracksToMerge);
        };

        pc.oniceconnectionstatechange = () => {
            const iceState = pc.iceConnectionState;
            if (iceState === "connected" || iceState === "completed") {
                if (disconnectedTimeoutRef.current) {
                    clearTimeout(disconnectedTimeoutRef.current);
                    disconnectedTimeoutRef.current = null;
                }

                if (callPhaseRef.current !== "active") {
                    clearCallTimers();
                    setConnectionStatus("Connected");
                    setCallPhase("active");
                    setCallStartedAt((prev) => prev || Date.now());
                    setCallMessage("");
                }
                return;
            }

            if (iceState === "disconnected") {
                setConnectionStatus("Reconnecting");
                try {
                    if (typeof pc.restartIce === "function") {
                        pc.restartIce();
                    }
                } catch (error) {
                    console.error("ICE restart failed", error);
                }
            } else if (iceState === "failed" || iceState === "closed") {
                finishCallLocally("Call ended");
            }
        };

        pc.onconnectionstatechange = () => {
            const state = pc.connectionState;
            if (state === "connected") {
                setConnectionStatus("Connected");
            } else if (state === "disconnected") {
                setConnectionStatus("Reconnecting");
            } else if (state === "connecting" || state === "new") {
                setConnectionStatus("Connecting");
            } else {
                setConnectionStatus("Not connected");
            }

            if (pc.connectionState === "connected") {
                clearCallTimers();
                setCallPhase("active");
                setCallStartedAt((prev) => prev || Date.now());
                setCallMessage("");
                return;
            }

            if (pc.connectionState === "disconnected") {
                if (disconnectedTimeoutRef.current) return;
                disconnectedTimeoutRef.current = setTimeout(() => {
                    disconnectedTimeoutRef.current = null;
                    if (["disconnected", "failed"].includes(pc.connectionState)) {
                        finishCallLocally("Call disconnected");
                    }
                }, 15000);
                return;
            }

            if (["failed", "closed"].includes(pc.connectionState)) {
                if (pc.connectionState === "failed") {
                    if (disconnectedTimeoutRef.current) return;
                    disconnectedTimeoutRef.current = setTimeout(() => {
                        disconnectedTimeoutRef.current = null;
                        if (pc.connectionState === "failed") {
                            finishCallLocally("Call ended");
                        }
                    }, 5000);
                    return;
                }
                finishCallLocally("Call ended");
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [RTC_ICE_SERVERS, finishCallLocally, mergeRemoteTracks, normalizedFromEmail, socket]);

    const getMediaForCall = async (type) => {
        if (!navigator?.mediaDevices?.getUserMedia) {
            throw new Error("Media devices are not available in this browser context");
        }
        const constraints = {
            audio: true,
            video: type === "video",
        };
        return navigator.mediaDevices.getUserMedia(constraints);
    };

    const startOutgoingCall = useCallback(async (type) => {
        if (!canCall || !socket) return;
        if (callPhase !== "idle") return;

        const peerEmail = normalizedContactEmail;
        if (!peerEmail) return;
        const callId = `${normalizedFromEmail}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        activeCallIdRef.current = callId;

        try {
            setCallType(type);
            setCallPhase("outgoing");
            setCallPeerEmail(peerEmail);
            setCallMessage("Ringing...");
            setConnectionStatus("Connecting");
            setMicEnabled(true);
            setCameraEnabled(type === "video");

            const mediaStream = await getMediaForCall(type);
            localStreamRef.current = mediaStream;
            setLocalStream(mediaStream);

            const pc = createPeerConnection(peerEmail);
            mediaStream.getTracks().forEach((track) => pc.addTrack(track, mediaStream));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("call:offer", {
                callId,
                phase: "invite",
                from: normalizedFromEmail,
                to: peerEmail,
                callType: type,
                sdp: offer,
            });

            clearCallTimers();
            outgoingTimeoutRef.current = setTimeout(() => {
                if (callPhaseRef.current === "outgoing" || callPhaseRef.current === "connecting") {
                    if (socket && peerEmailRef.current && normalizedFromEmail) {
                        socket.emit("call:end", {
                            callId: activeCallIdRef.current,
                            from: normalizedFromEmail,
                            to: peerEmailRef.current,
                        });
                    }
                    finishCallLocally("No answer");
                }
            }, 30000);
        } catch (error) {
            console.error("Failed to start call", error);
            finishCallLocally("Unable to start call");
        }
    }, [callPhase, canCall, clearCallTimers, createPeerConnection, finishCallLocally, normalizedContactEmail, normalizedFromEmail, socket]);

    const endCurrentCall = useCallback((notifyPeer = true) => {
        setCallPhase("idle");
        callPhaseRef.current = "idle";
        const peerEmail = peerEmailRef.current || callPeerEmail;
        const callId = activeCallIdRef.current;
        if (notifyPeer && socket && peerEmail && normalizedFromEmail && callId) {
            socket.emit("call:end", {
                callId,
                from: normalizedFromEmail,
                to: peerEmail,
            });
        }
        finishCallLocally("");
    }, [callPeerEmail, finishCallLocally, normalizedFromEmail, socket]);

    const rejectIncomingCall = useCallback(() => {
        const incoming = incomingOfferRef.current;
        stopRingtones();
        if (socket && incoming?.from && normalizedFromEmail && incoming?.callId) {
            socket.emit("call:reject", {
                callId: incoming.callId,
                from: normalizedFromEmail,
                to: String(incoming.from).toLowerCase(),
            });
        }
        finishCallLocally("");
    }, [finishCallLocally, normalizedFromEmail, socket, stopRingtones]);

    const acceptIncomingCall = useCallback(async () => {
        const incoming = incomingOfferRef.current;
        if (!incoming || !socket) return;

        stopRingtones();

        const peerEmail = String(incoming.from || "").toLowerCase();
        if (!peerEmail || !incoming.callId) return;
        activeCallIdRef.current = incoming.callId;

        try {
            setCallType(incoming.callType === "video" ? "video" : "audio");
            setCallPhase("connecting");
            setCallPeerEmail(peerEmail);
            setCallMessage("Connecting...");
            setConnectionStatus("Connecting");
            setMicEnabled(true);
            setCameraEnabled(incoming.callType === "video");

            const mediaStream = await getMediaForCall(incoming.callType === "video" ? "video" : "audio");
            localStreamRef.current = mediaStream;
            setLocalStream(mediaStream);

            const pc = createPeerConnection(peerEmail);
            mediaStream.getTracks().forEach((track) => pc.addTrack(track, mediaStream));

            await pc.setRemoteDescription(new RTCSessionDescription(incoming.sdp));
            for (const candidate of pendingCandidatesRef.current) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error("Failed to apply pending ICE candidate", error);
                }
            }
            pendingCandidatesRef.current = [];

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit("call:answer", {
                callId: incoming.callId,
                from: normalizedFromEmail,
                to: peerEmail,
                sdp: answer,
            });
        } catch (error) {
            console.error("Failed to accept call", error);
            finishCallLocally("Unable to connect call");
        }
    }, [createPeerConnection, finishCallLocally, normalizedFromEmail, socket, stopRingtones]);

    useEffect(() => {
        if (!incomingCallOffer?.id || !socket || !normalizedFromEmail) return;
        if (handledOfferIdRef.current === incomingCallOffer.id) return;

        handledOfferIdRef.current = incomingCallOffer.id;

        const to = String(incomingCallOffer.to || "").toLowerCase();
        const from = String(incomingCallOffer.from || "").toLowerCase();
        const callId = String(incomingCallOffer.callId || "").trim();
        if (!to || !from || !callId || to !== normalizedFromEmail) {
            reportCallAnomaly("incoming-offer-invalid-in-chat", "Incoming offer ignored in chat panel", {
                hasTo: Boolean(to),
                hasFrom: Boolean(from),
                hasCallId: Boolean(callId),
                expectedTo: normalizedFromEmail,
                actualTo: to,
            });
            if (typeof onIncomingCallOfferConsumed === "function") {
                onIncomingCallOfferConsumed();
            }
            return;
        }

        if (callPhaseRef.current !== "idle") {
            socket.emit("call:reject", {
                callId,
                from: normalizedFromEmail,
                to: from,
                reason: "busy",
            });

            if (typeof onIncomingCallOfferConsumed === "function") {
                onIncomingCallOfferConsumed();
            }
            return;
        }

        incomingOfferRef.current = {
            from,
            callType: incomingCallOffer.callType === "video" ? "video" : "audio",
            sdp: incomingCallOffer.sdp,
            callId,
        };
        peerEmailRef.current = from;
        activeCallIdRef.current = callId;
        setCallType(incomingCallOffer.callType === "video" ? "video" : "audio");
        setCallPeerEmail(from);
        setCallPhase("incoming");
        setCallMessage(`${from} is calling`);
        setConnectionStatus("Not connected");

        if (typeof onIncomingCallOfferConsumed === "function") {
            onIncomingCallOfferConsumed();
        }
    }, [incomingCallOffer, normalizedFromEmail, onIncomingCallOfferConsumed, socket]);

    useEffect(() => {
        if (!socket || !normalizedFromEmail) return;

        const onAnswer = async (payload = {}) => {
            const to = String(payload.to || "").toLowerCase();
            const from = String(payload.from || "").toLowerCase();
            const callId = String(payload.callId || "").trim();
            const pc = peerConnectionRef.current;
            if (!pc || !payload?.sdp) return;

            if (to === normalizedFromEmail && from === peerEmailRef.current && (!callId || callId !== activeCallIdRef.current)) {
                reportCallAnomaly("answer-callid-mismatch", "Received call answer with mismatched call id", {
                    receivedCallId: callId || null,
                    activeCallId: activeCallIdRef.current || null,
                });
            }

            if (to !== normalizedFromEmail || from !== peerEmailRef.current) return;
            if (!callId || callId !== activeCallIdRef.current) return;

            try {
                stopRingtones();
                await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
                for (const candidate of pendingCandidatesRef.current) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
                pendingCandidatesRef.current = [];
                clearCallTimers();

                if (callPhaseRef.current !== "active") {
                    setCallPhase("connecting");
                    setCallMessage("Connecting...");
                } else {
                    setCallPhase("active");
                    setCallMessage("");
                }
                setIsRenegotiating(false);
            } catch (error) {
                console.error("Failed to apply call answer", error);
                reportCallAnomaly("apply-answer-failed", "Failed to apply remote answer", {
                    error: error?.message || String(error),
                }, "error");
                setIsRenegotiating(false);
                finishCallLocally("Call failed");
            }
        };

        const onIceCandidate = async (payload = {}) => {
            const to = String(payload.to || "").toLowerCase();
            const from = String(payload.from || "").toLowerCase();
            const callId = String(payload.callId || "").trim();
            const candidate = payload?.candidate;
            if (!candidate || to !== normalizedFromEmail) return;
            if (!callId || callId !== activeCallIdRef.current) return;

            const activePeer = peerEmailRef.current;
            if (activePeer && from !== activePeer) return;

            const pc = peerConnectionRef.current;
            if (!pc || !pc.remoteDescription) {
                pendingCandidatesRef.current.push(candidate);
                return;
            }

            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error("Failed to add ICE candidate", error);
                reportCallAnomaly("add-ice-failed", "Failed to add ICE candidate", {
                    error: error?.message || String(error),
                }, "warn");
            }
        };

        const onReject = (payload = {}) => {
            const to = String(payload.to || "").toLowerCase();
            const from = String(payload.from || "").toLowerCase();
            const callId = String(payload.callId || "").trim();
            if (to !== normalizedFromEmail || from !== peerEmailRef.current) return;
            if (!callId || callId !== activeCallIdRef.current) return;
            const reason = String(payload.reason || "declined").toLowerCase();
            finishCallLocally(reason === "busy" ? "User is busy on another call" : "Call declined");
        };

        const onEnd = (payload = {}) => {
            const to = String(payload.to || "").toLowerCase();
            const from = String(payload.from || "").toLowerCase();
            const callId = String(payload.callId || "").trim();
            if (to !== normalizedFromEmail || from !== peerEmailRef.current) return;
            if (!callId || callId !== activeCallIdRef.current) return;
            finishCallLocally("Call ended");
        };

        socket.on("call:answer", onAnswer);
        socket.on("call:ice-candidate", onIceCandidate);
        socket.on("call:reject", onReject);
        socket.on("call:end", onEnd);
        const onUnavailable = (payload = {}) => {
            const callId = String(payload.callId || "").trim();
            const to = String(payload.to || "").toLowerCase();
            if (to !== String(peerEmailRef.current || "").toLowerCase()) return;
            if (!callId || callId !== activeCallIdRef.current) return;
            finishCallLocally("User is offline");
        };

        const onBusy = (payload = {}) => {
            const callId = String(payload.callId || "").trim();
            if (!callId || callId !== activeCallIdRef.current) return;
            finishCallLocally("User is engaged on another call");
        };

        const onHold = (payload = {}) => {
            const to = String(payload.to || "").toLowerCase();
            const from = String(payload.from || "").toLowerCase();
            const callId = String(payload.callId || "").trim();
            if (to !== normalizedFromEmail || from !== peerEmailRef.current) return;
            if (!callId || callId !== activeCallIdRef.current) return;

            const nextOnHold = Boolean(payload.onHold);
            setRemoteOnHold(nextOnHold);

            const effectiveState = syncLocalTrackState(micEnabled, cameraEnabled, isOnHold, nextOnHold);
            if (effectiveState) {
                sendMediaState(effectiveState.micEnabled, effectiveState.cameraEnabled);
            }

            if (nextOnHold) {
                setCallMessage("Peer has put call on hold");
            } else if (callPhaseRef.current === "active") {
                setCallMessage("");
            }
        };

        const onMediaState = (payload = {}) => {
            const to = String(payload.to || "").toLowerCase();
            const from = String(payload.from || "").toLowerCase();
            const callId = String(payload.callId || "").trim();
            if (to !== normalizedFromEmail || from !== peerEmailRef.current) return;
            if (!callId || callId !== activeCallIdRef.current) return;

            setRemoteMediaState({
                micEnabled: payload.micEnabled !== false,
                cameraEnabled: payload.cameraEnabled !== false,
            });
        };

        const onOffer = async (payload = {}) => {
            const to = String(payload.to || "").toLowerCase();
            const from = String(payload.from || "").toLowerCase();
            const callId = String(payload.callId || "").trim();
            const phase = payload.phase === "renegotiate" ? "renegotiate" : "invite";
            if (phase !== "renegotiate" || !payload?.sdp) return;
            if (to !== normalizedFromEmail || from !== peerEmailRef.current) return;
            if (!callId || callId !== activeCallIdRef.current) return;

            const renegotiatedType = payload.callType === "video" ? "video" : "audio";
            setCallType(renegotiatedType);

            const pc = peerConnectionRef.current;
            if (!pc) return;

            try {
                setIsRenegotiating(true);
                const localStream = localStreamRef.current;

                if (renegotiatedType === "video") {
                    const hasLiveLocalVideo = Boolean(
                        localStream?.getVideoTracks()?.some((track) => track.readyState === "live")
                    );

                    // Do not auto-enable peer camera when the other side upgrades to video.
                    // Keep current local camera state unless this user explicitly enables camera.
                    setCameraEnabled(hasLiveLocalVideo);
                } else {
                    if (localStream) {
                        localStream.getVideoTracks().forEach((track) => {
                            track.stop();
                            localStream.removeTrack(track);
                        });

                        const videoSender = pc.getSenders().find((sender) => sender.track?.kind === "video");
                        if (videoSender) {
                            try {
                                await videoSender.replaceTrack(null);
                            } catch (error) {
                                console.error("Failed to remove local video sender", error);
                            }
                        }

                        const normalizedLocalStream = new MediaStream(localStream.getTracks());
                        localStreamRef.current = normalizedLocalStream;
                        setLocalStream(normalizedLocalStream);
                    }

                    clearRemoteVideoOutput();
                    setCameraEnabled(false);
                }

                await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));

                for (const candidate of pendingCandidatesRef.current) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
                pendingCandidatesRef.current = [];

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                emitToPeer("call:answer", { sdp: answer });
                setCallMessage("");
                setIsRenegotiating(false);
            } catch (error) {
                console.error("Failed renegotiation handling", error);
                reportCallAnomaly("renegotiation-handler-failed", "Failed to handle renegotiation offer", {
                    error: error?.message || String(error),
                    renegotiatedType,
                }, "error");
                setIsRenegotiating(false);
            }
        };

        socket.on("call:offer", onOffer);
        socket.on("call:unavailable", onUnavailable);
        socket.on("call:busy", onBusy);
        socket.on("call:hold", onHold);
        socket.on("call:media-state", onMediaState);

        return () => {
            socket.off("call:offer", onOffer);
            socket.off("call:answer", onAnswer);
            socket.off("call:ice-candidate", onIceCandidate);
            socket.off("call:reject", onReject);
            socket.off("call:end", onEnd);
            socket.off("call:unavailable", onUnavailable);
            socket.off("call:busy", onBusy);
            socket.off("call:hold", onHold);
            socket.off("call:media-state", onMediaState);
        };
    }, [cameraEnabled, clearCallTimers, clearRemoteVideoOutput, emitToPeer, finishCallLocally, isOnHold, micEnabled, normalizedFromEmail, reportCallAnomaly, sendMediaState, socket, stopRingtones, syncLocalTrackState]);

    useEffect(() => {
        return () => {
            unmountingRef.current = true;
            stopRingtones();
            clearCallTimers();
            cleanupPeerConnection();
            stopAllMedia();
            releaseToneAudioContext();
        };
    }, [clearCallTimers, cleanupPeerConnection, releaseToneAudioContext, stopAllMedia, stopRingtones]);

    useEffect(() => {
        const releaseOnExit = () => {
            const peerEmail = String(peerEmailRef.current || callPeerEmail || "").toLowerCase();
            const callId = String(activeCallIdRef.current || "").trim();

            if (callId || peerEmail) {
                reportCallAnomaly(
                    "forced-exit-cleanup",
                    "Triggered forced page-exit call cleanup",
                    {
                        reason: "pagehide-or-beforeunload",
                        hasPeerEmail: Boolean(peerEmail),
                        hasCallId: Boolean(callId),
                    },
                    "warn"
                );
            }

            if (socket && normalizedFromEmail && peerEmail && callId) {
                socket.emit("call:end", {
                    callId,
                    from: normalizedFromEmail,
                    to: peerEmail,
                });
            }

            stopRingtones();
            clearCallTimers();
            cleanupPeerConnection();
            stopAllMedia();
            releaseToneAudioContext();
        };

        window.addEventListener("pagehide", releaseOnExit);
        window.addEventListener("beforeunload", releaseOnExit);

        return () => {
            window.removeEventListener("pagehide", releaseOnExit);
            window.removeEventListener("beforeunload", releaseOnExit);
        };
    }, [callPeerEmail, clearCallTimers, cleanupPeerConnection, normalizedFromEmail, releaseToneAudioContext, reportCallAnomaly, socket, stopAllMedia, stopRingtones]);

    const toggleMic = useCallback(() => {
        if (callPhaseRef.current !== "active" || isRenegotiating) return;
        const nextMicEnabled = !micEnabled;
        setMicEnabled(nextMicEnabled);
        syncLocalTrackState(nextMicEnabled, cameraEnabled, isOnHold);
        sendMediaState(nextMicEnabled, cameraEnabled);
    }, [cameraEnabled, isOnHold, isRenegotiating, micEnabled, sendMediaState, syncLocalTrackState]);

    const toggleCamera = useCallback(async () => {
        if (callPhaseRef.current !== "active" || isRenegotiating) return;

        if (callType === "audio") {
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                const videoTrack = videoStream.getVideoTracks()[0];
                if (!videoTrack) return;

                const localStream = localStreamRef.current || new MediaStream();
                localStream.addTrack(videoTrack);
                const normalizedLocalStream = new MediaStream(localStream.getTracks());
                localStreamRef.current = normalizedLocalStream;
                setLocalStream(normalizedLocalStream);

                const pc = peerConnectionRef.current;
                if (!pc) return;
                const existingSender = getSenderByKind("video");
                if (existingSender) {
                    await existingSender.replaceTrack(videoTrack);
                } else {
                    pc.addTrack(videoTrack, normalizedLocalStream);
                }

                setCallType("video");
                setCameraEnabled(true);
                syncLocalTrackState(micEnabled, true, isOnHold);
                sendMediaState(micEnabled, true);
                await renegotiateConnection("video");
            } catch (error) {
                console.error("Failed to enable video", error);
                reportCallAnomaly("enable-video-failed", "Unable to enable video during active call", {
                    error: error?.message || String(error),
                }, "warn");
                setCallMessage("Unable to access camera");
            }
            return;
        }

        const nextCameraEnabled = !cameraEnabled;

        if (nextCameraEnabled) {
            const localStream = localStreamRef.current;
            const hasLiveLocalVideo = Boolean(
                localStream?.getVideoTracks()?.some((track) => track.readyState === "live")
            );

            if (!hasLiveLocalVideo) {
                try {
                    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    const videoTrack = videoStream.getVideoTracks()[0];
                    if (!videoTrack) return;

                    const activeLocalStream = localStream || new MediaStream();
                    const existingVideoTracks = activeLocalStream.getVideoTracks();
                    existingVideoTracks.forEach((track) => {
                        track.stop();
                        activeLocalStream.removeTrack(track);
                    });

                    activeLocalStream.addTrack(videoTrack);

                    const normalizedLocalStream = new MediaStream(activeLocalStream.getTracks());
                    localStreamRef.current = normalizedLocalStream;
                    setLocalStream(normalizedLocalStream);

                    const pc = peerConnectionRef.current;
                    if (!pc) return;

                    const existingSender = getSenderByKind("video");
                    if (existingSender) {
                        await existingSender.replaceTrack(videoTrack);
                    } else {
                        pc.addTrack(videoTrack, normalizedLocalStream);
                    }

                    setCameraEnabled(true);
                    syncLocalTrackState(micEnabled, true, isOnHold);
                    sendMediaState(micEnabled, true);
                    await renegotiateConnection("video");
                    return;
                } catch (error) {
                    console.error("Failed to enable local camera", error);
                    reportCallAnomaly("enable-local-camera-failed", "Failed to enable local camera", {
                        error: error?.message || String(error),
                    }, "warn");
                    setCallMessage("Unable to access camera");
                    return;
                }
            }
        }

        setCameraEnabled(nextCameraEnabled);
        syncLocalTrackState(micEnabled, nextCameraEnabled, isOnHold);
        sendMediaState(micEnabled, nextCameraEnabled);
    }, [callType, cameraEnabled, getSenderByKind, isOnHold, isRenegotiating, micEnabled, renegotiateConnection, reportCallAnomaly, sendMediaState, syncLocalTrackState]);

    const switchCallMode = useCallback(async () => {
        if (callPhaseRef.current !== "active" || isRenegotiating) return;
        const pc = peerConnectionRef.current;
        if (!pc) return;

        if (callType === "video") {
            const videoSender = getSenderByKind("video");
            const localStream = localStreamRef.current;
            if (videoSender) {
                try {
                    await videoSender.replaceTrack(null);
                } catch (error) {
                    console.error("Failed to detach video sender", error);
                    reportCallAnomaly("detach-video-sender-failed", "Failed to detach video sender while switching to audio", {
                        error: error?.message || String(error),
                    }, "warn");
                }
            }

            if (localStream) {
                localStream.getVideoTracks().forEach((track) => {
                    track.stop();
                    localStream.removeTrack(track);
                });
                const normalizedLocalStream = new MediaStream(localStream.getTracks());
                localStreamRef.current = normalizedLocalStream;
                setLocalStream(normalizedLocalStream);
            }

            clearRemoteVideoOutput();
            setCallType("audio");
            setCameraEnabled(false);
            sendMediaState(micEnabled, false);
            await renegotiateConnection("audio");
            return;
        }

        try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            const videoTrack = videoStream.getVideoTracks()[0];
            if (!videoTrack) return;

            const localStream = localStreamRef.current || new MediaStream();
            localStream.addTrack(videoTrack);
            const normalizedLocalStream = new MediaStream(localStream.getTracks());
            localStreamRef.current = normalizedLocalStream;
            setLocalStream(normalizedLocalStream);

            const existingVideoSender = getSenderByKind("video");
            if (existingVideoSender) {
                await existingVideoSender.replaceTrack(videoTrack);
            } else {
                pc.addTrack(videoTrack, normalizedLocalStream);
            }

            setCallType("video");
            setCameraEnabled(true);
            syncLocalTrackState(micEnabled, true, isOnHold);
            sendMediaState(micEnabled, true);
            await renegotiateConnection("video");
        } catch (error) {
            console.error("Failed to switch to video", error);
            reportCallAnomaly("switch-to-video-failed", "Failed to switch call mode to video", {
                error: error?.message || String(error),
            }, "warn");
            setCallMessage("Unable to switch to video");
        }
    }, [callType, clearRemoteVideoOutput, getSenderByKind, isOnHold, isRenegotiating, micEnabled, renegotiateConnection, reportCallAnomaly, sendMediaState, syncLocalTrackState]);

    const toggleHold = useCallback(() => {
        if (callPhaseRef.current !== "active" || isRenegotiating) return;
        const nextHold = !isOnHold;
        setIsOnHold(nextHold);
        const effectiveState = syncLocalTrackState(micEnabled, cameraEnabled, nextHold, remoteOnHold);
        if (effectiveState) {
            sendMediaState(effectiveState.micEnabled, effectiveState.cameraEnabled);
        }
        emitToPeer("call:hold", { onHold: nextHold });
        setCallMessage(nextHold ? "Call on hold" : "");
    }, [cameraEnabled, emitToPeer, isOnHold, isRenegotiating, micEnabled, remoteOnHold, sendMediaState, syncLocalTrackState]);

    const mergeCalls = useCallback(() => {
        setCallMessage("Merge calls requires group calling backend support.");
    }, []);

    const canMergeCalls = Boolean(
        callPhase === "active" &&
        incomingCallOffer?.from &&
        String(incomingCallOffer.from).toLowerCase() !== String(peerEmailRef.current || "").toLowerCase()
    );

    const showCallOverlay = callPhase !== "idle";
    const isIncomingOverlay = callPhase === "incoming";
    const showFloatingCallPanel = showCallOverlay && !isIncomingOverlay;

    useEffect(() => {
        if (typeof onCallOverlayChange !== "function") return;
        onCallOverlayChange(showCallOverlay);

        return () => {
            onCallOverlayChange(false);
        };
    }, [onCallOverlayChange, showCallOverlay]);

    const getFloatingMargins = useCallback(() => {
        return {
            horizontal: isMobile ? 8 : 16,
            verticalBottom: isMobile ? 86 : 14,
            verticalTop: isMobile ? 8 : 14,
        };
    }, [isMobile]);

    const getPanelSize = useCallback(() => {
        const panelNode = floatingCallPanelRef.current;
        if (panelNode) {
            const rect = panelNode.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                return { width: rect.width, height: rect.height };
            }
        }

        return {
            width: isMobile ? Math.max(280, window.innerWidth - 16) : 390,
            height: isCallPanelCollapsed ? 84 : (isMobile ? Math.min(520, Math.round(window.innerHeight * 0.5)) : 480),
        };
    }, [isCallPanelCollapsed, isMobile]);

    const getDefaultFloatingPosition = useCallback(() => {
        const containerNode = chatContainerRef.current;
        if (!containerNode || typeof window === "undefined") return null;

        const bounds = containerNode.getBoundingClientRect();
        const panel = getPanelSize();
        const margins = getFloatingMargins();

        const minX = margins.horizontal;
        const maxX = Math.max(minX, bounds.width - panel.width - margins.horizontal);
        const minY = margins.verticalTop;
        const maxY = Math.max(minY, bounds.height - panel.height - margins.verticalBottom);

        return { x: maxX, y: maxY };
    }, [getFloatingMargins, getPanelSize]);

    const clampFloatingPosition = useCallback((position) => {
        const containerNode = chatContainerRef.current;
        if (!containerNode || !position) return position;

        const bounds = containerNode.getBoundingClientRect();
        const panel = getPanelSize();
        const margins = getFloatingMargins();

        const minX = margins.horizontal;
        const maxX = Math.max(minX, bounds.width - panel.width - margins.horizontal);
        const minY = margins.verticalTop;
        const maxY = Math.max(minY, bounds.height - panel.height - margins.verticalBottom);

        return {
            x: Math.min(maxX, Math.max(minX, position.x)),
            y: Math.min(maxY, Math.max(minY, position.y)),
        };
    }, [getFloatingMargins, getPanelSize]);

    const snapToNearestCorner = useCallback((position) => {
        const containerNode = chatContainerRef.current;
        if (!containerNode || !position) return position;

        const bounds = containerNode.getBoundingClientRect();
        const panel = getPanelSize();
        const margins = getFloatingMargins();

        const minX = margins.horizontal;
        const maxX = Math.max(minX, bounds.width - panel.width - margins.horizontal);
        const minY = margins.verticalTop;
        const maxY = Math.max(minY, bounds.height - panel.height - margins.verticalBottom);

        const corners = [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: minX, y: maxY },
            { x: maxX, y: maxY },
        ];

        let nearest = corners[0];
        let nearestDist = Number.POSITIVE_INFINITY;

        for (const corner of corners) {
            const dx = corner.x - position.x;
            const dy = corner.y - position.y;
            const dist = dx * dx + dy * dy;
            if (dist < nearestDist) {
                nearest = corner;
                nearestDist = dist;
            }
        }

        return nearest;
    }, [getFloatingMargins, getPanelSize]);

    const getRememberedCorner = useCallback(() => {
        if (typeof window === "undefined") return null;

        try {
            const raw = window.localStorage.getItem(FLOATING_CALL_CORNER_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") return null;

            const x = Number(parsed.x);
            const y = Number(parsed.y);
            if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

            return { x, y };
        } catch {
            return null;
        }
    }, [FLOATING_CALL_CORNER_KEY]);

    const rememberCorner = useCallback((position) => {
        if (typeof window === "undefined" || !position) return;

        try {
            window.localStorage.setItem(FLOATING_CALL_CORNER_KEY, JSON.stringify({ x: position.x, y: position.y }));
        } catch {
            // Best-effort persistence only.
        }
    }, [FLOATING_CALL_CORNER_KEY]);

    const resetRememberedCorner = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.removeItem(FLOATING_CALL_CORNER_KEY);
        } catch {
            // Best-effort reset only.
        }
    }, [FLOATING_CALL_CORNER_KEY]);

    const resetFloatingCallPanelPosition = useCallback(() => {
        resetRememberedCorner();
        const fallbackPosition = getDefaultFloatingPosition();
        if (!fallbackPosition) return;

        const clamped = clampFloatingPosition(fallbackPosition);
        setFloatingCallPosition(clamped);
    }, [clampFloatingPosition, getDefaultFloatingPosition, resetRememberedCorner]);

    const handleFloatingPanelPointerDown = useCallback((event) => {
        if (!showFloatingCallPanel) return;
        if (event.button !== 0) return;

        const panelNode = floatingCallPanelRef.current;
        if (!panelNode) return;

        const nextPosition = floatingCallPosition || getDefaultFloatingPosition();
        if (!nextPosition) return;

        setFloatingCallPosition(nextPosition);
        setShowDragInstruction(false);
        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            originX: nextPosition.x,
            originY: nextPosition.y,
            dragging: true,
        };

        panelNode.setPointerCapture?.(event.pointerId);
        event.preventDefault();
    }, [floatingCallPosition, getDefaultFloatingPosition, showFloatingCallPanel]);

    const handleFloatingPanelPointerMove = useCallback((event) => {
        const dragState = dragRef.current;
        if (!dragState.dragging || dragState.pointerId !== event.pointerId) return;

        const nextPosition = {
            x: dragState.originX + (event.clientX - dragState.startX),
            y: dragState.originY + (event.clientY - dragState.startY),
        };

        setFloatingCallPosition(clampFloatingPosition(nextPosition));
    }, [clampFloatingPosition]);

    const finishFloatingDrag = useCallback((event) => {
        const dragState = dragRef.current;
        if (!dragState.dragging || dragState.pointerId !== event.pointerId) return;

        const panelNode = floatingCallPanelRef.current;
        panelNode?.releasePointerCapture?.(event.pointerId);

        dragRef.current.dragging = false;
        dragRef.current.pointerId = null;

        setFloatingCallPosition((prev) => {
            if (!prev) return prev;
            const clamped = clampFloatingPosition(prev);
            rememberCorner(clamped);
            return clamped;
        });
    }, [clampFloatingPosition, rememberCorner]);
    const hasRemoteVideo = useMemo(() => {
        const stream = remoteStreamRef.current || remoteStream;
        if (!stream) return false;
        return stream.getVideoTracks().some((track) => track.readyState === "live");
    }, [remoteStream]);

    useEffect(() => {
        if (callPhase === "idle") {
            setIsCallPanelCollapsed(false);
            setFloatingCallPosition(null);
            return;
        }

        if (callPhase === "incoming") {
            setIsCallPanelCollapsed(false);
            setFloatingCallPosition(null);
        }
    }, [callPhase]);

    useEffect(() => {
        if (!showFloatingCallPanel) return;

        setFloatingCallPosition((prev) => {
            if (!prev) {
                const remembered = getRememberedCorner();
                if (remembered) {
                    return clampFloatingPosition(remembered);
                }
                return getDefaultFloatingPosition();
            }
            return clampFloatingPosition(prev);
        });
    }, [clampFloatingPosition, getDefaultFloatingPosition, getRememberedCorner, isCallPanelCollapsed, showFloatingCallPanel]);

    useEffect(() => {
        if (!showFloatingCallPanel) return;

        const onResize = () => {
            setFloatingCallPosition((prev) => {
                if (!prev) return getDefaultFloatingPosition();
                return clampFloatingPosition(prev);
            });
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [clampFloatingPosition, getDefaultFloatingPosition, showFloatingCallPanel]);

    useEffect(() => {
        if (!showFloatingCallPanel) {
            setShowDragInstruction(false);
            return;
        }

        let alreadySeen = false;
        try {
            alreadySeen = typeof window !== "undefined" && window.localStorage.getItem(dragHintSeenStorageKey) === "1";
        } catch {
            alreadySeen = false;
        }

        if (alreadySeen) {
            setShowDragInstruction(false);
            return;
        }

        setShowDragInstruction(true);
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(dragHintSeenStorageKey, "1");
            }
        } catch {
            // no-op
        }

        const timer = setTimeout(() => {
            setShowDragInstruction(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [showFloatingCallPanel, callPhase, dragHintSeenStorageKey]);

    const hasLocalVideo = useMemo(() => {
        const stream = localStreamRef.current || localStream;
        if (!stream) return false;
        return stream.getVideoTracks().some((track) => track.readyState === "live");
    }, [localStream]);

    const callTitle = useMemo(() => {
        if (callPhase === "incoming") return `${callType === "video" ? "Video" : "Voice"} call incoming`;
        if (callPhase === "outgoing") return `${callType === "video" ? "Video" : "Voice"} calling...`;
        if (callPhase === "connecting") return "Connecting call...";
        if (callPhase === "active") return callType === "video" ? "Video call" : "Voice call";
        return "";
    }, [callPhase, callType]);

    const outputMenuOpen = Boolean(outputMenuAnchorEl);
    const disableInCallControls = callPhase !== "active" || isRenegotiating;
    const volumeControlLabel =
        audioLevelPreset === "mute"
            ? "Muted"
            : audioLevelPreset === "low"
                ? "Low"
                : audioLevelPreset === "loud"
                    ? "Loud"
                    : "Normal";

    const volumeControlIcon =
        audioLevelPreset === "mute" ? <VolumeOffRoundedIcon /> : audioLevelPreset === "low" ? <VolumeDownRoundedIcon /> : <VolumeUpRoundedIcon />;

    return (<>

        <Box
            ref={chatContainerRef}
            display='flex'
            width={overlayOnlyMode ? 0 : (isMobile ? '100%' : { sm: '58%', md: '64%', lg: '70%', xl: '74%' })}
            height='100dvh'
            sx={{
                minHeight: 0,
                flex: overlayOnlyMode ? 0 : 1,
                position: overlayOnlyMode ? 'fixed' : 'relative',
                inset: overlayOnlyMode ? 0 : 'auto',
                zIndex: overlayOnlyMode ? 1200 : 'auto',
                pointerEvents: overlayOnlyMode ? 'none' : 'auto',
            }}
        >
            <Box
                component='audio'
                ref={remoteAudioRef}
                autoPlay
                playsInline
                sx={{ display: 'none' }}
            />
            {!overlayOnlyMode ? (
                <Box display='flex' width='100%' flexDirection='column' sx={{ minHeight: 0 }}>
                    {contactPersonEmail ? (
                        <>
                            <ChatHeader
                                contactPerson={contactPerson}
                                userID={userID}
                                avatarSrc={contactProfileImage}
                                isOnline={contactIsOnline}
                                lastSeen={contactLastSeen}
                                showBack={isMobile}
                                onBack={onBack}
                                canCall={canCall}
                                onStartAudioCall={() => startOutgoingCall("audio")}
                                onStartVideoCall={() => startOutgoingCall("video")}
                            />
                            <ChatMessageList
                                userID={userID}
                                contactPerson={contactPerson}
                                messages={messages}
                                contactPersonId={contactPersonId}
                                contactPersonEmail={contactPersonEmail}
                                fromID={fromID}
                                fromEmail={fromEmail}
                            />
                        </>
                    ) : (
                        <Box
                            sx={{
                                width: '100%',
                                flex: 1,
                                minHeight: 0,
                                backgroundImage: "url('/whatsappbg.png')",
                                backgroundRepeat: 'repeat',
                                backgroundSize: 'auto',
                                backgroundPosition: 'center',
                            }}
                        />
                    )}
                </Box>
            ) : null}

            {showCallOverlay ? (
                <Box
                    ref={floatingCallPanelRef}
                    onPointerMove={showFloatingCallPanel ? handleFloatingPanelPointerMove : undefined}
                    onPointerUp={showFloatingCallPanel ? finishFloatingDrag : undefined}
                    onPointerCancel={showFloatingCallPanel ? finishFloatingDrag : undefined}
                    sx={{
                        position: 'absolute',
                        ...(isIncomingOverlay
                            ? { inset: 0 }
                            : {
                                left: floatingCallPosition ? floatingCallPosition.x : undefined,
                                top: floatingCallPosition ? floatingCallPosition.y : undefined,
                                width: { xs: 'calc(100% - 16px)', sm: 360, md: 390 },
                                height: isCallPanelCollapsed ? 84 : { xs: '50vh', sm: 430, md: 480 },
                                maxHeight: 'calc(100% - 100px)',
                                borderRadius: 2,
                                border: '1px solid #2f3133',
                                boxShadow: '0 14px 36px rgba(0,0,0,0.48)',
                                overflow: 'hidden',
                            }),
                        zIndex: overlayOnlyMode ? 1210 : 30,
                        backgroundColor: '#0f1011',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: isIncomingOverlay ? { xs: 2, md: 3 } : { xs: 1, md: 1.2 },
                        pointerEvents: 'auto',
                    }}
                >
                    {showFloatingCallPanel ? (
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                px: 0.4,
                                pt: 0.2,
                                cursor: 'grab',
                                touchAction: 'none',
                            }}
                            onPointerDown={handleFloatingPanelPointerDown}
                        >
                            <Box>
                                <Typography sx={{ color: '#c8cbce', fontSize: 12, fontWeight: 600 }}>
                                    In call • {callPhase === 'active' ? callDurationLabel : callTitle}
                                </Typography>
                                {showDragInstruction ? (
                                    <Typography
                                        sx={{
                                            color: '#90caf9',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: 0.3,
                                            mt: 0.1,
                                            '@keyframes dragHintPulse': {
                                                '0%': { opacity: 0.45, transform: 'translateX(0px)' },
                                                '35%': { opacity: 1, transform: 'translateX(3px)' },
                                                '70%': { opacity: 0.65, transform: 'translateX(-2px)' },
                                                '100%': { opacity: 0.45, transform: 'translateX(0px)' },
                                            },
                                            animation: 'dragHintPulse 1.1s ease-in-out infinite',
                                        }}
                                    >
                                        Drag to move panel
                                    </Typography>
                                ) : null}
                            </Box>
                            <Box display='flex' alignItems='center' gap={0.3}>
                                <IconButton
                                    onClick={resetFloatingCallPanelPosition}
                                    onPointerDown={(event) => event.stopPropagation()}
                                    sx={{ color: '#e5e5e5', width: 28, height: 28 }}
                                >
                                    <RestartAltRoundedIcon fontSize='small' />
                                </IconButton>
                                <IconButton
                                    onClick={() => setIsCallPanelCollapsed((prev) => !prev)}
                                    onPointerDown={(event) => event.stopPropagation()}
                                    sx={{ color: '#e5e5e5', width: 28, height: 28 }}
                                >
                                    {isCallPanelCollapsed ? <ExpandMoreRoundedIcon fontSize='small' /> : <ExpandLessRoundedIcon fontSize='small' />}
                                </IconButton>
                            </Box>
                        </Box>
                    ) : null}

                    <Box textAlign='center' mt={showFloatingCallPanel ? 0.25 : 1}>
                        <Typography sx={{ color: '#fff', fontSize: { xs: 20, md: 24 }, fontWeight: 700 }}>
                            {callPeerEmail || contactPerson || 'Call'}
                        </Typography>
                        <Typography sx={{ color: '#bfbfbf', fontSize: { xs: 13, md: 15 }, mt: 0.5 }}>
                            {callPhase === 'active' ? callDurationLabel : callTitle}
                        </Typography>
                        {callMessage ? (
                            <Typography sx={{ color: '#8f8f8f', fontSize: { xs: 12, md: 13 }, mt: 0.5 }}>
                                {callMessage}
                            </Typography>
                        ) : null}
                        <Typography
                            sx={{
                                color: connectionStatus === 'Connected' ? '#21c063' : '#bfbfbf',
                                fontSize: { xs: 12, md: 13 },
                                mt: 0.4,
                                fontWeight: 600,
                            }}
                        >
                            {connectionStatus}
                        </Typography>
                        {(isOnHold || remoteOnHold) ? (
                            <Typography sx={{ color: '#ffd54f', fontSize: { xs: 11, md: 12 }, mt: 0.5, fontWeight: 600 }}>
                                {isOnHold ? 'You are on hold' : 'Peer is on hold'}
                            </Typography>
                        ) : null}
                        {isRenegotiating ? (
                            <Typography sx={{ color: '#90caf9', fontSize: { xs: 11, md: 12 }, mt: 0.35, fontWeight: 600 }}>
                                Updating media settings...
                            </Typography>
                        ) : null}
                        <Typography sx={{ color: '#9ea3a6', fontSize: { xs: 11, md: 12 }, mt: 0.2 }}>
                            Peer Mic: {remoteMediaState.micEnabled ? 'On' : 'Off'} • Peer Video: {remoteMediaState.cameraEnabled ? 'On' : 'Off'}
                        </Typography>
                    </Box>

                    {!isCallPanelCollapsed ? (
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                flex: 1,
                                mt: showFloatingCallPanel ? 0.8 : 2,
                                mb: showFloatingCallPanel ? 0.8 : 2,
                                borderRadius: 3,
                                overflow: 'hidden',
                                backgroundColor: '#1b1d1f',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {hasRemoteVideo && remoteStream ? (
                                <Box
                                    component='video'
                                    ref={remoteVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Avatar
                                    alt={contactPerson || callPeerEmail || 'Caller'}
                                    src={resolveChatAssetUrl(contactProfileImage)}
                                    sx={{ width: { xs: 92, md: 120 }, height: { xs: 92, md: 120 } }}
                                />
                            )}

                            {hasLocalVideo && localStream ? (
                                <Box
                                    component='video'
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    sx={{
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 10,
                                        width: { xs: 84, md: 110 },
                                        height: { xs: 114, md: 140 },
                                        borderRadius: 2,
                                        objectFit: 'cover',
                                        backgroundColor: '#000',
                                        border: '1px solid #3a3a3a',
                                    }}
                                />
                            ) : null}
                        </Box>
                    ) : null}

                    <Box display='flex' alignItems='center' gap={1.25} mb={1.2} flexWrap='wrap' justifyContent='center'>
                        {callPhase === 'incoming' ? (
                            <>
                                <IconButton
                                    onClick={rejectIncomingCall}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        backgroundColor: '#d32f2f',
                                        color: '#fff',
                                        '&:hover': { backgroundColor: '#b12828' },
                                    }}
                                >
                                    <CallEndRoundedIcon />
                                </IconButton>
                                <IconButton
                                    onClick={acceptIncomingCall}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        backgroundColor: '#21c063',
                                        color: '#fff',
                                        '&:hover': { backgroundColor: '#1aa955' },
                                    }}
                                >
                                    <CallRoundedIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Tooltip title={micEnabled ? 'Mute mic' : 'Unmute mic'}>
                                    <IconButton
                                        onClick={toggleMic}
                                        disabled={disableInCallControls}
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            backgroundColor: '#2b2d2f',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#3a3d40' },
                                            '&.Mui-disabled': { opacity: 0.45, color: '#b0b0b0' },
                                        }}
                                    >
                                        {micEnabled ? <MicRoundedIcon /> : <MicOffRoundedIcon />}
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={callType === 'video' ? (cameraEnabled ? 'Turn video off' : 'Turn video on') : 'Enable video'}>
                                    <IconButton
                                        onClick={toggleCamera}
                                        disabled={disableInCallControls}
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            backgroundColor: '#2b2d2f',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#3a3d40' },
                                            '&.Mui-disabled': { opacity: 0.45, color: '#b0b0b0' },
                                        }}
                                    >
                                        {(callType === 'video' && cameraEnabled) ? <VideocamRoundedIcon /> : <VideocamOffRoundedIcon />}
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={callType === 'video' ? 'Switch to voice call' : 'Switch to video call'}>
                                    <IconButton
                                        onClick={switchCallMode}
                                        disabled={disableInCallControls}
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            backgroundColor: '#2b2d2f',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#3a3d40' },
                                            '&.Mui-disabled': { opacity: 0.45, color: '#b0b0b0' },
                                        }}
                                    >
                                        <SwapHorizRoundedIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={isOnHold ? 'Resume call' : 'Hold call'}>
                                    <IconButton
                                        onClick={toggleHold}
                                        disabled={disableInCallControls}
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            backgroundColor: isOnHold ? '#6d4c41' : '#2b2d2f',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: isOnHold ? '#795548' : '#3a3d40' },
                                            '&.Mui-disabled': { opacity: 0.45, color: '#b0b0b0' },
                                        }}
                                    >
                                        {isOnHold ? <PlayCircleRoundedIcon /> : <PauseCircleRoundedIcon />}
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={`Voice level: ${volumeControlLabel}`}>
                                    <IconButton
                                        onClick={cycleAudioLevelPreset}
                                        disabled={disableInCallControls}
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            backgroundColor: '#2b2d2f',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#3a3d40' },
                                            '&.Mui-disabled': { opacity: 0.45, color: '#b0b0b0' },
                                        }}
                                    >
                                        {volumeControlIcon}
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title='Output device'>
                                    <IconButton
                                        onClick={(event) => setOutputMenuAnchorEl(event.currentTarget)}
                                        disabled={disableInCallControls}
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            backgroundColor: '#2b2d2f',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#3a3d40' },
                                            '&.Mui-disabled': { opacity: 0.45, color: '#b0b0b0' },
                                        }}
                                    >
                                        <SpeakerRoundedIcon />
                                    </IconButton>
                                </Tooltip>

                                <Menu
                                    anchorEl={outputMenuAnchorEl}
                                    open={outputMenuOpen}
                                    onClose={() => setOutputMenuAnchorEl(null)}
                                    PaperProps={{
                                        sx: {
                                            backgroundColor: '#1f2123',
                                            color: '#fff',
                                            minWidth: 250,
                                        },
                                    }}
                                >
                                    <MenuItem
                                        selected={selectedOutputDeviceId === 'default'}
                                        onClick={async () => {
                                            await applyOutputDevice('default');
                                            setOutputMenuAnchorEl(null);
                                        }}
                                    >
                                        System default
                                    </MenuItem>

                                    {availableOutputDevices.length > 0 ? (
                                        availableOutputDevices.map((device, index) => (
                                            <MenuItem
                                                key={device.deviceId || `output-${index}`}
                                                selected={selectedOutputDeviceId === device.deviceId}
                                                onClick={async () => {
                                                    await applyOutputDevice(device.deviceId);
                                                    setOutputMenuAnchorEl(null);
                                                }}
                                            >
                                                {device.label || `Output ${index + 1}`}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>
                                            No extra outputs detected
                                        </MenuItem>
                                    )}
                                </Menu>

                                <Tooltip title={canMergeCalls ? 'Merge calls' : 'No call available to merge'}>
                                    <IconButton
                                        onClick={mergeCalls}
                                        disabled={!canMergeCalls}
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            backgroundColor: '#2b2d2f',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#3a3d40' },
                                            '&.Mui-disabled': {
                                                opacity: 0.45,
                                                color: '#9a9a9a',
                                            },
                                        }}
                                    >
                                        <MergeRoundedIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title='End call'>
                                    <IconButton
                                        onClick={() => endCurrentCall(true)}
                                        sx={{
                                            width: 58,
                                            height: 58,
                                            backgroundColor: '#d32f2f',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#b12828' },
                                        }}
                                    >
                                        <CallEndRoundedIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                </Box>
            ) : null}
        </Box>
    </>);
}
export default Chat;