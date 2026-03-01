'use client';

import { Box, Button, Typography, TextField, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { convertToISTDate, convertTo12HourFormat } from '../ot_entry/OTEntry';
import { exportToExcel } from "./exportToExcel";
import { Download } from "@mui/icons-material";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";

const API_BASE_URL = getChatApiBaseUrl();

const OTReport = () => {
    const [otRooms, setOtRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const router = useRouter();

    const fetchOTRooms = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/ot/ot-entries`);
            const data = await res.json();
            setOtRooms(data.data);
            setFilteredRooms(data.data);
        } catch (err) {
            alert("Error loading OT Rooms");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOTRooms();
    }, []);

    const columns = [
        { label: "Admit Date", width: 120, key: "admission_date" },
        { label: "Admit Time", width: 120, key: "admission_time" },
        { label: "Entry ID", width: 120, key: "entry_id" },
        { label: "OT Room", width: 120, key: "room_id" },
        { label: "Patient Name", width: 300, key: "patient_name" },
        { label: "UHID", width: 200, key: "uhid" },
        { label: "Age", width: 80, key: "age" },
        { label: "Gender", width: 120, key: "gender" },
        { label: "Diagnosis", width: 400, key: "diagnosis" },
        { label: "Surgeon Name", width: 220, key: "surgeon" },
        { label: "Waiting", width: 120, key: "is_waiting" },
        { label: "Pre OP", width: 180, key: "is_in_preop" },
        { label: "Under Preparation", width: 180, key: "is_under_preparation" },
        // { label: "In OT", width: 150, key: "is_in_OT" },
        { label: "Surgery Started", width: 200, key: "is_surgery_started" },
        { label: "Surgery Completed", width: 200, key: "is_surgery_completed" },
        { label: "Recovery", width: 150, key: "is_shifted_recovery" },
        { label: "Cancelled", width: 150, key: "is_cancelled" },
        { label: "Discharge Status", width: 180, key: "discharge_date" },
        { label: "Discharge Date", width: 180, key: "discharge_date" },
        { label: "Discharge Time", width: 180, key: "discharge_time" },
    ];

    // Handle filter change
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value.toLowerCase() };
        setFilters(newFilters);

        const filtered = otRooms.filter(room => {
            return columns.every(col => {
                const filterValue = newFilters[col.key] || "";
                if (!filterValue) return true;

                let roomValue = room[col.key];
                if (col.key === "admission_date" || col.key === "discharge_date") {
                    roomValue = roomValue ? convertToISTDate(roomValue) : "";
                }
                if (col.key === "admission_time" || col.key === "discharge_time") {
                    roomValue = roomValue ? convertTo12HourFormat(roomValue) : "";
                }
                if (typeof roomValue === "boolean") {
                    roomValue = roomValue ? "yes" : "no";
                }
                if (!roomValue) roomValue = "";

                return roomValue.toString().toLowerCase().includes(filterValue);
            });
        });

        setFilteredRooms(filtered);
        setPage(1); // reset to first page on filter change
    };

    // Pagination slice
    const paginatedRooms = filteredRooms.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <>
            {/* FIXED HEADER */}
            <Box
                display="flex"
                width="100%"
                height="60px"
                position="fixed"
                top={0}
                left={0}
                sx={{
                    backgroundColor: "#230239",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 6px 12px #df117d",
                    zIndex: 9999,
                }}
            >
                <Typography
                    textAlign="center"
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "white",
                    }}
                >
                    OT Dashboard Report
                </Typography>
                <Button
                    onClick={() => router.push("/ot_patients/ot_entry")}
                    style={{ position: 'absolute', zIndex: 100, right: 30, borderRadius: '20px' }}
                    variant="contained"
                >
                    Dashboard Entry
                </Button>
            </Box>

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    backgroundColor: '#230239',
                    minHeight: '95vh',
                    mt: '60px',
                    overflowX: 'auto',
                    padding: 2
                }}
            >
                {/* HEADER ROW + FILTERS */}
                <Box display="flex" flexDirection="column" sx={{ minWidth: '3200px', whiteSpace: 'nowrap', mb: 1 }}>
                    <Box display="flex">
                        {columns.map((col, index) => (
                            <Box key={index} width={col.width} padding={1}>
                                <Typography fontWeight="bold" color="white" fontSize={18}>
                                    {col.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <Box display="flex">
                        {columns.map((col, index) => (
                            <Box key={index} width={col.width} padding={0.5}>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder="Filter"
                                    fullWidth
                                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "white" },
                                            "&:hover fieldset": { borderColor: "white" },
                                            "&.Mui-focused fieldset": { borderColor: "white" },
                                        },
                                        "& .MuiInputBase-input": { color: "white" },
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* DATA ROWS */}
                <Box display="flex" flexDirection="column" sx={{ minWidth: '3200px' }}>
                    {paginatedRooms.map((room, index) => (
                        <Box
                            key={index}
                            display="flex"
                            sx={{
                                backgroundColor: index % 2 === 0 ? '#2a0240' : '#230239',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <Box width={120} padding={1}><Typography color="white" textAlign='center'>{room.admission_date && convertToISTDate(room.admission_date)}</Typography></Box>
                            <Box width={120} padding={1}><Typography color="white" textAlign='center'>{room.admission_time && convertTo12HourFormat(room.admission_time)}</Typography></Box>
                            <Box width={120} padding={1}><Typography color="white" textAlign='center'>{room.entry_id}</Typography></Box>
                            <Box width={120} padding={1}><Typography color="white" textAlign='center'>OT - {room.room_id}</Typography></Box>
                            <Box width={300} padding={1}><Typography color="white">{room.patient_name}</Typography></Box>
                            <Box width={200} padding={1}><Typography color="white">{room.uhid}</Typography></Box>
                            <Box width={80} padding={1}><Typography color="white" textAlign='center'>{room.age}</Typography></Box>
                            <Box width={120} padding={1}><Typography color="white" textAlign='center'>{room.gender}</Typography></Box>
                            <Box width={400} padding={1}><Typography color="white">{room.diagnosis}</Typography></Box>
                            <Box width={220} padding={1}><Typography color="white">{room.surgeon}</Typography></Box>
                            <Box width={120} padding={1}><Typography color="white" textAlign='center'>{room.is_waiting ? 'Yes' : 'No'}</Typography></Box>
                            <Box width={180} padding={1}><Typography color="white" textAlign='center'>{room.is_in_preop ? 'Yes' : 'No'}</Typography></Box>
                            <Box width={180} padding={1}><Typography color="white" textAlign='center'>{room.is_under_preparation ? 'Yes' : 'No'}</Typography></Box>
                            {/* <Box width={150} padding={1}><Typography color="white" textAlign='center'>{room.is_in_ot ? 'Yes' : 'No'}</Typography></Box> */}
                            <Box width={200} padding={1}><Typography color="white" textAlign='center'>{room.is_surgery_started ? 'Yes' : 'No'}</Typography></Box>
                            <Box width={200} padding={1}><Typography color="white" textAlign='center'>{room.is_surgery_completed ? 'Yes' : 'No'}</Typography></Box>
                            <Box width={150} padding={1}><Typography color="white" textAlign='center'>{room.is_shifted_recovery ? 'Yes' : 'No'}</Typography></Box>
                            <Box width={150} padding={1}><Typography color="white" textAlign='center'>{room.is_cancelled ? 'Yes' : 'No'}</Typography></Box>
                            <Box width={180} padding={1}><Typography color="white" textAlign='center'>{room.discharge_date ? 'Discharged' : 'Admitted'}</Typography></Box>
                            <Box width={180} padding={1}><Typography color="white" textAlign='center'>{room.discharge_date && convertToISTDate(room.discharge_date)}</Typography></Box>
                            <Box width={180} padding={1}><Typography color="white" textAlign='center'>{room.discharge_time && convertTo12HourFormat(room.discharge_time)}</Typography></Box>
                        </Box>
                    ))}
                </Box>

                {/* PAGINATION */}
                <Box
                    display="flex"
                    justifyContent="center"
                    position="absolute"
                    bottom={30}
                    left="50%"
                    sx={{ transform: 'translateX(-50%)' }}
                >
                    <Pagination
                        count={Math.ceil(filteredRooms.length / rowsPerPage)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'white',          // text color
                                fontSize: '1.2rem',      // increase size
                                fontWeight: 'bold',
                                backgroundColor: '#2a0240', // default item bg
                                borderRadius: '8px',
                                margin: '0 4px',
                                minWidth: '40px',
                                height: '40px',
                                transition: 'all 0.3s',
                            },
                            '& .MuiPaginationItem-root:hover': {
                                backgroundColor: '#df117d',
                                color: 'white',
                                transform: 'scale(1.1)',
                            },
                            '& .MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: '#df117d', // selected item bg
                                color: 'white',              // selected text color
                                fontWeight: 'bold',
                                transform: 'scale(1.1)',
                            },
                            '& .MuiPagination-ul': {
                                gap: '8px',
                            },
                        }}
                    />
                </Box>


                {/* FIXED EXPORT BUTTON */}
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        zIndex: 9999,
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "green",
                            "&:hover": { backgroundColor: "#006400" },
                            color: "white",
                        }}
                        startIcon={<Download />}
                        onClick={() => exportToExcel(filteredRooms)}
                    >
                        Export to Excel
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default OTReport;
