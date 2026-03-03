import { useRef, useState } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Avatar, Box, ClickAwayListener, IconButton, Popper, Typography } from "@mui/material";
import ChatSettingsMenu from "../features/chats/settings/ChatSettingsMenu";
import { formatLastSeenLabel } from "@/utils/chatTime";
import { resolveChatAssetUrl } from "@/utils/chatAssetUrl";

const ContactCard = ({ userID,ID, selectionStatus, lastMessage, unseenCount = 0, isOnline = false, lastSeen = null, avatarSrc = "" }) => {
    const showUnread = unseenCount > 0 && !selectionStatus;
    const [settingsOpen, setSettingsOpen] = useState(false);
    const buttonRef = useRef(null);
    const lastSeenLabel = formatLastSeenLabel({ isOnline, lastSeen });

    return (<>
        <Box display='flex' width='100%' border={selectionStatus && '1px #21c063 solid'} borderRadius={5} sx={{
            backgroundColor: selectionStatus ? '#2e2f2f' : (showUnread ? '#1f2d22' : 'transparent'),
            alignItems: 'center',
            position: 'relative',
            '&:hover .contact-dropdown-btn': {
                opacity: 1,
                visibility: 'visible',
                pointerEvents: 'auto',
            }
        }}>
            <Box padding={1}>
                <Avatar alt={userID} src={resolveChatAssetUrl(avatarSrc)} sx={{ width: 55, height: 55 }} />
            </Box>
            <Box display='flex' flexDirection='column' width='78%' height='100%' justifyContent='center' minWidth={0}>
                <Box display='flex' justifyContent='space-between' width='100%' color='white'>
                    <Typography fontSize={16}>{userID}</Typography>
                    <Box display='flex' flexDirection='column' alignItems='flex-end' lineHeight={1}>
                        <Typography color="gray" fontSize={11} fontWeight='bold' noWrap sx={{ maxWidth: 170 }}>
                            {lastSeenLabel}
                        </Typography>
                        
                    </Box>
                </Box>
                <Box display='flex' justifyContent='space-between' width='100%' color='white' minWidth={0} alignItems='center' gap={1}>
                    <Typography
                        color={showUnread ? "#25D366" : "gray"}
                        fontSize={12}
                        fontWeight='bold'
                        noWrap
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {lastMessage}
                    </Typography>
                    {showUnread ? (
                        <Box
                            sx={{
                                minWidth: 22,
                                height: 22,
                                borderRadius: '50%',
                                backgroundColor: '#25D366',
                                color: '#111',
                                fontSize: 10,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                px: 0.5,
                            }}
                        >
                            {unseenCount > 99 ? '99+' : unseenCount}
                        </Box>
                    ) : null}

                    <IconButton
                            className="contact-dropdown-btn"
                            ref={buttonRef}
                            size="small"
                            disableRipple
                            disableFocusRipple
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSettingsOpen(prev => !prev);
                            }}
                            onTouchStart={(e) => e.stopPropagation()}
                            sx={{
                                color: '#bfbfbf',
                                mt: 0.2,
                                p: 0.2,
                                backgroundColor: 'transparent',
                                opacity: settingsOpen ? 1 : 0,
                                visibility: settingsOpen ? 'visible' : 'hidden',
                                pointerEvents: settingsOpen ? 'auto' : 'none',
                                transition: 'opacity 0.15s ease',
                                '&:hover': { backgroundColor: 'transparent' },
                                '&:active': { backgroundColor: 'transparent' },
                                '&.Mui-focusVisible': { backgroundColor: 'transparent' }
                            }}
                        >
                            <KeyboardArrowDown sx={{ fontSize: 18, transform: 'scaleX(1.1)' }} />
                        </IconButton>

                        <Popper
                            open={settingsOpen}
                            anchorEl={buttonRef.current}
                            placement="right-start"
                            disablePortal={false}
                            modifiers={[
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [30, -20],
                                    },
                                },
                                {
                                    name: 'flip',
                                    enabled: false,
                                },
                            ]}
                            sx={{ zIndex: 20000 }}
                        >
                            <ClickAwayListener onClickAway={() => setSettingsOpen(false)}>
                                <Box
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                >
                                    <ChatSettingsMenu onClose={() => setSettingsOpen(false)} setUserID={() => {}} />
                                </Box>
                            </ClickAwayListener>
                        </Popper>
                </Box>
            </Box>

        </Box>
    </>);
}
export default ContactCard;