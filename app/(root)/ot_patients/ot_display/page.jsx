'use client';

import { useEffect, useState } from 'react';
import io from "socket.io-client";
import { Grid, Card, CardContent, Typography, Box, Chip, Divider, Stack } from '@mui/material';

console.log("🟢 LIVE OT DASHBOARD FILE LOADED");
const API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000";

// ⚠️ Create socket lazily to avoid duplicate connections
let socket;

export default function LiveOTDashboard() {

  const [otRooms, setOtRooms] = useState([]);

  /* ---------- INITIAL FETCH ---------- */
  const fetchOTRooms = async () => {
    console.log("📡 Fetching OT Rooms...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/ot/ot-rooms`);
      const rooms = await res.json();

      console.log("📥 Rooms received:", rooms);

      const roomsWithEntries = await Promise.all(
        rooms?.data?.map(async (room) => {

          console.log(`➡ Checking room ${room.room_id}, occupied =`, room.occupancy_status);

          if (room.occupancy_status !== false) {
            const resEntry = await fetch(`${API_BASE_URL}/api/ot/ot-entries/${room.room_id}`);
            const entryData = await resEntry.json();

            console.log(`📥 Entry for room ${room.room_id}:`, entryData);

            return { ...room, lastEntry: entryData.data };
          }

          return { ...room, lastEntry: null };
        }) ?? []
      );

      console.log("✅ Final rooms state:", roomsWithEntries);

      setOtRooms(roomsWithEntries);

    } catch (err) {
      console.error('❌ Error fetching OT rooms:', err);
    }
  };

  useEffect(() => {

    console.log("🔥 useEffect triggered — initializing...");

    fetchOTRooms();

    if (!socket) {
      console.log("🔌 Connecting to socket server...");

      socket = io(API_BASE_URL, {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("🟢 SOCKET CONNECTED:", socket.id);
      });

      socket.on("disconnect", () => {
        console.warn("🔴 SOCKET DISCONNECTED");
      });

      socket.on("connect_error", (err) => {
        console.error("⚠️ SOCKET CONNECTION ERROR:", err);
      });
    }

    /* ---------- SOCKET LISTENER ---------- */
    const handler = (event) => {
      console.log("📩 OT EVENT RECEIVED:", event);
      fetchOTRooms();
      // setOtRooms(prevRooms => {
      //   console.log("📦 Previous state:", prevRooms);

      //   const updated = prevRooms.map(room => {

      //     if (room.room_id !== event.room_id) return room;

      //     console.log(`🎯 Updating room ${room.room_id} for event ${event.type}`);

      //     switch (event.type) {

      //       case "NEW_ADMISSION":
      //       case "UPDATE": console.log("Working update");
      //         return {
      //           ...room,
      //           occupancy_status: 1,
      //           lastEntry: event.data
      //         };

      //       case "DISCHARGE":
      //         return {
      //           ...room,
      //           occupancy_status: 0,
      //           lastEntry: null
      //         };

      //       case "CANCEL":
      //         return {
      //           ...room,
      //           lastEntry: {
      //             ...room.lastEntry,
      //             is_cancelled: 1
      //           }
      //         };

      //       default:
      //         console.warn("🤷 Unknown event:", event);
      //         return room;
      //     }
      //   });

      //   console.log("🆕 Updated state:", updated);

      //   return updated;
      // });
    };

    socket.on("ot_update", handler);

    return () => {
      console.log("🧹 Cleaning up listeners...");
      socket?.off("ot_update", handler);
    };

  }, []);

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom align="center">
        Live OT Dashboard
      </Typography>

      <Grid container spacing={3}>
        {otRooms.map(room => {
          const status = resolveStatus(room.lastEntry);

          return (
            <Grid item xs={12} sm={6} md={4} key={room.room_id}>
              <Card elevation={6}>
                <CardContent>

                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Typography variant="h6">
                      {room.room_name || `Room ${room.room_id}`}
                    </Typography>

                    <Chip
                      label={room.occupancy_status ? "Occupied" : "Empty"}
                      color={room.occupancy_status ? "error" : "success"}
                      size="small"
                    />
                  </Stack>

                  <Divider sx={{ mb: 1 }} />

                  {room.lastEntry ? (
                    <Stack spacing={0.5}>
                      <Typography><strong>Patient:</strong> {room.lastEntry.patient_name}</Typography>
                      <Typography><strong>UHID:</strong> {room.lastEntry.uhid}</Typography>

                      <Box display="flex">
                        <Typography><strong>Age:</strong> {room.lastEntry.age} Years</Typography>
                        <Typography ml={5}><strong>Sex:</strong> {room.lastEntry.gender}</Typography>
                      </Box>

                      <Typography><strong>Surgeon:</strong> {room.lastEntry.surgeon}</Typography>
                      <Typography><strong>Diagnosis:</strong> {room.lastEntry.diagnosis}</Typography>

                      <Box mt={1}>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Stack>
                  ) : (
                    <Typography color="textSecondary">No active patient</Typography>
                  )}

                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}


/* ---------------- UTILITIES ---------------- */

function convertToISTDate(inputDate) {}
function convertTo12HourFormat(timeStr) {}

const resolveStatus = (entry) => {
  if (!entry) return { label: 'No Active', color: 'default' };
  if (entry.is_cancelled) return { label: 'OT Cancelled', color: 'error' };
  if (entry.is_shifted_recovery) return { label: 'Recovery/ Post OP', color: 'secondary' };
  if (entry.is_surgery_completed) return { label: 'Surgery Completed', color: 'success' };
  if (entry.is_surgery_started) return { label: 'Surgery Ongoing', color: 'warning' };
  if (entry.is_under_preparation) return { label: 'Under Preparation', color: 'primary' };
  if (entry.is_in_preop) return { label: 'Pre OP', color: 'info' };
  if (entry.is_waiting) return { label: 'Waiting', color: 'default' };
  return { label: 'Unknown', color: 'default' };
};
