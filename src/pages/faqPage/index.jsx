import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { tokens } from "../../app/theme";
import HeaderChild from '../../components/HeaderChild';

const questions = [
    {
        question: "An Important Question",
        reply: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
    },
    {
        question: "Another Important Question",
        reply: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
    },
    {
        question: "Your Favorite Questionx",
        reply: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
    },
    {
        question: "The Final Question",
        reply: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
    }
]

const FAQPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <HeaderChild  title="FAQ" subtitle="Frequently Asked Questions Page" />
            
            {questions.map(({question, reply}, index)=>{
                return (
                    <Accordion defaultExpanded key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            {question}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                            {reply}
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </Box>
    )
};

export default FAQPage;