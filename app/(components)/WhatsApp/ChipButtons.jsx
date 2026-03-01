'use client'

import { useState } from "react";
import { Chip, Stack } from "@mui/material";

const FilterChips = () => {

    const [selected, setSelected] = useState("All");

    const options = ["All", "Unreads", "Favourites", "Groups"];

    return (
        <Stack direction="row" spacing={1}>
            {options.map((item) => (
                <Chip
                    key={item}
                    label={item}
                    onClick={() => setSelected(item)}
                    sx={{
                        height: 34,                         // ← fixed chip height
                        lineHeight: "34px",                 // ← centers text vertically
                        padding: "0 1px",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        color: selected === item ? "#ffffff" : "#bfbfbf",
                        backgroundColor: selected === item ? "#103529" : "transparent",
                        border: selected === item
                            ? "none"
                            : "1px solid rgba(200,200,200,0.4)",

                        // 🔥 vertical padding here
                        '& .MuiChip-label, & .MuiChip-labelMedium': {
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            lineHeight: 1,
                            display: "inline-block",
                            transform: "scale(0.92, 1.25)",
                            transformOrigin: "center",
                            px: 2,
                            py: 0,
                        },

                        "&:hover": {
                            backgroundColor: selected === item
                                ? "#103529"
                                : "rgba(200,200,200,0.1)",
                        }
                    }}
                />
            ))}
        </Stack>
    );
};

export default FilterChips;
