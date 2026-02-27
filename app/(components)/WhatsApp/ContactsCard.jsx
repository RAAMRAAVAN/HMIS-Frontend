import { Avatar, Box, Typography } from "@mui/material";

const ContactsCard = ({ userID,ID, selectionStatus, lastMessage }) => {
    console.log("Last messages=", lastMessage)
    return (<>
        <Box display='flex' width='100%' border={selectionStatus && '1px #21c063 solid'} borderRadius={5} sx={{
            backgroundColor: selectionStatus ? '#2e2f2f' : 'transparent',
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
                    <Typography color="gray" fontSize={15} fontWeight='bold'>{lastMessage}</Typography>
                </Box>
            </Box>
        </Box>
    </>);
}
export default ContactsCard;