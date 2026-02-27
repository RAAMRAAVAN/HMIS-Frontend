import { DataSaverOff, GroupsRounded, Margin, MarkUnreadChatAltRounded, SettingsRounded } from "@mui/icons-material";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

const LeftSlider = () => {
    const [selected, setSelected] = useState("Chats");
    
        const getButtonSx = (name) => ({
            marginTop: 1,
            fontSize: 32,
            backgroundColor: selected === name ? "#292a2a" : "transparent",
            "&:hover": {
                backgroundColor: "#292a2a",
            }
        });
    
        const getIconColor = (name) =>
            selected === name ? "#ffffff" : "#9e9e9e";
    return (<>
        <Box
            display='flex'
            width='4.2%'
            // border='1px white solid'
            alignItems='center'
            justifyContent='space-between'
            sx={{ backgroundColor: "#1d1f1f", flexDirection: 'column' }}
            paddingY={2}
        >
            <Box display='flex' flexDirection='column' alignItems='center'>

                {/* Chats */}
                <Tooltip
                    title="Chats"
                    placement="right"
                    slotProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                fontSize: 14,
                                fontWeight: 500,
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                            }
                        },
                        popper: {
                            modifiers: [
                                {
                                    name: "offset",
                                    options: { offset: [0, -8] },
                                },
                            ],
                        },
                    }}
                >
                    <IconButton
                        size="large"
                        onClick={() => setSelected("Chats")}
                        sx={getButtonSx("Chats")}
                    >
                        <MarkUnreadChatAltRounded
                            fontSize="inherit"
                            sx={{ color: getIconColor("Chats") }}
                        />
                    </IconButton>
                </Tooltip>

                {/* Status */}
                <Tooltip
                    title="Status"
                    placement="right"
                    slotProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                fontSize: 14,
                                fontWeight: 500,
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                            }
                        },
                        popper: {
                            modifiers: [
                                {
                                    name: "offset",
                                    options: { offset: [0, -8] },
                                },
                            ],
                        },
                    }}
                >
                    <IconButton 
                        size="large"
                        onClick={() => setSelected("Status")}
                        sx={getButtonSx("Status")}
                    >
                        <DataSaverOff
                            fontSize="inherit"
                            sx={{ color: getIconColor("Status") }}
                        />
                    </IconButton>
                </Tooltip>

                {/* Groups*/}
                <Tooltip
                    title="Groups"
                    placement="right"
                    slotProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                fontSize: 14,
                                fontWeight: 500,
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                            }
                        },
                        popper: {
                            modifiers: [
                                {
                                    name: "offset",
                                    options: { offset: [0, -8] },
                                },
                            ],
                        },
                    }}
                >
                    <IconButton 
                        size="large"
                        onClick={() => setSelected("Groups")}
                        sx={getButtonSx("Groups")}
                    >
                        <GroupsRounded
                            fontSize="inherit"
                            sx={{ color: getIconColor("Groups") }}
                        />
                    </IconButton>
                </Tooltip>

            </Box>

            {/* Bottom section */}
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Box mb={1}>
                    {/* Groups*/}
                <Tooltip
                    title="Settings"
                    placement="right"
                    slotProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                fontSize: 14,
                                fontWeight: 500,
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                            }
                        },
                        popper: {
                            modifiers: [
                                {
                                    name: "offset",
                                    options: { offset: [0, -8] },
                                },
                            ],
                        },
                    }}
                >
                    <IconButton 
                        size="large"
                        onClick={() => setSelected("Settings")}
                        sx={getButtonSx("Settings")}
                    >
                        <SettingsRounded
                            fontSize="inherit"
                            sx={{ color: getIconColor("Settings") }}
                        />
                    </IconButton>
                </Tooltip>
                </Box>

                <Avatar alt="Remy Sharp" src="/dummy.png" />
            </Box>

        </Box>
    </>);
}

export default LeftSlider;