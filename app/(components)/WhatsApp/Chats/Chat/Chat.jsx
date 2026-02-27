import { Box } from "@mui/material";
import ChatNavbar from "./Navbar";
import ChattingPage from "./ChattingPage";

const Chat = ({ userID, contactPerson, messages, contactPersonId, contactPersonEmail, fromID, fromEmail }) => {
    return (<>

        <Box display='flex' width='65.8%' height='100vh' sx={{ minHeight: 0 }}>
            <Box display='flex' width='100%' flexDirection='column' sx={{ minHeight: 0 }}>
                <ChatNavbar contactPerson={contactPerson} userID={userID}/>
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