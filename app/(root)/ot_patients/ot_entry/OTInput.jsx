'use client';
import { TextField } from "@mui/material";

const textFieldStyle = {
    height: "100%",

    /* ---------------- INPUT ROOT ---------------- */
    "& .MuiOutlinedInput-root": {
        height: "100%",
        alignItems: "center",

        "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "4px",

            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white !important",
            },

            "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "white !important",
                opacity: 1,
            },
        },
    },

    /* ---------------- INPUT TEXT ---------------- */
    "& .MuiInputBase-input": {
        padding: "10px",
        color: "white",
        height: "100%",
        boxSizing: "border-box",
    },

    /* ---------------- LABEL ---------------- */
    "& .MuiInputLabel-root": {
        color: "white",
    },

    "& .MuiInputLabel-root.Mui-focused": {
        color: "white",
    },

    "& .MuiInputLabel-root.Mui-disabled": {
        color: "white",
    },

    "& .MuiInputLabel-root.Mui-error": {
        color: "white",
    },

    /* ---------------- BORDER ---------------- */
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
    },
};


export default function OTInput({ is_cancelled, value, onChange, type = "text", placeholder="", label="default" }) {
    return (
        <TextField
            fullWidth
            disabled={is_cancelled}
            type={type}
            sx={textFieldStyle}
            placeholder={`${placeholder}`}
            value={value}
            onChange={onChange}
            label={label}
        />
    );
}
