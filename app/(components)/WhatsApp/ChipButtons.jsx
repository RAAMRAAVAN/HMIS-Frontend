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
                        padding: "0 3px",
                        fontWeight: 600,
                        fontSize: 17,
                        color: selected === item ? "#ffffff" : "#bfbfbf",
                        backgroundColor: selected === item ? "#103529" : "transparent",
                        border: selected === item
                            ? "none"
                            : "1px solid rgba(200,200,200,0.4)",

                        // 🔥 vertical padding here
                        '& .MuiChip-label': {
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
