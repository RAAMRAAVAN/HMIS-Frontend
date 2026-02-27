'use client';

import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '98vw',
  height: '95vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  outline: 'none',
  borderRadius: 2,
};

const FeedbackModal = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle} position="relative" border='1px black solid'>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <CloseIcon sx={{fontSize:40}}/>
        </IconButton>

        <iframe
          // src="/Page/index.html"
          src='https://accfapp.in/feedback_form_kiosk?form_type=IPD&&code=1'
          title="Feedback Kiosk"
          style={{ width: '100%', height: '97%', marginTop:'40px' }}
        />
      </Box>
    </Modal>
  );
};

export default FeedbackModal;
