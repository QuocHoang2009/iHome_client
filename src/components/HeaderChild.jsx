import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../app/theme';

const HeaderChild = ({ title, subtitle, addButton, buttonHandle, variant }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box mb="30px" display="flex" justifyContent="space-between">
            <Box>
                <Typography
                    variant={variant ? variant : 'h2'}
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: '0 0 5px 0' }}
                >
                    {title}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[400]}>
                    {subtitle}
                </Typography>
            </Box>

            {addButton && (
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
                    onClick={() => buttonHandle()}
                    sx={{
                        ':hover': {
                            cursor: 'pointer',
                            opacity: 0.8,
                        },
                    }}
                >
                    <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                        {addButton}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default HeaderChild;
