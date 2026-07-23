import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster }  from "react-hot-toast";

import {
  ShieldAlert,
  Car,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";


// ======================================================
// FINE DATA
// ======================================================

const fineData = {

  signal_violation: {
    status: "pending",
    fee: "2000",
  },

  wrong_way: {
    status: "pending",
    fee: "4000",
  },

  speed_violation: {
    status: "pending",
    fee: "3000",
  },

  wrong_lane: {
    status: "pending",
    fee: "2500",
  },

};


// ======================================================
// SINGLE VIOLATION CARD
// ======================================================

const ViolationCard = ({
  violation,
  onViolationProcessed,
}) => {

  const [decision, setDecision] = useState(
    violation.status === "guilty"
      ? "guilty"
      : violation.status === "not_guilty"
        ? "not_guilty"
        : null
  );

  const [processing, setProcessing] = useState(false);


  // ======================================================
  // GOOGLE DRIVE IMAGE URL
  // ======================================================

  const getGoogleDriveImageUrl = (url) => {

    if (!url) {
      return null;
    }

    const fileId =
      url.match(/\/d\/([^/]+)/)?.[1];

    if (!fileId) {
      return null;
    }

    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;

  };


  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (dateString) => {

    if (!dateString) {
      return "N/A";
    }

    return new Date(dateString).toLocaleString(
      "bn-BD",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  };


  // ======================================================
  // HANDLE DECISION
  // ======================================================

 const handleDecision = async (value) => {

  if (processing) {
    return;
  }

  try {

    setProcessing(true);

    const getOfficer = JSON.parse(
      sessionStorage.getItem("officer")
    );


    if (!getOfficer) {

      toast.error(
        "Officer information পাওয়া যায়নি!"
      );

      return;

    }


    // ======================================================
    // DETERMINE CASE STATUS
    // ======================================================

    const caseStatus =
      value === "guilty"
        ? "filed"
        : "dispatched";


    // ======================================================
    // PREPARE DATA
    // ======================================================

    const finalViolationData = {

      time: violation.time,

      carType:
        violation.car_type || "N/A",

      violationType:
        violation.violation_type,

      evedience: {

        driveURI:
          violation.evidence?.driveurl || "",

      },

      location:
        violation.location || "N/A",

      vehicleNumber:
        violation.vehicle_number || "N/A",

      licenseNumber:
        "N/A",

      officerRef: {

        name:
          getOfficer.name || "N/A",

        rank:
          getOfficer.role || "N/A",

        area:
          getOfficer.zone || "N/A",

      },

      caseStatus:

        caseStatus,

    };


    // ======================================================
    // ADD FINE ONLY IF GUILTY
    // ======================================================

    if (caseStatus === "filed") {

      const selectedFine =
        fineData[violation.violation_type];


      if (!selectedFine) {

        toast.error(
          "এই violation-এর জন্য কোনো fine নির্ধারণ করা হয়নি!"
        );

        return;

      }


      finalViolationData.fine = {

        status:
          selectedFine.status,

        fee:
          selectedFine.fee,

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

    await axios.delete(

      `${import.meta.env.VITE_SERVER_API}/violation/admin`,

      {

        headers: {

          id:
            violation.id ||
            violation._id,

        },

      }

    );


    // ======================================================
    // SHOW TOAST FIRST
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


    // ======================================================
    // REMOVE CARD AFTER TOAST
    // ======================================================

    onViolationProcessed(

      violation.id ||
      violation._id

    );


  } catch (error) {

    console.error(
      "Violation processing error:",
      error.response?.data ||
      error.message
    );


    toast.error(

      error.response?.data?.message ||
      "Violation process করা যায়নি!"

    );

  } finally {

    setProcessing(false);

  }

};


  const imageUrl =
    getGoogleDriveImageUrl(
      violation.evidence?.driveurl
    );


  return (

    <div
      className="
        group
        bg-slate-900/70
        border
        border-slate-800
        rounded-2xl
        overflow-hidden
        hover:border-blue-500/40
        transition-all
        duration-300
      "
    >

      {/* ================================================= */}
      {/* IMAGE */}
      {/* ================================================= */}

      <div
        className="
          relative
          w-full
          h-52
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
              group-hover:scale-105
              transition-transform
              duration-500
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
              text-slate-500
            "
          >
            No Image Available
          </div>

        )}


        {/* VIOLATION TYPE */}

        <div
          className="
            absolute
            top-3
            left-3
            flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-lg
            bg-red-500/90
            text-white
            text-xs
            font-bold
          "
        >

          <ShieldAlert size={14} />

          {violation.violation_type
            ?.replaceAll("_", " ")
            .toUpperCase()}

        </div>

      </div>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="p-5">

        <div className="grid grid-cols-2 gap-4 mb-5">

          {/* VEHICLE TYPE */}

          <div>

            <p className="text-xs text-slate-500 mb-1">
              Vehicle Type
            </p>

            <div
              className="
                flex
                items-center
                gap-2
                text-slate-200
                font-semibold
              "
            >

              <Car
                size={16}
                className="text-blue-400"
              />

              {violation.car_type || "N/A"}

            </div>

          </div>


          {/* VEHICLE NUMBER */}

          <div>

            <p className="text-xs text-slate-500 mb-1">
              Vehicle Number
            </p>

            <p className="text-slate-200 font-semibold">
              {violation.vehicle_number || "N/A"}
            </p>

          </div>


          {/* TRACK ID */}

          <div>

            <p className="text-xs text-slate-500 mb-1">
              Track ID
            </p>

            <p className="text-slate-200 font-semibold">
              #{violation.trackid || "N/A"}
            </p>

          </div>


          {/* LOCATION */}

          <div>

            <p className="text-xs text-slate-500 mb-1">
              Location
            </p>

            <div
              className="
                flex
                items-center
                gap-1
                text-slate-300
              "
            >

              <MapPin
                size={15}
                className="text-red-400"
              />

              <span
                className="truncate"
                title={violation.location}
              >
                {violation.location || "N/A"}
              </span>

            </div>

          </div>

        </div>


        {/* TIME */}

        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-slate-500
            border-t
            border-slate-800
            pt-4
          "
        >

          <Clock size={14} />

          {formatDate(violation.time)}

        </div>


        {/* ================================================= */}
        {/* DECISION BUTTONS */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            mt-5
          "
        >

          {/* GUILTY */}

          <button
            disabled={processing}
            onClick={() =>
              handleDecision("guilty")
            }
            className={`
              flex
              items-center
              justify-center
              gap-2
              py-2.5
              rounded-xl
              border
              text-sm
              font-bold
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed

              ${
                decision === "guilty"
                  ? "bg-red-500 text-white border-red-400"
                  : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
              }
            `}
          >

            {processing &&
            decision === "guilty" ? (

              <Loader2
                size={16}
                className="animate-spin"
              />

            ) : (

              <CheckCircle size={16} />

            )}

            Guilty

          </button>


          {/* NOT GUILTY */}

          <button
            disabled={processing}
            onClick={() =>
              handleDecision("not_guilty")
            }
            className={`
              flex
              items-center
              justify-center
              gap-2
              py-2.5
              rounded-xl
              border
              text-sm
              font-bold
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed

              ${
                decision === "not_guilty"
                  ? "bg-green-500 text-white border-green-400"
                  : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
              }
            `}
          >

            {processing &&
            decision === "not_guilty" ? (

              <Loader2
                size={16}
                className="animate-spin"
              />

            ) : (

              <XCircle size={16} />

            )}

            Not Guilty

          </button>

        </div>

      </div>

    </div>

  );

};


// ======================================================
// ALL VIOLATIONS PAGE
// ======================================================

const AllViolations = () => {

  const [
    violations,
    setViolations,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    filter,
    setFilter,
  ] = useState("all");


  const [
    activeTab,
    setActiveTab,
  ] = useState("violations");


  const [
    emergencyMode,
    setEmergencyMode,
  ] = useState(false);


  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  // ======================================================
  // FETCH VIOLATIONS
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
  // LOAD DATA EVERY 5 SECONDS
  // ======================================================

  useEffect(() => {

    getViolations();


    const interval =
      setInterval(
        getViolations,
        5000
      );


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ======================================================
  // REMOVE PROCESSED VIOLATION
  // ======================================================

  const handleViolationProcessed = (violationId) => {

    setViolations((previousViolations) => {

      const updatedViolations =
        previousViolations.filter(

          (item) =>
            item._id !== violationId &&
            item.id !== violationId

        );


      localStorage.setItem(

        "violations",

        JSON.stringify(updatedViolations)

      );


      return updatedViolations;

    });

  };


  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredViolations =
    violations.filter(
      (violation) => {

        const searchText =
          search
            .toLowerCase()
            .trim();


        const vehicleNumber =
          String(
            violation.vehicle_number || ""
          )
            .toLowerCase();


        const violationType =
          String(
            violation.violation_type || ""
          )
            .toLowerCase();


        const location =
          String(
            violation.location || ""
          )
            .toLowerCase();


        const matchesSearch =

          vehicleNumber.includes(
            searchText
          ) ||

          violationType.includes(
            searchText
          ) ||

          location.includes(
            searchText
          );


        const matchesFilter =

          filter === "all" ||

          violation.violation_type === filter;


        return (

          matchesSearch &&

          matchesFilter

        );

      }

    );


  return (

    <div
      className="
        min-h-screen
        bg-slate-950
        text-white
      "
    >

      {/* ================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================================= */}

      <aside
        className="
          hidden
          lg:block
          fixed
          top-0
          left-0
          z-40
          h-screen
          w-64
        "
      >

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          emergencyMode={emergencyMode}
          setEmergencyMode={setEmergencyMode}
        />

      </aside>


      {/* ================================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-full
          w-64
          transition-transform
          duration-300
          lg:hidden

          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <div className="h-full p-3">

          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {

              setActiveTab(tab);

              setMobileSidebarOpen(false);

            }}
            emergencyMode={emergencyMode}
            setEmergencyMode={setEmergencyMode}
          />

        </div>

      </aside>


      {/* ================================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================================= */}

      {mobileSidebarOpen && (

        <div
          onClick={() =>
            setMobileSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
        />

      )}





<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      zIndex: 999999,
    },
  }}
/>


      {/* ================================================= */}
      {/* MAIN CONTENT */}

      {/* ================================================= */}





      <main
        className="
          min-h-screen
          p-5
          md:p-8
          lg:ml-64
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-5
            mb-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                p-3
                rounded-xl
                bg-red-500/10
                border
                border-red-500/20
              "
            >

              <ShieldAlert
                size={24}
                className="text-red-400"
              />

            </div>


            <div>

              <h1 className="text-2xl font-bold">
                All Violations
              </h1>


              <p className="text-sm text-slate-500">
                AI detected traffic violations
              </p>

            </div>

          </div>


          {/* TOTAL COUNT */}

          <div
            className="
              px-5
              py-3
              rounded-xl
              bg-slate-900
              border
              border-slate-800
            "
          >

            <p className="text-xs text-slate-500">
              Total Violations
            </p>


            <p
              className="
                text-2xl
                font-bold
                text-red-400
              "
            >
              {violations.length}
            </p>

          </div>

        </div>


        {/* SEARCH + FILTER */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-3
            mb-8
          "
        >

          {/* SEARCH */}

          <div
            className="
              relative
              flex-1
            "
          >

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />


            <input
              type="text"
              placeholder="Search vehicle number, violation or location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                py-3
                pl-11
                pr-4
                text-sm
                text-white
                outline-none
                focus:border-blue-500
              "
            />

          </div>


          {/* FILTER */}

          <div className="relative">

            <Filter
              size={16}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />


            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="
                appearance-none
                w-full
                md:w-64
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                py-3
                pl-11
                pr-4
                text-sm
                text-white
                outline-none
                focus:border-blue-500
              "
            >

              <option value="all">
                All Violations
              </option>


              <option value="signal_violation">
                Signal Violation
              </option>


              <option value="speed_violation">
                Speed Violation
              </option>


              <option value="wrong_lane">
                Wrong Lane
              </option>

            </select>

          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div
            className="
              flex
              justify-center
              items-center
              py-20
            "
          >

            <p className="text-slate-400">
              Loading violations...
            </p>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          filteredViolations.length === 0 && (

            <div
              className="
                text-center
                py-20
              "
            >

              <ShieldAlert
                size={50}
                className="
                  mx-auto
                  text-slate-700
                  mb-4
                "
              />


              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-400
                "
              >
                No violations found
              </h2>


              <p
                className="
                  text-sm
                  text-slate-600
                  mt-2
                "
              >
                No violation matches your search
              </p>

            </div>

          )}


        {/* VIOLATION GRID */}

        {!loading &&
          filteredViolations.length > 0 && (

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
                gap-5
              "
            >

              {filteredViolations.map(
                (violation) => (

                  <ViolationCard

                    key={
                      violation._id ||
                      violation.id
                    }

                    violation={
                      violation
                    }

                    onViolationProcessed={
                      handleViolationProcessed
                    }

                  />

                )

              )}

            </div>

          )}

      </main>

    </div>

  );

};


export default AllViolations;