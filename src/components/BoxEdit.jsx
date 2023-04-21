import { Box, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "../app/theme";

const BoxEdit = (props)=>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {title, children} = props;

    return(
        <Box sx={{
            background: `${colors.primary[400]}`,
            padding: "10px",
            width: "100%"
        }}>
            <Stack direction="row" justifyContent="space-between">
                <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 5px" }}
                >
                    {title}
                </Typography>

                {props?.button && (
                    <Box
                        width="150px"
                        height="40px"
                        m="0"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        backgroundColor={colors.greenAccent[600]}
                        borderRadius="4px"
                        onClick={()=> props.buttonHandle()}
                        sx={{
                        ":hover":{
                            cursor: "pointer",
                            opacity: 0.8
                        }
                        }}
                    >
                        <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                            {props?.button}
                        </Typography>
                    </Box>
                )}
            </Stack>
            
            {children}
        </Box>
    )
}

export default BoxEdit;