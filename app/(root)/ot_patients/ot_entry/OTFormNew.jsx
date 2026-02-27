'use client';
import { Grid, Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import OTInput from "./OTInput";
import GenderAutocomplete from "./GenderAutocomplete";

export default function OTFormNew({
    PatientName, setPatientName,
    UHID, setUHID,
    Age, setAge,
    Diagnosis, setDiagnosis,
    Surgeon, setSurgeon,
    Gender, setGender,
    addDetails,
    setNewAdmission
}) {

    // 🔹 Auto uppercase name
    const handlePatientNameChange = (e) => {
        setPatientName(e.target.value.toUpperCase());
    };

    // 🔹 Auto uppercase surgeon name
    const handleSurgeonChange = (e) => {
        setSurgeon(e.target.value.toUpperCase());
    };

    // 🔹 Age: only numbers, max 2 digits
    const handleAgeChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // remove non-numeric
        if (value.length <= 2) {
            setAge(value);
        }
    };

    // 🔹 UHID: xyz01.120002671 format
    const handleUHIDChange = (e) => {
        let value = e.target.value.toUpperCase();

        // Allow only alphanumeric + dot
        value = value.replace(/[^A-Z0-9.]/g, '');

        // Optional length restriction (recommended)
        if (value.length <= 20) {
            setUHID(value);
        }
    };

    // 🔹 UHID pattern check before submit
    const isUHIDValid = /^[A-Z]{3}\d{2}\.\d{4,}$/i.test(UHID);

    const handleSubmit = () => {
        if (!PatientName || !Age || !Gender || !Surgeon) {
            alert("Please fill all required fields");
            return;
        }

        if (!isUHIDValid) {
            alert("UHID format should be: XYZ01.120002671");
            return;
        }

        addDetails();
    };

    return (
        <>
            <Grid item xs={2}>
                <OTInput
                    value={PatientName}
                    onChange={handlePatientNameChange}
                    placeholder="Enter Patient's Name"
                    label='Patient Name'
                />
            </Grid>

            <Grid item xs={2}>
                <OTInput
                    value={UHID}
                    onChange={handleUHIDChange}
                    placeholder="Enter UHID (XYZ01.1200021671)"
                    label='UHID'
                    error={UHID && !isUHIDValid}
                    helperText={UHID && !isUHIDValid ? "Format: XYZ01.120002671" : ""}
                />
            </Grid>

            <Grid item xs={1}>
                <OTInput
                    value={Age}
                    onChange={handleAgeChange}
                    placeholder="Age"
                    label='Age'
                    inputProps={{ maxLength: 2 }}
                />
            </Grid>

            <Grid item xs={1}>
                <GenderAutocomplete
                    value={Gender}
                    setValue={setGender}
                    is_cancelled={0}
                />
            </Grid>

            <Grid item xs={2}>
                <OTInput
                    value={Diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter Diagnosis"
                    label='Diagnosis'
                />
            </Grid>

            <Grid item xs={2}>
                <OTInput
                    value={Surgeon}
                    onChange={handleSurgeonChange}
                    placeholder="Enter Surgeon Name"
                    label='Surgeon Name'
                />
            </Grid>

            <Grid item xs={1} display="flex" position="relative">
                <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={handleSubmit}
                >
                    Submit
                </Button>

                <IconButton
                    color="error"
                    onClick={() => setNewAdmission(true)}
                    sx={{ position: "absolute", right: -40, top: 5 }}
                >
                    <Delete />
                </IconButton>
            </Grid>
        </>
    );
}
