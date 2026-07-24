import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Check, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useTrafficWebSocket from "../hooks/usetrafficwebsocket";

const MapPanel = ({ emergencyMode }) => {
    const [selectedLoc, setSelectedLoc] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cameraData, setCameraData] = useState({});
    const [location, setLocation] = useState("");

    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const allowedCameraIdsRef = useRef(new Set());
    const isAdminRef = useRef(false);
    const centerSetRef = useRef(false);

    /*
    |--------------------------------------------------------------------------
    | MARKER COLOR
    |--------------------------------------------------------------------------
    */

    const applyMarkerColor = useCallback(
        (marker, isEmergencyActive) => {
            if (!marker) return;

            const markerElement = marker.getElement?.();

            if (!markerElement) return;

            const markerSvg =
                markerElement.querySelector("svg");

            const shapes =
                markerElement.querySelectorAll(
                    "path, circle, rect, polygon"
                );

            const color = isEmergencyActive
                ? "#dc2626"
                : "#2563eb";

            const whiteOutline = "#ffffff";

            if (markerSvg) {
                markerSvg.style.fill = color;
                markerSvg.style.stroke = whiteOutline;
                markerSvg.style.strokeWidth = "2";

                markerSvg.setAttribute(
                    "fill",
                    color
                );

                markerSvg.setAttribute(
                    "stroke",
                    whiteOutline
                );

                markerSvg.setAttribute(
                    "stroke-width",
                    "2"
                );
            }

            shapes.forEach((shape) => {
                shape.style.fill = color;
                shape.style.stroke = whiteOutline;
                shape.style.strokeWidth = "2";

                shape.setAttribute(
                    "fill",
                    color
                );

                shape.setAttribute(
                    "stroke",
                    whiteOutline
                );

                shape.setAttribute(
                    "stroke-width",
                    "2"
                );
            });

            markerElement.style.filter = "none";
        },
        []
    );

    /*
    |--------------------------------------------------------------------------
    | LOCATION CHANGE
    |--------------------------------------------------------------------------
    */

    const handleLocationChange = (loc) => {
        setSelectedLoc(loc);
        setDropdownOpen(false);

        toast.success(
            `লোকেশন পরিবর্তন করা হয়েছে: ${loc}`
        );
    };

    /*
    |--------------------------------------------------------------------------
    | WEBSOCKET CAMERA DATA
    |--------------------------------------------------------------------------
    */

    const handleCameraData = useCallback((data) => {
        if (!data?.cam_id) return;

        if (
            !isAdminRef.current &&
            !allowedCameraIdsRef.current.has(data.cam_id)
        ) {
            return;
        }

        setCameraData((previousData) => ({
            ...previousData,
            [data.cam_id]: data
        }));
    }, []);

    useTrafficWebSocket(handleCameraData);

    /*
    |--------------------------------------------------------------------------
    | LOAD CAMERA DATA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let isMounted = true;

        const loadCameraData = async () => {
            try {
                const officerData =
                    sessionStorage.getItem(
                        "officer"
                    );

                if (!officerData) {
                    setError("Officer not found");
                    return;
                }

                const officer =
                    JSON.parse(officerData);

                const thanaId =
                    officer?.zone;

                const role =
                    officer?.role;

                if (!role) {
                    setError(
                        "Officer role not found"
                    );

                    return;
                }

                if (!thanaId) {
                    setError(
                        "Officer zone not found"
                    );

                    return;
                }

                /*
                |--------------------------------------------------------------------------
                | SET OFFICER LOCATION
                |--------------------------------------------------------------------------
                */

                setLocation(thanaId);
                setSelectedLoc(thanaId);

                const apiBaseUrl =
                    import.meta.env
                        .VITE_SERVER_API ||
                    "http://localhost:5000/api";

                const baseUrl =
                    apiBaseUrl.replace(
                        /\/$/,
                        ""
                    );

                const isAdmin =
                    role.toLowerCase() ===
                    "admin";

                const url = isAdmin
                    ? `${baseUrl}/rldata/camera`
                    : `${baseUrl}/rldata/camera?thanaId=${encodeURIComponent(
                          thanaId
                      )}`;

                const response =
                    await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        `Camera request failed: ${response.status}`
                    );
                }

                const payload =
                    await response.json();

                const cameras =
                    Array.isArray(
                        payload?.data
                    )
                        ? payload.data
                        : [];

                /*
                |--------------------------------------------------------------------------
                | SET MAP CENTER ONLY ONCE
                |--------------------------------------------------------------------------
                */

                if (
                    cameras.length > 0 &&
                    !centerSetRef.current
                ) {
                    const firstCamera =
                        cameras[0];

                    const latitude =
                        firstCamera?.location
                            ?.latitude;

                    const longitude =
                        firstCamera?.location
                            ?.longitude;

                    if (
                        latitude !== undefined &&
                        longitude !== undefined &&
                        mapRef.current
                    ) {
                        mapRef.current.flyTo({
                            center: [
                                longitude,
                                latitude
                            ],
                            zoom: 13,
                            essential: true
                        });

                        centerSetRef.current =
                            true;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | KEEP LATEST CAMERA DATA
                |--------------------------------------------------------------------------
                */

                const latestCameraData =
                    cameras.reduce(
                        (
                            result,
                            camera
                        ) => {
                            if (
                                camera?.cam_id &&
                                !result[
                                    camera.cam_id
                                ]
                            ) {
                                result[
                                    camera.cam_id
                                ] = camera;
                            }

                            return result;
                        },
                        {}
                    );

                if (!isMounted) return;

                isAdminRef.current =
                    isAdmin;

                allowedCameraIdsRef.current =
                    new Set(
                        Object.keys(
                            latestCameraData
                        )
                    );

                setCameraData(
                    latestCameraData
                );

                setError("");
            } catch (err) {
                console.error(
                    "Unable to load camera data:",
                    err
                );

                if (isMounted) {
                    setError(
                        "ক্যামেরার ডেটা লোড করা যায়নি"
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadCameraData();

        const refreshInterval =
            setInterval(
                loadCameraData,
                1000
            );

        return () => {
            isMounted = false;

            clearInterval(
                refreshInterval
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | CREATE MAP ONLY ONCE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const map =
            new maplibregl.Map({
                container:
                    mapContainer.current,

                style:
                    "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",

                center: [
                    90.3688,
                    23.8223
                ],

                zoom: 13
            });

        mapRef.current = map;

        map.on("load", () => {
            setLoading(false);
        });

        return () => {
            Object.values(
                markersRef.current
            ).forEach(
                (marker) =>
                    marker.remove()
            );

            markersRef.current = {};

            map.remove();

            mapRef.current = null;
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | CREATE / UPDATE / REMOVE MARKERS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const map =
            mapRef.current;

        if (!map) return;

        const currentCameraIds =
            new Set(
                Object.keys(
                    cameraData
                )
            );

        /*
        |--------------------------------------------------------------------------
        | REMOVE OLD MARKERS
        |--------------------------------------------------------------------------
        */

        Object.keys(
            markersRef.current
        ).forEach((camId) => {
            if (
                !currentCameraIds.has(
                    camId
                )
            ) {
                markersRef.current[
                    camId
                ].remove();

                delete markersRef.current[
                    camId
                ];
            }
        });

        /*
        |--------------------------------------------------------------------------
        | CREATE / UPDATE MARKERS
        |--------------------------------------------------------------------------
        */

        Object.values(
            cameraData
        ).forEach((camera) => {
            const latitude =
                camera?.location
                    ?.latitude;

            const longitude =
                camera?.location
                    ?.longitude;

            if (
                latitude === undefined ||
                longitude === undefined
            ) {
                return;
            }

            const isEmergencyActive =
                Boolean(
                    emergencyMode ||
                        camera?.emergency_mode
                );

            const existingMarker =
                markersRef.current[
                    camera.cam_id
                ];

            const popupContent = `
                <div style="
                    min-width: 220px;
                    color: #0f172a;
                    font-family: Arial;
                ">
                    <h3 style="
                        margin: 0 0 10px;
                        font-size: 16px;
                        font-weight: bold;
                    ">
                        📹 ${camera.cam_id}
                    </h3>

                    <p>
                        🚗 Live Count:
                        <strong>
                            ${camera.live_count ?? 0}
                        </strong>
                    </p>

                    <p>
                        📊 Total:
                        <strong>
                            ${camera.total ?? 0}
                        </strong>
                    </p>

                    <p>
                        🚦 Light:
                        <strong>
                            ${camera.light_status ?? "N/A"}
                        </strong>
                    </p>

                    <p>
                        🚨 Emergency:
                        <strong>
                            ${
                                camera.emergency_mode
                                    ? "YES"
                                    : "NO"
                            }
                        </strong>
                    </p>

                    <p style="
                        font-size: 11px;
                        color: #64748b;
                    ">
                        Updated:
                        ${camera.last_updated ?? "N/A"}
                    </p>
                </div>
            `;

            const popup =
                existingMarker?.getPopup() ||
                new maplibregl.Popup({
                    offset: 25,
                    closeButton: true,
                    closeOnClick: false
                });

            popup.setHTML(
                popupContent
            );

            if (existingMarker) {
                existingMarker.setLngLat([
                    longitude,
                    latitude
                ]);

                applyMarkerColor(
                    existingMarker,
                    isEmergencyActive
                );

                return;
            }

            const marker =
                new maplibregl.Marker({
                    color:
                        isEmergencyActive
                            ? "red"
                            : "blue"
                })
                    .setLngLat([
                        longitude,
                        latitude
                    ])
                    .setPopup(
                        popup
                    )
                    .addTo(map);

            applyMarkerColor(
                marker,
                isEmergencyActive
            );

            markersRef.current[
                camera.cam_id
            ] = marker;
        });
    }, [
        applyMarkerColor,
        cameraData,
        emergencyMode
    ]);


    /*
|--------------------------------------------------------------------------
| CALCULATE TOTAL VEHICLE COUNT FROM ALL CAMERAS
|--------------------------------------------------------------------------
*/
useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const savedDate =
        localStorage.getItem("totalVehicleDate");

    // Reset total vehicle when a new day starts
    if (savedDate !== today) {
        localStorage.setItem("totalVehicle", "0");
        localStorage.setItem(
            "totalVehicleDate",
            today
        );
    }

    const totalVehicleCount = Object.values(cameraData).reduce(
        (sum, camera) => {
            return sum + Number(camera?.total || 0);
        },
        0
    );

    localStorage.setItem(
        "totalVehicle",
        totalVehicleCount.toString()
    );

    localStorage.setItem(
        "totalVehicleDate",
        today
    );

    window.dispatchEvent(
        new Event("totalVehicleUpdated")
    );

    console.log(
        "All Camera Total Vehicles:",
        totalVehicleCount
    );
}, [cameraData]);

    return (
        <div className="
            w-full h-full relative
            rounded-3xl
            border border-blue-950/40
            bg-slate-950/60
            p-4
            backdrop-blur-xl
            flex flex-col
            justify-between
            overflow-hidden
        ">
            <div className="
                relative z-20
                flex flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-3 mb-4
            ">
                <div className="relative">
                    <div
                        className="
                            flex items-center
                            justify-between
                            gap-2.5
                            bg-slate-900
                            border border-slate-800
                            px-4 py-2.5
                            rounded-2xl
                            text-xs
                            font-bold
                            text-white
                            w-full sm:w-auto
                        "
                    >
                        <div className="
                            flex items-center
                            gap-2
                            text-blue-400
                        ">
                            <MapPin
                                size={14}
                            />

                            <span>
                                থানা
                            </span>
                        </div>

                        <span>
                            {selectedLoc ||
                                "Loading..."}
                        </span>

                        
                    </div>

                   
                        
                           
                   
                    
                </div>
            </div>

            {error && (
                <div className="
                    absolute
                    top-20
                    left-1/2
                    -translate-x-1/2
                    z-40
                    bg-red-950
                    border border-red-800
                    text-red-300
                    px-4 py-2
                    rounded-xl
                    text-xs
                ">
                    {error}
                </div>
            )}

            {loading && (
                <div className="
                    absolute
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-slate-950/90
                ">
                    <div className="text-center">
                        <div className="
                            w-8 h-8
                            border-4
                            border-blue-500
                            border-t-transparent
                            rounded-full
                            animate-spin
                            mx-auto
                        " />

                        <p className="
                            mt-3
                            text-sm
                            text-slate-300
                        ">
                            ম্যাপ লোড হচ্ছে...
                        </p>
                    </div>
                </div>
            )}

            <div
                ref={mapContainer}
                className="
                    relative
                    flex-grow
                    min-h-[300px]
                    rounded-xl
                    overflow-hidden
                "
            />

            <div className="
                relative z-10
                border-t
                border-slate-900
                pt-3 mt-3
                flex items-center
                justify-between
                text-[10px]
                text-slate-500
                font-semibold
            ">
                <div className="
                    flex
                    items-center
                    gap-4
                ">
                    <span>
                        🔴 দুর্ঘটনা
                    </span>

                    <span>
                        🔵 ক্যামেরা
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MapPanel;