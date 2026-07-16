import React, {
    useState,
    useEffect,
    useRef,
    useCallback
} from "react";

import {
    MapPin,
    Check,
    ChevronDown
} from "lucide-react";

import toast from "react-hot-toast";

import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import useTrafficWebSocket
    from "../hooks/usetrafficwebsocket";

const MapPanel = ({
    emergencyMode
}) => {

    const [
        selectedLoc,
        setSelectedLoc
    ] = useState(
        "ঢাকা সেক্টর ৮ - মিরপুর"
    );

    const [
        dropdownOpen,
        setDropdownOpen
    ] = useState(false);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        cameraData,
        setCameraData
    ] = useState({});

    const mapContainer =
        useRef(null);

    const mapRef =
        useRef(null);

    const markersRef =
        useRef({});


    const locations = [
        "ঢাকা সেক্টর ৮ - মিরপুর",
        "উত্তরা সেক্টর ৩ - হাউস বিল্ডিং",
        "টঙ্গী ফায়ার স্টেশন মোড়",
        "যাত্রাবাড়ী চৌরাস্তা",
        "ফার্মগেট ওভারব্রিজ"
    ];


    const handleLocationChange = (
        loc
    ) => {

        setSelectedLoc(loc);

        setDropdownOpen(false);

        toast.success(
            `লোকেশন পরিবর্তন করা হয়েছে: ${loc}`
        );
    };


    /*
    |--------------------------------------------------------------------------
    | STEP 1: Receive WebSocket Data
    |--------------------------------------------------------------------------
    */

    const handleCameraData =
        useCallback((data) => {

            console.log(
                "Camera data received:",
                data
            );

            setCameraData(
                (previousData) => ({

                    ...previousData,

                    [data.cam_id]: data

                })
            );

        }, []);


    useTrafficWebSocket(
        handleCameraData
    );


    /*
    |--------------------------------------------------------------------------
    | STEP 2: Create Map
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setLoading(true);

        const center = [
            90.4125,
            23.8103
        ];

        const map =
            new maplibregl.Map({

                container:
                    mapContainer.current,

                style:
                    "https://tiles.openfreemap.org/styles/dark",

                center: center,

                zoom: 11

            });

        mapRef.current = map;


        map.on(
            "load",
            () => {

                setLoading(false);

            }
        );


        return () => {

            Object.values(
                markersRef.current
            ).forEach(
                (marker) => {
                    marker.remove();
                }
            );

            map.remove();

        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | STEP 3: Create / Update Camera Markers
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const map =
            mapRef.current;

        if (!map) return;


        Object.values(
            cameraData
        ).forEach(
            (camera) => {

                const latitude =
                    camera.location?.latitude;

                const longitude =
                    camera.location?.longitude;


                if (
                    latitude === undefined ||
                    longitude === undefined
                ) {
                    return;
                }


                /*
                |--------------------------------------------------------------------------
                | If marker already exists
                |--------------------------------------------------------------------------
                */

                if (
                    markersRef.current[
                        camera.cam_id
                    ]
                ) {

                    const marker =
                        markersRef.current[
                            camera.cam_id
                        ];

                    marker.setLngLat([
                        longitude,
                        latitude
                    ]);

                    return;
                }


                /*
                |--------------------------------------------------------------------------
                | Create Popup
                |--------------------------------------------------------------------------
                */

                const popup =
                    new maplibregl.Popup({
                        offset: 25,
                        closeButton: true,
                        closeOnClick: false
                    })
                    .setHTML(`

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
                                    ${camera.live_count}
                                </strong>
                            </p>

                            <p>
                                📊 Total:
                                <strong>
                                    ${camera.total}
                                </strong>
                            </p>

                            <p>
                                🚦 Light:
                                <strong>
                                    ${camera.light_status}
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
                                ${camera.last_updated}
                            </p>

                        </div>

                    `);


                /*
                |--------------------------------------------------------------------------
                | Create Marker
                |--------------------------------------------------------------------------
                */

                const marker =
                    new maplibregl.Marker({

                        color:
                            camera.emergency_mode
                                ? "red"
                                : "blue"

                    })
                    .setLngLat([
                        longitude,
                        latitude
                    ])
                    .setPopup(popup)
                    .addTo(map);


                /*
                |--------------------------------------------------------------------------
                | Save Marker Reference
                |--------------------------------------------------------------------------
                */

                markersRef.current[
                    camera.cam_id
                ] = marker;

            }
        );

    }, [cameraData]);


    return (

        <div className="
            w-full
            h-full
            relative
            rounded-3xl
            border
            border-blue-950/40
            bg-slate-950/60
            p-4
            backdrop-blur-xl
            flex
            flex-col
            justify-between
            overflow-hidden
        ">


            {/* Top Controls */}

            <div className="
                relative
                z-20
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-3
                mb-4
            ">

                <div className="relative">

                    <button
                        onClick={() =>
                            setDropdownOpen(
                                !dropdownOpen
                            )
                        }
                        className="
                            flex
                            items-center
                            justify-between
                            gap-2.5
                            bg-slate-900
                            border
                            border-slate-800
                            px-4
                            py-2.5
                            rounded-2xl
                            text-xs
                            font-bold
                            text-white
                            w-full
                            sm:w-auto
                        "
                    >

                        <div className="
                            flex
                            items-center
                            gap-2
                            text-blue-400
                        ">

                            <MapPin size={14} />

                            <span>
                                পছন্দের লোকেশন
                            </span>

                        </div>


                        <span>
                            {selectedLoc}
                        </span>


                        <ChevronDown
                            size={14}
                            className={
                                dropdownOpen
                                    ? "rotate-180"
                                    : ""
                            }
                        />

                    </button>


                    {dropdownOpen && (

                        <div className="
                            absolute
                            left-0
                            top-full
                            mt-2
                            w-64
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-2xl
                            p-1.5
                            shadow-2xl
                            z-30
                        ">

                            {locations.map(
                                (loc) => (

                                    <button
                                        key={loc}
                                        onClick={() =>
                                            handleLocationChange(
                                                loc
                                            )
                                        }
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            justify-between
                                            px-3
                                            py-2
                                            text-xs
                                            text-slate-300
                                            rounded-xl
                                            hover:bg-slate-800
                                        "
                                    >

                                        <span>
                                            {loc}
                                        </span>


                                        {
                                            selectedLoc ===
                                            loc && (
                                                <Check
                                                    size={14}
                                                    className="
                                                        text-blue-400
                                                    "
                                                />
                                            )
                                        }

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>


            {/* Loading */}

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
                            w-8
                            h-8
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


            {/* Map */}

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


            {/* Footer */}

            <div className="
                relative
                z-10
                border-t
                border-slate-900
                pt-3
                mt-3
                flex
                items-center
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
                        🟢 সিগন্যাল সচল
                    </span>

                    <span>
                        🔴 জ্যাম / দুর্ঘটনা
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