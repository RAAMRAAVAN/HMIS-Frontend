import { Box } from "@mui/material";
import ChatNavbar from "./Navbar";
import ChattingPage from "./ChattingPage";

const Chat = ({ userID, contactPerson, messages, contactPersonsID, fromID, onLocalSend }) => {
    return (<>

        <Box display='flex' width='65.8%' >
            <Box display='flex' width='100%' flexDirection='column'>
                <ChatNavbar contactPerson={contactPerson} userID={userID}/>
                <ChattingPage
                    userID={userID}
                    contactPerson={contactPerson}
                    messages={messages}
                    contactPersonsID={contactPersonsID}
                    fromID={fromID}
                    onLocalSend={onLocalSend}
                />
            </Box>
        </Box>
    </>);
}
export default Chat;