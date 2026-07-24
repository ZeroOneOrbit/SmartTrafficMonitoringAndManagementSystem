import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ShieldAlert,
  Car,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import toast from "react-hot-toast";

import axios from "axios";
import { useNavigate } from "react-router-dom";



// ======================================================
// SINGLE VIOLATION CARD
// ======================================================

const ViolationCard = ({
  violation,
}) => {

  const [
    decision,
    setDecision,
  ] = useState(null);




  // ======================================================
  // GOOGLE DRIVE IMAGE URL
  // ======================================================

  const getGoogleDriveImageUrl = (
    url
  ) => {

    if (!url) {
      return null;
    }


    const fileId =
      url.match(
        /\/d\/([^/]+)/
      )?.[1];


    if (!fileId) {
      return null;
    }


    return (
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`
    );

  };


  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (
    dateString
  ) => {

    if (!dateString) {
      return "N/A";
    }


    return new Date(
      dateString
    ).toLocaleString(
      "bn-BD",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  };

const fineData = {
  signal_violation: {
    status: "pending",
    fee: "2000",
  },

  wrong_way: {
    status: "pending",
    fee: "4000",
  },
};


// ======================================================
// DECISION
// ======================================================

const handleDecision = async (value, violation) => {
  const getOfficer = JSON.parse(
    sessionStorage.getItem("officer")
  );

  try {

    // ======================================================
    // DETERMINE CASE STATUS
    // ======================================================

    const caseStatus =
      value === "guilty"
        ? "filed"
        : "dispatched";


    // ======================================================
    // CREATE FINAL VIOLATION DATA
    // ======================================================

    const finalViolationData = {

      time: violation.time,

      carType: violation.car_type,

      violationType: violation.violation_type,

      evedience: {
        driveURI:
          violation.evidence?.driveurl || "",
      },

      location: violation.location,

      vehicleNumber:
        violation.vehicle_number || "N/A",

      licenseNumber: "N/A",

      officerRef: {
        name: getOfficer?.name || "N/A",

        rank: getOfficer?.role || "N/A",

        area: getOfficer?.zone || "N/A",
      },

      caseStatus: caseStatus,
    };


    // ======================================================
    // ADD FINE ONLY IF GUILTY
    // ======================================================

    if (caseStatus === "filed") {

      const selectedFine =
        fineData[violation.violation_type];


      // Check if fine exists
      if (!selectedFine) {

        toast.error(
          "এই violation-এর জন্য কোনো fine নির্ধারণ করা হয়নি!"
        );

        return;
      }


      // Add fine data
      finalViolationData.fine = {

        status: selectedFine.status,

        fee: selectedFine.fee,

      };

    }


    // ======================================================
    // CREATE FINAL CASE
    // ======================================================

    const response = await axios.post(

      `${import.meta.env.VITE_SERVER_API}/violation/admin/create`,

      finalViolationData

    );


    // ======================================================
    // DELETE ORIGINAL VIOLATION
    // ======================================================

    if (response.status === 201) {

      await axios.delete(

        `${import.meta.env.VITE_SERVER_API}/violation/admin`,

        {
          headers: {
            id: violation.id,
          },
        }

      );


      // ======================================================
      // SUCCESS MESSAGE
      // ======================================================

      if (value === "guilty") {

        toast.success(
          "ভেহিকেলটি দোষী হিসেবে চিহ্নিত করা হয়েছে!"
        );

      } else {

        toast.success(
          "ভেহিকেলটি নির্দোষ হিসেবে চিহ্নিত করা হয়েছে!"
        );

      }

    }

  } catch (error) {

    console.error(
      "Violation processing error:",

      error.response?.data ||
      error.message

    );

    toast.error(
      "Violation process করা যায়নি!"
    );

  }
};


  const imageUrl =
    getGoogleDriveImageUrl(
      violation.evidence?.driveurl
    );


  return (

    <div
      className="
        w-full
        bg-slate-900/50
        border
        border-slate-800
        rounded-2xl
        p-3
        hover:border-blue-500/30
        transition-all
      "
    >

      {/* ================================================= */}
      {/* MAIN INFORMATION */}
      {/* ================================================= */}

      <div
        className="
          flex
          gap-3
          items-start
        "
      >

        {/* IMAGE */}

        <div
          className="
            w-28
            h-24
            flex-shrink-0
            rounded-xl
            overflow-hidden
            border
            border-slate-800
            bg-slate-950
          "
        >

          {imageUrl ? (

            <img
              src={imageUrl}
              alt="Violation Evidence"
              className="
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <div
              className="
                w-full
                h-full
                flex
                items-center
                justify-center
                text-[10px]
                text-slate-500
              "
            >

              No Image

            </div>

          )}

        </div>


        {/* INFORMATION */}

        <div
          className="
            flex-1
            min-w-0
          "
        >

          {/* VIOLATION TYPE */}

          <div
            className="
              flex
              items-start
              gap-1
              mb-2
            "
          >

            <ShieldAlert
              size={13}
              className="
                text-red-400
                flex-shrink-0
                mt-0.5
              "
            />

            <h3
              className="
                text-[11px]
                leading-tight
                font-bold
                text-red-400
                uppercase
              "
            >

              {violation.violation_type
                ?.replaceAll(
                  "_",
                  " "
                )
                .toUpperCase()}

            </h3>

          </div>


          {/* VEHICLE */}

          <div
            className="
              flex
              items-center
              gap-1
              text-[10px]
              text-slate-400
              mb-1
            "
          >

            <Car
              size={11}
              className="text-blue-400"
            />

            <span>

              {violation.car_type}

            </span>

          </div>


          {/* VEHICLE NUMBER */}

          <div
            className="
              flex
              items-center
              gap-1
              text-[10px]
              text-slate-400
              mb-1
            "
          >

            <span
              className="
                text-purple-400
                font-bold
              "
            >

              #

            </span>

            <span>

              {violation.vehicle_number}

            </span>

          </div>


          {/* TRACK ID */}

          <div
            className="
              flex
              items-center
              gap-1
              text-[10px]
              text-slate-400
              mb-1
            "
          >

            <span
              className="
                text-blue-400
                font-bold
              "
            >

              Track:

            </span>

            <span>

              #{violation.trackid}

            </span>

          </div>


          {/* LOCATION */}

          <div
            className="
              flex
              items-start
              gap-1
              text-[10px]
              text-slate-400
            "
          >

            <MapPin
              size={11}
              className="
                text-red-400
                flex-shrink-0
                mt-0.5
              "
            />

            <span>

              {violation.location}

            </span>

          </div>

        </div>

      </div>


      {/* TIME */}

      <div
        className="
          flex
          items-center
          gap-1
          text-[9px]
          text-slate-500
          mt-3
          pt-2
          border-t
          border-slate-800
        "
      >

        <Clock
          size={11}
        />

        <span>

          {formatDate(
            violation.time
          )}

        </span>

      </div>


      {/* DECISION BUTTONS */}

      <div
        className="
          grid
          grid-cols-2
          gap-2
          mt-3
        "
      >

        {/* GUILTY */}

        <button
          onClick={() =>
            handleDecision(
              "guilty", 
              violation
            )
          }
          className={`
            flex
            items-center
            justify-center
            gap-1
            py-2
            rounded-lg
            border
            text-[10px]
            font-bold

            ${
              decision === "guilty"

                ? "bg-red-500 text-white border-red-400"

                : "bg-red-500/10 text-red-400 border-red-500/20"
            }
          `}
        >

          <CheckCircle
            size={12}
          />

          Guilty

        </button>


        {/* NOT GUILTY */}

        <button
          onClick={() =>
            handleDecision(
              "not_guilty", 
              violation
            )
          }
          className={`
            flex
            items-center
            justify-center
            gap-1
            py-2
            rounded-lg
            border
            text-[10px]
            font-bold

            ${
              decision === "not_guilty"

                ? "bg-green-500 text-white border-green-400"

                : "bg-green-500/10 text-green-400 border-green-500/20"
            }
          `}
        >

          <XCircle
            size={12}
          />

          Not Guilty

        </button>

      </div>

    </div>

  );

};


// ======================================================
// VIOLATION LIST
// ======================================================

const ViolationList = () => {


  const [
    violations,
    setViolations,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    showAll,
    setShowAll,
  ] = useState(false);


    const navigate  = useNavigate()
  // ======================================================
  // FETCH DATA
  // ======================================================

  const getViolations = async () => {

  const getOfficer =
    JSON.parse(
      sessionStorage.getItem("officer")
    );


  try {

    const response =
      await axios.get(
        `${import.meta.env.VITE_SERVER_API}/violation/admin`
      );


    const newData =
      response.data.data;


    if (Array.isArray(newData)) {

      // Admin can see all violations
      if (getOfficer.role === "admin") {

        setViolations(newData);

      }

      // Officer can see only their zone violations
      else {

        const filterData =
          newData.filter(
            (violation) =>
              violation.location ===
              getOfficer.zone
          );


        setViolations(filterData);

      }

    }

  } catch (error) {

    console.error(
      "Error fetching violations:",
      error
    );

  } finally {

    setLoading(false);

  }

};


  // ======================================================
  // INITIAL LOAD + AUTO UPDATE
  // ======================================================

  useEffect(() => {


    // Load immediately

    getViolations();


    // Fetch every 5 seconds

    const interval =
      setInterval(
        () => {

          getViolations();


        },
        5000
      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, []);


  useEffect(() => {
localStorage.setItem(
  "violations",
  JSON.stringify(violations)
);

}, [violations]);



 


  // ======================================================
  // SHOW ONLY LAST 4 ITEMS
  // ======================================================

  const visibleViolations =
    showAll

      ? violations

      : violations.slice(
          -10
        );


  if (
    loading
  ) {

    return (

      <div
        className="
          w-full
          p-5
          text-center
          text-slate-400
        "
      >

        Loading...

      </div>

    );

  }


 
  return (

    <div
      className="
        w-full
        bg-slate-950/60
        border
        border-blue-950/40
        rounded-3xl
        p-5
        backdrop-blur-xl
      "
    >

      {/* HEADER */}

    <div
  className="
    flex
    items-center
    justify-between
    mb-4
  "
>

  {/* LEFT SIDE */}

  <div
    className="
      flex
      items-center
      gap-2
    "
  >

    <ShieldAlert
      size={16}
      className="text-red-400"
    />

    <h2
      className="
        text-[10px]
        font-bold
        text-white
        uppercase
        tracking-widest
      "
    >
      AI Violation Alerts
    </h2>


    {/* VIOLATION COUNT */}

    <span
      className="
        min-w-[22px]
        h-[22px]
        px-1.5
        flex
        items-center
        justify-center
        rounded-full
        bg-red-500/10
        border
        border-red-500/20
        text-red-400
        text-[10px]
        font-bold
      "
    >
      {violations.length}
    </span>

  </div>


  {/* SHOW MORE BUTTON */}

  {violations.length > 4 && (

    <button
      onClick={() =>
        navigate("/violation")
      }
      className="
        flex
        items-center
        gap-1
        px-3
        py-2
        rounded-lg
        bg-blue-500/10
        border
        border-blue-500/20
        text-blue-400
        text-[8px]
        font-bold
        hover:bg-blue-500/20
        transition-all
        cursor-pointer
      "
    >

      সব দেখুন

    </button>

  )}

</div>


      {/* SCROLLABLE LIST */}

      <div
       
        className="
          flex
          flex-col
          gap-3
          max-h-[500px]
          overflow-y-auto
          pr-2
        "
      >

        {visibleViolations.map(
          (
            violation
          ) => (

            <ViolationCard
              key={
                violation._id
              }
              violation={
                violation
              }
            />

          )
        )}

      </div>

    </div>

  );

};


export default ViolationList;