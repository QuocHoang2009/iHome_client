import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../app/theme";

const ButtonStyle = (props)=>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    return(
        <Box
            width={props.width}
            height={props.height}
            m="0"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={props?.handleClick}
            backgroundColor={colors.greenAccent[600]}
            borderRadius="4px"
            sx={{
            ":hover":{
                cursor: "pointer",
                opacity: 0.8
            }
            }}
        >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                {props.name}
            </Typography>
        </Box>
    )
}

export default ButtonStyle;