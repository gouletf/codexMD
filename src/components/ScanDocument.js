import React, {
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react";

import { uploadImageData } from "../firebase";

import firebase from "firebase/app";
import "regenerator-runtime/runtime";

import { Context } from "../Context-Provider";
import { fromEvent, interval, throttle } from "rxjs";

const FLASH_TIME_MS = 500;
const READY_DELAY_MS = 2000;

export default function ScanDocument() {
    const { state, dispatch } = useContext(Context);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const buttonRef = useRef(null);

    const videoRef = useRef(null);
    useEffect(() => {
        const click = fromEvent(buttonRef.current, "click");

        const unsub = click
            .pipe(throttle((val) => interval(2000)))
            .subscribe(handleVideoClick);

        // (event) => {
        // 	// toast.info(event.target);
        // 	console.log(event.target);
        // },
        // (error) => {
        // 	// toast.error(error);
        // },
        // () => {
        // 	toast.success("SUCCESS");
        // }

        async function getMedia() {
            try {
                const video = videoRef.current;
                video.srcObject =
                    await window.navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            width: 9999,
                            height: 9999,
                        },
                    });

                video.play();

                video.addEventListener("loadedmetadata", () => {
                    const { videoWidth, videoHeight } = videoRef.current;
                    setDimensions({ width: videoWidth, height: videoHeight });
                    //dispatch("video-loaded")
                });
            } catch (err) {
                console.log("err", err);
            }
        }

        getMedia();

        return () => unsub();
    }, []);

    async function handleVideoClick() {
        const { width, height } = dimensions;

        const video = videoRef.current;
        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const canvasContext = canvas.getContext("2d");

        canvasContext.clearRect(0, 0, width, height);
        canvasContext.drawImage(video, 0, 0, width, height);

        const imageData = canvas.toDataURL("image/png");

        dispatch({ type: "begin-upload" });

        uploadImageData(imageData)
            .then((snapshot) => {
                dispatch({ type: "upload-success" });
            })
            .catch((err) => toast.error(err))
            .finally(() => {
                dispatch({ type: "upload-ended" });
            });
    }

    return (
        <div className="relative w-full">
            <video className="object-fill w-full h-screen" ref={videoRef} />
            <div className="w-full">
                <section
                    id="bottom-navigation"
                    className="block fixed inset-x-0 bottom-0 z-10 bg-white bg-opacity-25 shadow"
                >
                    <div id="tabs" className="flex justify-between text-white">
                        <div className="w-full justify-left inline-block text-left pt-3 pb-1 pl-4">
                            <button className="focus:text-teal-500 hover:text-teal-500">
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 50 50"
                                    className="inline-block"
                                >
                                    <g
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <path
                                            d="M21.0847458,3.38674884 C17.8305085,7.08474576 17.8305085,10.7827427 21.0847458,14.4807396 C24.3389831,18.1787365 24.3389831,22.5701079 21.0847458,27.6548536 L21.0847458,42 L8.06779661,41.3066256 L6,38.5331279 L6,26.2681048 L6,17.2542373 L8.88135593,12.4006163 L21.0847458,2 L21.0847458,3.38674884 Z"
                                            fill="currentColor"
                                            fillOpacity="0.1"
                                        ></path>
                                        <path
                                            d="M11,8 L33,8 L11,8 Z M39,17 L39,36 C39,39.3137085 36.3137085,42 33,42 L11,42 C7.6862915,42 5,39.3137085 5,36 L5,17 L7,17 L7,36 C7,38.209139 8.790861,40 11,40 L33,40 C35.209139,40 37,38.209139 37,36 L37,17 L39,17 Z"
                                            fill="currentColor"
                                        ></path>
                                        <path
                                            d="M22,27 C25.3137085,27 28,29.6862915 28,33 L28,41 L16,41 L16,33 C16,29.6862915 18.6862915,27 22,27 Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="currentColor"
                                            fillOpacity="0.1"
                                        ></path>
                                        <rect
                                            fill="currentColor"
                                            transform="translate(32.000000, 11.313708) scale(-1, 1) rotate(-45.000000) translate(-32.000000, -11.313708) "
                                            x="17"
                                            y="10.3137085"
                                            width="30"
                                            height="2"
                                            rx="1"
                                        ></rect>
                                        <rect
                                            fill="currentColor"
                                            transform="translate(12.000000, 11.313708) rotate(-45.000000) translate(-12.000000, -11.313708) "
                                            x="-3"
                                            y="10.3137085"
                                            width="30"
                                            height="2"
                                            rx="1"
                                        ></rect>
                                    </g>
                                </svg>
                            </button>
                        </div>
                        <div className="w-full justify-center inline-block text-center pt-2 pb-1">
                            <button
                                disabled={state.buttonDisabled}
                                ref={buttonRef}
                                id="imgButton"
                                className="focus:text-teal-500 hover:text-teal-500"
                            >
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 50 50"
                                    className="inline-block"
                                >
                                    <g
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <g transform="translate(5.000000, 5.000000)">
                                            <circle
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                cx="21"
                                                cy="21"
                                                r="22.5"
                                            ></circle>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                        </div>
                        <div className="w-full justify-center inline-block text-center pt-2 pb-1"></div>
                    </div>
                </section>
            </div>
        </div>
    );
}
