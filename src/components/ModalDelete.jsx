import { Box, Button, Modal, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "../app/theme";

const ModalDelete = (props)=>{
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
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    minWidth: "250px",
                }}
            >
                <Typography variant="h4" color={colors.greenAccent[400]}>
                     {props.name} ?
                </Typography>
                <Stack direction="row" justifyContent="space-between" paddingTop="10px">
                    <Button onClick={handleClose} variant="contained">Cancel</Button>
                    <Button onClick={props.handleDelete} variant="contained">Continue</Button>
                </Stack>
            </Box>
        </Modal>
    )
}

export default ModalDelete;