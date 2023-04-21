import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { tokens } from "../../app/theme";
import Form from "./Form";

const LoginPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={colors.primary[400]}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography fontWeight="bold" fontSize="32px" color={colors.grey[100]}>
                    iHome
                </Typography>
            </Box>

            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={colors.primary[400]}
            >
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Welcome to iHome!
                </Typography>
                <Form />
            </Box>
        </Box>
    )
};

export default LoginPage;