'use client';

import {
    Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Box, Typography
} from "@mui/material";
import { useState } from "react";
import OTInput from "./OTInput";
import OTStatusCheckboxes from "./OTStatusCheckboxes";
import GenderAutocomplete from "./GenderAutocomplete";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";

const API_BASE_URL = getChatApiBaseUrl();

/* ------------------------------------------------------ */
/* 🔹 VALIDATION HELPERS                                  */
/* ------------------------------------------------------ */
const toUpper = (val = "") => val.toUpperCase();

const handleAge = (val = "") =>
    val.replace(/\D/g, "").slice(0, 2);

const formatUHID = (val = "") =>
    val.toUpperCase().replace(/[^A-Z0-9.]/g, "");

const isValidUHID = (val = "") =>
    /^[A-Z]{3}\d{2}\.\d{3,}$/.test(val);

export default function OTFormOccupied({ ...props }) {

    const {
        id,
        RevertCancelOT,
        is_cancelled,
        room_id,
        PatientName, setPatientName,
        UHID, setUHID,
        Age, setAge,
        Gender, setGender,
        Diagnosis, setDiagnosis,
        Surgeon, setSurgeon,
        isChanged,
        cancelOT,
        is_waiting,
        is_in_ot,
        is_surgery_started,
        is_under_preparation,
        is_surgery_completed,
        is_shifted_recovery,
        setWaiting,
        setOt,
        setPreparation,
        setSurgery,
        setSurgeryCompleted,
        setRecovery,
        fetchOTRooms,
        fetchLastEntry,
        completeOT,
        is_in_preop,
        setPreop
    } = props;

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const handleCancelClick = () => setOpenConfirm(true);

    /* ------------------------------------------------------ */
    /* 🔥 VALIDATION STATES                                   */
    /* ------------------------------------------------------ */
    const patientNameInvalid = !PatientName || PatientName.trim() === "";
    const uhidInvalid = UHID && !isValidUHID(UHID);

    /* ------------------------------------------------------ */
    /* 🔥 UPDATE API CALL                                     */
    /* ------------------------------------------------------ */
    const performUpdate = async () => {

        if (patientNameInvalid) {
            alert("Patient name cannot be empty");
            return;
        }

        if (uhidInvalid) {
            alert("Invalid UHID format.\nExpected: ABC01.123456789");
            return;
        }

        const res = await fetch(`${API_BASE_URL}/api/ot/ot-update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                entry_id: id,
                room_id,
                patient_name: PatientName.trim(),
                uhid: UHID,
                age: Age,
                gender: Gender,
                diagnosis: Diagnosis,
                surgeon: Surgeon,
                is_waiting,
                is_in_preop,
                is_in_ot,
                is_surgery_started,
                is_under_preparation,
                is_surgery_completed,
                is_shifted_recovery
            })
        });

        const data = await res.json();

        if (data.success) {
            setOpenSuccessDialog(true);
            fetchOTRooms();
            fetchLastEntry();
        } else {
            alert("Failed to update: " + data.error);
        }
    };

    return (
        <>
            {/* ---------------- SUCCESS DIALOG ---------------- */}
            <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
                <DialogTitle>Update Successful</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        OT details were updated successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSuccessDialog(false)}>OK</Button>
                </DialogActions>
            </Dialog>

            {/* ---------------- UPDATE CONFIRM ---------------- */}
            <Dialog open={openUpdateConfirm} onClose={() => setOpenUpdateConfirm(false)}>
                <DialogTitle>Update OT Details?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to update this OT entry?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdateConfirm(false)}>No</Button>
                    <Button
                        color="success"
                        onClick={() => {
                            setOpenUpdateConfirm(false);
                            performUpdate();
                        }}
                        // disabled={patientNameInvalid}
                    >
                        Yes, Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------------- FORM FIELDS ---------------- */}
            <Grid item xs={2}>
                <OTInput
                    is_cancelled={is_cancelled}
                    value={PatientName}
                    onChange={(e) => setPatientName(toUpper(e.target.value))}
                    placeholder="Patient Name"
                    label="Patient Name"
                    error={patientNameInvalid}
                    helperText={patientNameInvalid ? "Patient name is required" : ""}
                />
            </Grid>

            <Grid item xs={2}>
                <OTInput
                    is_cancelled={is_cancelled}
                    value={UHID}
                    onChange={(e) => setUHID(formatUHID(e.target.value))}
                    placeholder="UHID (ABC01.123456789)"
                    label="UHID"
                    error={uhidInvalid}
                    helperText={uhidInvalid ? "Format: ABC01.123456789" : ""}
                />
            </Grid>

            <Grid item xs={1}>
                <OTInput
                    is_cancelled={is_cancelled}
                    type="text"
                    value={Age}
                    onChange={(e) => setAge(handleAge(e.target.value))}
                    placeholder="Age"
                    label="Age"
                    inputProps={{ maxLength: 2 }}
                />
            </Grid>

            <Grid item xs={1}>
                <GenderAutocomplete
                    value={Gender}
                    is_cancelled={is_cancelled}
                    setValue={setGender}
                />
            </Grid>

            <Grid item xs={2}>
                <OTInput
                    is_cancelled={is_cancelled}
                    value={Diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Diagnosis"
                    label='Diagnosis'
                />
            </Grid>

            <Grid item xs={2}>
                <OTInput
                    is_cancelled={is_cancelled}
                    value={Surgeon}
                    onChange={(e) => setSurgeon(toUpper(e.target.value))}
                    placeholder="Surgeon Name"
                    label='Surgeon Name'
                />
            </Grid>

            {/* ---------------- BUTTONS ---------------- */}
            <Grid item xs={1}>
                {isChanged ? (
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => setOpenUpdateConfirm(true)}
                        disabled={patientNameInvalid}
                    >
                        Update
                    </Button>
                ) : (
                    <Button variant="contained" disabled={!(is_surgery_completed || is_cancelled)} color="warning" sx={{
                        "&.Mui-disabled": {
                            backgroundColor: "rgba(255, 193, 7, 0.35)",   // lighter yellow
                            color: "warning.contrastText",
                        }
                    }} fullWidth onClick={handleCancelClick}>
                        Discharge
                    </Button>
                )}
            </Grid>

            {/* ---------------- CANCEL OT ---------------- */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Cancel OT?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to close the case?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>No</Button>
                    <Button color="error" onClick={() => completeOT(id)}>Yes, Close</Button>
                </DialogActions>
            </Dialog>

            {/* ---------------- STATUS ---------------- */}
            <Grid item xs={12} display="flex" py={1}>
                <Box width="200px" p={1}>
                    <Typography color="#53e85a" fontWeight="bold">
                        Patient Status:
                    </Typography>
                </Box>

                <OTStatusCheckboxes
                    RevertCancelOT={RevertCancelOT}
                    is_cancelled={is_cancelled}
                    cancelOT={cancelOT}
                    id={id}
                    is_in_preop={is_in_preop}
                    setPreop={setPreop}
                    is_waiting={is_waiting} setWaiting={setWaiting}
                    is_under_preparation={is_under_preparation} setPreparation={setPreparation}
                    is_in_ot={is_in_ot} setOt={setOt}
                    is_surgery_started={is_surgery_started} setSurgery={setSurgery}
                    is_surgery_completed={is_surgery_completed} setSurgeryCompleted={setSurgeryCompleted}
                    is_shifted_recovery={is_shifted_recovery} setRecovery={setRecovery}
                    isChanged={isChanged}
                />
            </Grid>
        </>
    );
}






// const [openConfirm, setOpenConfirm] = useState(false);

    // 🔥 Update confirmation dialog
    // const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);

    // 🔥 SUCCESS dialog
    // const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

    
    // const handleClose = () => setOpenConfirm(false);

    // const handleConfirm = () => {
    //     setOpenConfirm(false);
    //     completeOT(id);
    // };

    // 🔥 UPDATE API CALL
    // const performUpdate = async () => {
    //     const res = await fetch("/api/ot-update", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             entry_id: id,
    //             room_id: room_id,
    //             patient_name: PatientName,
    //             uhid: UHID,
    //             age: Age,
    //             gender: Gender,
    //             diagnosis: Diagnosis,
    //             surgeon: Surgeon,
    //             is_waiting,
    //             is_in_preop,
    //             is_in_ot,
    //             is_surgery_started,
    //             is_under_preparation,
    //             is_surgery_completed,
    //             is_shifted_recovery
    //         })
    //     });

    //     const data = await res.json();

    //     if (data.success) {
    //         setOpenSuccessDialog(true);  // 🔥 SHOW SUCCESS POPUP
    //         fetchOTRooms();
    //         fetchLastEntry();
    //         // resetChanged();
    //     } else {
    //         alert("Failed to update: " + data.error);
    //     }
    // };
