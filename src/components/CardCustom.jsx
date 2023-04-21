import { Stack, Typography, useTheme } from '@mui/material';
import { tokens } from '../app/theme';

const CardCustom = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const title = props.title;
    const value = props.value;
    const Icon = props.Icon;

    return (
        <Stack
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            spacing="16px"
            width="32%"
            paddingTop="16px"
            paddingBottom="16px"
            borderRadius="15px"
            sx={{ backgroundColor: colors.primary[400], pl: '10px', pr: '10px' }}
        >
            {Icon}
            {value && (
                <Typography variant="h3" sx={{ ml: '5px', flex: '3' }}>
                    {value}
                </Typography>
            )}
            <Typography variant="h4" sx={{ ml: '5px', flex: '3' }}>
                {title}
            </Typography>
        </Stack>
    );
};

export default CardCustom;
