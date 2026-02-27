'use client';

import {
    Box, Button, Switch, Dialog,
    DialogActions, DialogContent,
    DialogContentText, DialogTitle,
    Typography
} from "@mui/material";
import { useState } from "react";

export default function OTStatusSwitches({
    RevertCancelOT,
    is_cancelled,
    cancelOT,
    id,

    is_waiting,
    is_in_preop, setPreop,
    is_under_preparation, setPreparation,
    is_in_ot, setOt,
    is_surgery_started, setSurgery,
    is_surgery_completed, setSurgeryCompleted,
    is_shifted_recovery, setRecovery,
    isChanged
}) {

    const toggle = (value, setter) => setter(value === 1 ? 0 : 1);
    const handleCancelClick = () => setOpenConfirm(true);
    const [openConfirm, setOpenConfirm] = useState(false);

    // ---------------- NORMALIZE STATE ----------------
    const cancelled = is_cancelled;

    const waiting = is_waiting;
    const preop = is_in_preop;
    const prep = is_under_preparation;
    // const inOT = is_in_ot;
    const started = is_surgery_started;
    const completed = is_surgery_completed;
    const recovery = is_shifted_recovery;

    // ---------------- WORKFLOW RULES ----------------
    // Forward-only, no skipping, no rollback after progress

    const disablePreOP =
        cancelled ||
        !waiting ||
        prep || started || completed || recovery;

    const disablePreparation =
        cancelled ||
        !preop ||
        started || completed || recovery;

    // const disableInOT =
    //     cancelled ||
    //     !prep ||
    //     started || completed || recovery;

    const disableStarted =
        cancelled ||
        completed || recovery || !prep;

    const disableCompleted =
        cancelled ||
        !started ||
        recovery;

    const disableRecovery =
        cancelled ||
        !completed;

    // ---- Switch style generator ----
    const switchColor = (color) => ({
        '& .MuiSwitch-switchBase.Mui-checked': { color },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: color,
        }
    });

    return (
        <Box display="flex" width="100%" justifyContent="space-between">

            {/* Cancel Confirmation Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Cancel OT?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this OT?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>No</Button>
                    <Button onClick={() => {
                        setOpenConfirm(false);
                        cancelOT(id);
                    }} color="error" autoFocus>
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Pre OP */}
            <Box display="flex" alignItems="center">
                <Typography color="yellow" fontWeight="bold">Pre OP</Typography>
                <Switch
                    checked={preop}
                    disabled={disablePreOP}
                    onChange={() => toggle(is_in_preop, setPreop)}
                    sx={switchColor("yellow")}
                    size="small"
                />
            </Box>

            {/* Preparation */}
            <Box display="flex" alignItems="center">
                <Typography color="pink" fontWeight="bold">Preparation</Typography>
                <Switch
                    checked={prep}
                    disabled={disablePreparation}
                    onChange={() => toggle(is_under_preparation, setPreparation)}
                    sx={switchColor("pink")}
                    size="small"
                />
            </Box>

            {/* In OT */}
            {/* <Box display="flex" alignItems="center">
                <Typography color="orange" fontWeight="bold">In OT</Typography>
                <Switch
                    checked={inOT}
                    disabled={disableInOT}
                    onChange={() => toggle(is_in_ot, setOt)}
                    sx={switchColor("orange")}
                    size="small"
                />
            </Box> */}

            {/* Surgery Ongoing */}
            <Box display="flex" alignItems="center">
                <Typography color="orange" fontWeight="bold">Surgery Ongoing</Typography>
                <Switch
                    checked={started}
                    disabled={disableStarted}
                    onChange={() => toggle(is_surgery_started, setSurgery)}
                    sx={switchColor("orange")}
                    size="small"
                />
            </Box>

            {/* Surgery Completed */}
            <Box display="flex" alignItems="center">
                <Typography color="#53e85a" fontWeight="bold">Surgery Completed</Typography>
                <Switch
                    checked={completed}
                    disabled={disableCompleted}
                    onChange={() => toggle(is_surgery_completed, setSurgeryCompleted)}
                    sx={switchColor("#53e85a")}
                    size="small"
                />
            </Box>

            {/* Recovery */}
            <Box display="flex" alignItems="center">
                <Typography color="violet" fontWeight="bold">Recovery/ Post OP</Typography>
                <Switch
                    checked={recovery}
                    disabled={disableRecovery}
                    onChange={() => toggle(is_shifted_recovery, setRecovery)}
                    sx={switchColor("violet")}
                    size="small"
                />
            </Box>

            {/* Cancel / Revert */}
            <Box display="flex" alignItems="center">
                {is_cancelled ? (
                    <Button
                        color="secondary"
                        variant="contained"
                        sx={{
                            borderRadius: "20px",
                            "&.Mui-disabled": {
                                backgroundColor: "rgba(244, 67, 54, 0.35)",
                                color: "rgba(255,255,255,0.55)",
                            },
                        }}
                        onClick={() => RevertCancelOT(id)}
                    >
                        Revert Surgery Cancellation
                    </Button>
                ) : (
                    <Button
                        color="error"
                        disabled={is_surgery_completed || isChanged}
                        variant="contained"
                        sx={{
                            borderRadius: "20px",
                            "&.Mui-disabled": {
                                backgroundColor: "rgba(244, 67, 54, 0.35)",
                                color: "rgba(255,255,255,0.55)",
                            },
                        }}
                        onClick={handleCancelClick}
                    >
                        Cancel Surgery
                    </Button>
                )}
            </Box>
        </Box>
    );
}


// const toggle = (value, setter) => setter(value === 1 ? 0 : 1);
//     const [openConfirm, setOpenConfirm] = useState(false);

//     const handleCancelClick = () => setOpenConfirm(true);
//     const handleClose = () => setOpenConfirm(false);

//     const handleConfirm = () => {
//         setOpenConfirm(false);
//         cancelOT(id);
//     };
