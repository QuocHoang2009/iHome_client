import { Box, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { tokens } from "../../app/theme";
import HeaderChild from '../../components/HeaderChild';

const ContactsPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <HeaderChild title="Contacts Information"/>
            <Accordion>
                <AccordionSummary>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        Mail: iHome_develop@gmail.com
                    </Typography>
                </AccordionSummary>
            </Accordion>

            <Accordion>
                <AccordionSummary>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        Phone Number: +84 12345678
                    </Typography>
                </AccordionSummary>
            </Accordion>
            
            <Accordion>
                <AccordionSummary>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        Adress: Ho Chi Minh City
                    </Typography>
                </AccordionSummary>
            </Accordion>
        </Box>
    )
};

export default ContactsPage;