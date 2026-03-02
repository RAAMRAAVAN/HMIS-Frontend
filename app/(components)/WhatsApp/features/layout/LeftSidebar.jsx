import { DataSaverOff, GroupsRounded, ManageAccountsRounded, MarkUnreadChatAltRounded, SettingsRounded } from "@mui/icons-material";
import { Avatar, Badge, Box, IconButton, Tooltip } from "@mui/material";

const LeftSidebar = ({ selected, onSelect, isAdmin, totalUnseenCount = 0 }) => {
    
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
            width={{ sm: 72, md: 80, xl: 60 }}
            minWidth={{ sm: 72, md: 80, xl: 60 }}
            alignItems='center'
            justifyContent='space-between'
            sx={{ backgroundColor: "#1d1f1f", flexDirection: 'column' }}
            paddingY={{ sm: 1.5, md: 2, xl: 3 }}
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
                        size="small"
                        onClick={() => onSelect("Chats")}
                        sx={getButtonSx("Chats")}
                    >
                        <Badge
                            color="success"
                            badgeContent={totalUnseenCount > 99 ? "99+" : totalUnseenCount}
                            invisible={totalUnseenCount <= 0}
                            overlap="circular"
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: 10,
                                    fontWeight: 700,
                                    minWidth: 18,
                                    height: 18,
                                    borderRadius: '999px',
                                    top: 5,
                                    right: -4,
                                },
                            }}
                        >
                            <MarkUnreadChatAltRounded
                                fontSize="inherit"
                                sx={{ color: getIconColor("Chats") }}
                            />
                        </Badge>
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
                        size="small"
                        onClick={() => onSelect("Status")}
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
                        size="small"
                        onClick={() => onSelect("Groups")}
                        sx={getButtonSx("Groups")}
                    >
                        <GroupsRounded
                            fontSize="inherit"
                            sx={{ color: getIconColor("Groups") }}
                        />
                    </IconButton>
                </Tooltip>

                {isAdmin ? (
                    <Tooltip
                        title="Manage Users"
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
                            size="small"
                            onClick={() => onSelect("Users")}
                            sx={getButtonSx("Users")}
                        >
                            <ManageAccountsRounded
                                fontSize="inherit"
                                sx={{ color: getIconColor("Users") }}
                            />
                        </IconButton>
                    </Tooltip>
                ) : null}

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
                        size="small"
                        onClick={() => onSelect("Settings")}
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

export default LeftSidebar;