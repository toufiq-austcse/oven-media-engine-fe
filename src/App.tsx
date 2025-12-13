import {useEffect, useRef, useState} from 'react';
import './App.css';
import axios from 'axios';

const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_PORT = import.meta.env.VITE_API_PORT;

// Declare OvenLiveKit global type
declare global {
    interface Window {
        OvenLiveKit: {
            create: () => OvenLiveKitInstance;
        };
    }
}

interface OvenLiveKitInstance {
    attachMedia: (element: HTMLVideoElement) => void;
    getUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
    startStreaming: (endpoint: string, options?: { httpHeaders?: Record<string, string> }) => Promise<void>;
    stopStreaming: () => void;
}

function App() {
    const [isStreaming, setIsStreaming] = useState(false);
    const [isRtmpStreaming, setIsRtmpStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [whipEndpoint, setWhipEndpoint] = useState(import.meta.env.VITE_WHIP_ENDPOINT || 'http://188.166.217.2:3333/app/stream?direction=whip');
    const [rtmpEndpoint, setRtmpEndpoint] = useState(import.meta.env.VITE_RTMP_ENDPOINT || 'rtmp://188.166.217.2:1935/app/stream');
    const videoRef = useRef<HTMLVideoElement>(null);
    const ovenLiveKitRef = useRef<OvenLiveKitInstance | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);


    useEffect(() => {
        // Initialize OvenLiveKit when component mounts
        if (window.OvenLiveKit && videoRef.current) {
            ovenLiveKitRef.current = window.OvenLiveKit.create();
            ovenLiveKitRef.current.attachMedia(videoRef.current);
        }

        return () => {
            // Cleanup on unmount
            if (ovenLiveKitRef.current && isStreaming) {
                ovenLiveKitRef.current.stopStreaming();
            }
        };
    }, []);

    const startStream = async () => {
        try {
            setError(null);

            if (!ovenLiveKitRef.current) {
                throw new Error('OvenLiveKit not initialized');
            }

            // Get user media (camera and microphone)
            const stream = await ovenLiveKitRef.current.getUserMedia({
                audio: true,
                video: {
                    width: {ideal: 1280},
                    height: {ideal: 720},
                    aspectRatio: {ideal: 16 / 9}
                }
            });

            mediaStreamRef.current = stream;

            // Start streaming to OvenMediaEngine via WHIP
            await ovenLiveKitRef.current.startStreaming(whipEndpoint, {
                httpHeaders: {
                    'Authorization': AUTH_TOKEN
                }
            });

            setIsStreaming(true);
        } catch (err) {
            console.error('Error starting stream:', err);
            setError(err instanceof Error ? err.message : 'Failed to start streaming');
        }
    };

    const stopStream = () => {
        try {
            if (ovenLiveKitRef.current) {
                ovenLiveKitRef.current.stopStreaming();
            }
            setIsStreaming(false);
            setError(null);
        } catch (err) {
            console.error('Error stopping stream:', err);
            setError(err instanceof Error ? err.message : 'Failed to stop streaming');
        }
    };

    const startRtmpStream = async () => {
        try {
            const apiUrl = API_BASE_URL.replace(/:\d+$/, `:${API_PORT}`);
            const response = await axios.post(`${apiUrl}/v1/vhosts/default/apps/app:startPush`, {
                "id": "push_2",
                "stream": {
                    "name": "stream_rtmp"
                },
                "protocol": "rtmp",
                "url": rtmpEndpoint
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                }
            })
            setIsRtmpStreaming(true)
            console.log('RTMP push started:', response.data);
        } catch (e) {
            console.error('Error starting RTMP stream:', e);
            setError(e instanceof Error ? e.message : 'Failed to start RTMP streaming');
            alert('Failed to start RTMP streaming. Please check the console for details.');
            return;

        }
    };

    const stopRtmpStream = async () => {
        try {
            const apiUrl = API_BASE_URL.replace(/:\d+$/, `:${API_PORT}`);
            const response = await axios.post(`${apiUrl}/v1/vhosts/default/apps/app:stopPush`, {
                    "id": "push_2"
                }
                , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AUTH_TOKEN
                    }
                })

            setIsRtmpStreaming(false)
            console.log('RTMP push started:', response.data);
        } catch (err) {
            console.error('Error stopping RTMP stream:', err);
            setError(err instanceof Error ? err.message : 'Failed to stop RTMP streaming');
        }
    };

    return (
        <>
            <h1>OvenMediaEngine Streaming Demo</h1>

            <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
                <p>Your user device Stream (local)</p>

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    controls
                    style={{
                        width: '100%',
                        maxWidth: '640px',
                        height: 'auto',
                        backgroundColor: '#000',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}
                />

                <div style={{marginBottom: '20px'}}>
                    <label htmlFor="whip-endpoint" style={{display: 'block', marginBottom: '5px'}}>
                        WHIP Endpoint:
                    </label>
                    <input
                        id="whip-endpoint"
                        type="text"
                        value={whipEndpoint}
                        onChange={(e) => setWhipEndpoint(e.target.value)}
                        disabled={isStreaming}
                        style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{marginBottom: '20px'}}>
                    <label htmlFor="rtmp-endpoint" style={{display: 'block', marginBottom: '5px'}}>
                        RTMP URL:
                    </label>
                    <input
                        id="rtmp-endpoint"
                        type="text"
                        value={rtmpEndpoint}
                        onChange={(e) => setRtmpEndpoint(e.target.value)}
                        disabled={isRtmpStreaming}
                        placeholder="rtmp://your-server:1935/app/stream"
                        style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px'}}>
                    {!isStreaming ? (
                        <button
                            onClick={startStream}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Join Meeting
                        </button>
                    ) : (
                        <button
                            onClick={stopStream}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Leave Meeting
                        </button>
                    )}

                    {!isRtmpStreaming ? (
                        <button
                            onClick={startRtmpStream}
                            disabled={!isStreaming}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: isStreaming ? '#2196F3' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isStreaming ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Push to RTMP
                        </button>
                    ) : (
                        <button
                            onClick={stopRtmpStream}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#FF9800',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Stop RTMP Push
                        </button>
                    )}
                </div>

                {error && (
                    <div style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        borderRadius: '4px'
                    }}>
                        Error: {error}
                    </div>
                )}

                {isStreaming && (
                    <div style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: '4px'
                    }}>
                        ✓ Streaming to OvenMediaEngine
                    </div>
                )}

                {isRtmpStreaming && (
                    <div style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        borderRadius: '4px'
                    }}>
                        ✓ Pushing to RTMP: {rtmpEndpoint}
                    </div>
                )}

                <p style={{marginTop: '20px'}}>
                    Check playback at{' '}
                    <a
                        href="https://demo.ovenplayer.com/#sources=%5B%7B%22id%22%3A0%2C%22label%22%3Anull%2C%22file%22%3A%22wss%3A%2F%2Fdev2.airensoft.com%3A3333%2Fovenspace%2Ftest_stream%22%2C%22type%22%3A%22webrtc%22%7D%5D&lowLatency=false&liveDelay=false"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{color: '#1976d2'}}
                    >
                        OvenPlayer Demo
                    </a>
                </p>
            </div>
        </>
    );
}

export default App

