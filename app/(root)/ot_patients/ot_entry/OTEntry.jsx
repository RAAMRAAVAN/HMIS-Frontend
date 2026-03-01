'use client';
import { Grid, Typography, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

import OTFormOccupied from "./OTFormOccupied";
import OTFormNew from "./OTFormNew";
import OTStatusCheckboxes from "./OTStatusCheckboxes";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";

const API_BASE_URL = getChatApiBaseUrl();

export function convertToISTDate(inputDate) {
    const date = new Date(inputDate);

    const options = { timeZone: "Asia/Kolkata" };

    const day = date.toLocaleString("en-IN", { day: "2-digit", ...options });
    const month = date.toLocaleString("en-IN", { month: "2-digit", ...options });
    const year = date.toLocaleString("en-IN", { year: "numeric", ...options });

    return `${day}-${month}-${year}`;
}

export function convertTo12HourFormat(timeStr) {
    // timeStr format: "HH:MM:SS"
    let [hour, minute] = timeStr.split(":");

    hour = parseInt(hour, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 → 12

    return `${String(hour).padStart(2, "0")}:${minute} ${ampm}`;
}



export default function OTEntry({ ot_room, fetchOTRooms }) {
    const [originalData, setOriginalData] = useState({});
    const [occupency_status, setOccupencyStatus] = useState(ot_room.occupancy_status);
    const [newAdmission, setNewAdmission] = useState(!ot_room.occupancy_status);

    // const [entry_id, setEntryID] = useState(null);
    const [PatientName, setPatientName] = useState("");
    const [UHID, setUHID] = useState("");
    const [Age, setAge] = useState("");
    const [Gender, setGender] = useState();
    const [Diagnosis, setDiagnosis] = useState("");
    const [Surgeon, setSurgeon] = useState("");

    const [is_waiting, setWaiting] = useState(0);
    const [is_in_preop, setPreop] = useState(0);
    const [is_under_preparation, setPreparation] = useState(0);
    const [is_in_ot, setOt] = useState(0);
    const [is_surgery_started, setSurgery] = useState(0);
    const [is_surgery_completed, setSurgeryCompleted] = useState(0);
    const [is_shifted_recovery, setRecovery] = useState(0);
    const [is_cancelled, setCancelled] = useState(0);
    // const [disableCancellation, setDisableCancellation] = useState(0);

    const isChanged =
        PatientName !== originalData.patient_name ||
        UHID !== originalData.uhid ||
        Age !== originalData.age || Gender !== originalData.gender ||
        Diagnosis !== originalData.diagnosis ||
        Surgeon !== originalData.surgeon || is_waiting !== originalData.is_waiting ||
        is_in_preop !== originalData.is_in_preop ||
        is_in_ot !== originalData.is_in_ot ||
        is_surgery_started !== originalData.is_surgery_started ||
        is_under_preparation !== originalData.is_under_preparation ||
        is_surgery_completed !== originalData.is_surgery_completed ||
        is_shifted_recovery !== originalData.is_shifted_recovery;

    useEffect(() => {
        if (ot_room.occupancy_status) fetchLastEntry();
    }, []);

    const fetchLastEntry = async () => {
        const res = await fetch(`${API_BASE_URL}/api/ot/ot-entries/${ot_room.room_id}`);
        const data = await res.json();

        if (data.success && data.data) {
            setOriginalData(data.data);

            setPatientName(data.data.patient_name);
            setUHID(data.data.uhid);
            setAge(data.data.age);
            setGender(data.data.gender)
            setDiagnosis(data.data.diagnosis);
            setSurgeon(data.data.surgeon);

            setWaiting(data.data.is_waiting);
            setPreop(data.data.is_in_preop);
            setPreparation(data.data.is_under_preparation);
            setOt(data.data.is_in_ot);
            setSurgery(data.data.is_surgery_started);
            setSurgeryCompleted(data.data.is_surgery_completed);
            setRecovery(data.data.is_shifted_recovery);
            setCancelled(data.data.is_cancelled);
        }
    };

    const addDetails = async () => {
        const res = await fetch(`${API_BASE_URL}/api/ot/ot-entry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                room_id: ot_room.room_id,
                PatientName,
                UHID,
                Age,
                Gender,
                Diagnosis,
                Surgeon
            })
        });

        const data = await res.json();
        if (data.success) {
            fetchOTRooms();
            fetchLastEntry();
            setOccupencyStatus(!occupency_status);
        }
    };


    const cancelOT = async (id) => {
        await fetch(`${API_BASE_URL}/api/ot/cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room_id: ot_room.room_id, entry_id: id })
        });

        // setOccupencyStatus(false);
        // setNewAdmission(true);
        // setPatientName("");
        // setUHID("");
        // setAge("");
        // setDiagnosis("");
        // setSurgeon("");
        fetchLastEntry();
        fetchOTRooms();
    };

    const RevertCancelOT = async (id) => {
        await fetch(`${API_BASE_URL}/api/ot/revert-cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room_id: ot_room.room_id, entry_id: id })
        });

        // setOccupencyStatus(false);
        // setNewAdmission(true);
        // setPatientName("");
        // setUHID("");
        // setAge("");
        // setDiagnosis("");
        // setSurgeon("");
        fetchLastEntry();
        fetchOTRooms();
    };

    const completeOT = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ot/discharge`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ room_id: ot_room.room_id, entry_id: id })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Something went wrong while discharging OT");
            }

            // Success flow
            setOccupencyStatus(false);
            setNewAdmission(true);
            setPatientName("");
            setUHID("");
            setAge("");
            setGender("Male");
            setDiagnosis("");
            setSurgeon("");
            setCancelled(0);

            fetchOTRooms();
            // fetchLastEntry();

        } catch (error) {
            console.error("OT discharge failed:", error);
            alert(`Error: ${error.message || "Failed to complete OT"}`);
        }
    };


    return (
        <Grid container marginY={1}>
            <Grid container spacing={1} boxShadow={2} padding={1} borderRadius={2} sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",   // Light transparent background
                backdropFilter: "blur(10px)",                 // Blur effect
                WebkitBackdropFilter: "blur(10px)",           // Safari support
            }}>
                {is_cancelled ? <Box display='flex' width='100%' height='100%' position='absolute' justifyContent='center' alignItems='center' >
                    <Typography color="#8B0000" fontWeight='bold' textAlign='center' fontSize='50px' borderTop='3px #8B0000 solid' sx={{
                        transform: "rotate(-7deg)",
                        display: "inline-block", // important for rotation
                    }} borderBottom='3px #8B0000 solid'>Surgery Cancelled</Typography>
                </Box> : <></>}

                {occupency_status && originalData.admission_date ? <Box display='flex' width='100%' paddingX={2}>
                    <Typography color="white" fontWeight='bold'>Admission Date & Time: </Typography>
                    <Typography color="white" marginLeft={1}>{convertToISTDate(originalData.admission_date)}/ {convertTo12HourFormat(originalData.admission_time)}</Typography>
                </Box> : <></>}
                {/* OT ROOM NAME */}
                <Grid item xs={1} display="flex" justifyContent="center" alignItems="center">
                    <Typography border="1px solid white" borderRadius={1} width="100%" color="white" textAlign="center" height='100%' justifyContent='center' alignItems='center' display='flex'>
                        {ot_room.room_name}
                    </Typography>
                </Grid>

                {occupency_status ? (
                    <OTFormOccupied
                        id={originalData.entry_id}
                        RevertCancelOT={RevertCancelOT}
                        is_cancelled={is_cancelled}
                        room_id={ot_room.room_name}
                        PatientName={PatientName} setPatientName={setPatientName}
                        UHID={UHID} setUHID={setUHID}
                        Age={Age} setAge={setAge}
                        Diagnosis={Diagnosis} setDiagnosis={setDiagnosis}
                        Surgeon={Surgeon} setSurgeon={setSurgeon}
                        isChanged={isChanged}
                        Gender={Gender} setGender={setGender}
                        cancelOT={cancelOT}
                        // handleUpdate={handleUpdate}
                        is_waiting={is_waiting}
                        is_in_ot={is_in_ot}
                        is_in_preop={is_in_preop}
                        setPreop={setPreop}
                        is_under_preparation={is_under_preparation}
                        is_surgery_started={is_surgery_started}
                        is_surgery_completed={is_surgery_completed}
                        is_shifted_recovery={is_shifted_recovery}
                        setWaiting={setWaiting}
                        setOt={setOt}
                        setPreparation={setPreparation}
                        setSurgery={setSurgery}
                        setSurgeryCompleted={setSurgeryCompleted}
                        setRecovery={setRecovery}
                        fetchOTRooms={fetchOTRooms}
                        fetchLastEntry={fetchLastEntry}
                        completeOT={completeOT}
                    />
                ) : newAdmission ? (
                    <Grid item xs={11}>
                        <Button variant="contained" color="success" onClick={() => setNewAdmission(false)}>
                            New Admission
                        </Button>
                    </Grid>
                ) : (
                    <OTFormNew
                        PatientName={PatientName} setPatientName={setPatientName}
                        UHID={UHID} setUHID={setUHID}
                        Age={Age} setAge={setAge}
                        Gender={Gender} setGender={setGender}
                        Diagnosis={Diagnosis} setDiagnosis={setDiagnosis}
                        Surgeon={Surgeon} setSurgeon={setSurgeon}
                        addDetails={addDetails}
                        setNewAdmission={setNewAdmission}
                    />
                )}
            </Grid>
        </Grid>
    );
}
