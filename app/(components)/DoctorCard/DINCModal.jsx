'use client'
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DINCPage from './DINCPage'

const DINCModal = ({ open, handleClose, doctorDetails}) => {
    return (
        <Modal open={open} onClose={handleClose} sx={{borderRadius:'10px', maxWidth:"100vw"}}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                    width: { md: '60%', xs: '100%' },
                    maxHeight: '90vh', // Keeps modal within viewport height
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Fixed Close Button */}
                <Box 
                    sx={{
                        position: "sticky",
                        top: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        bgcolor: "background.paper",
                        zIndex: 10,
                        p: 1
                    }}
                >
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Scrollable Content */}
                <Box 
                    sx={{
                        overflowY: "auto",
                        maxHeight: "85vh", // Allow space for header
                    }}
                >
                    <DINCPage handleClose={handleClose} doctorDetails={doctorDetails}/>
                </Box>
            </Box>
        </Modal>
    );
}

export default DINCModal;
