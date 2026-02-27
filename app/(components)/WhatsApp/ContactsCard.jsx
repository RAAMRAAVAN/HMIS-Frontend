import { Avatar, Box, Typography } from "@mui/material";

const ContactsCard = ({ userID,ID, selectionStatus, lastMessage, unseenCount = 0 }) => {
    const showUnread = unseenCount > 0 && !selectionStatus;
    return (<>
        <Box display='flex' width='100%' border={selectionStatus && '1px #21c063 solid'} borderRadius={5} sx={{
            backgroundColor: selectionStatus ? '#2e2f2f' : (showUnread ? '#1f2d22' : 'transparent'),
            alignItems: 'center'
        }}>
            <Box padding={2}>
                <Avatar alt={userID} src="/dummy.png" sx={{ width: 55, height: 55 }} />
            </Box>
            <Box display='flex' flexDirection='column' width='80%' height='100%' justifyContent='center'>
                <Box display='flex' justifyContent='space-between' width='100%' color='white'>
                    <Typography fontSize={20}>{userID}</Typography>
                    <Typography color="gray" fontSize={15} fontWeight='bold'>Friday</Typography>
                </Box>
                <Box display='flex' justifyContent='space-between' width='100%' color='white'>
                    <Typography color={showUnread ? "#25D366" : "gray"} fontSize={15} fontWeight='bold'>
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
                                fontSize: 12,
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
                </Box>
            </Box>
        </Box>
    </>);
}
export default ContactsCard;