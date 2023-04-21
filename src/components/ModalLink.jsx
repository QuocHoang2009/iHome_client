import { Box, Modal, Typography, useTheme } from "@mui/material";
import { tokens } from "../app/theme";

const ModalLink = (props)=>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleClose = ()=> props.handleModal(false);
    
    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: 100,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h5" color={colors.greenAccent[400]}>
                    All Relays
                </Typography>
                
            </Box>
        </Modal>
    )
}

export default ModalLink;