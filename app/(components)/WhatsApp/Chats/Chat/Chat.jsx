import { Box } from "@mui/material";
import ChatNavbar from "./Navbar";
import ChattingPage from "./ChattingPage";

const Chat = ({ userID, contactPerson, messages, contactPersonId, contactPersonEmail, fromID, fromEmail, contactIsOnline = false, contactLastSeen = null, isMobile = false, onBack }) => {
    return (<>

        <Box
            display='flex'
            width={isMobile ? '100%' : { sm: '58%', md: '64%', lg: '70%', xl: '74%' }}
            height='100dvh'
            sx={{ minHeight: 0, flex: 1 }}
        >
            <Box display='flex' width='100%' flexDirection='column' sx={{ minHeight: 0 }}>
                <ChatNavbar
                    contactPerson={contactPerson}
                    userID={userID}
                    isOnline={contactIsOnline}
                    lastSeen={contactLastSeen}
                    showBack={isMobile}
                    onBack={onBack}
                />
                <ChattingPage
                    userID={userID}
                    contactPerson={contactPerson}
                    messages={messages}
                    contactPersonId={contactPersonId}
                    contactPersonEmail={contactPersonEmail}
                    fromID={fromID}
                    fromEmail={fromEmail}
                />
            </Box>
        </Box>
    </>);
}
export default Chat;