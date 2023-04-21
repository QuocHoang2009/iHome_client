import { Box, Chip, FormControlLabel, Stack, Typography, useTheme } from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { tokens } from '../app/theme';
import { ADMIN, changeStateRelay, getRelayChannel } from '../const/API';
import ButtonStyle from './ButtonStyle';

const RelayComponent = (props) => {
    const relayId = props.relayId;
    const handleLink = props.handleLink;
    const handleUnlink = props.handleUnlink;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const home = useSelector((state) => state.home);
    const currentHome = useSelector((state) => state.currentHome);

    const [isReset, setIsReset] = useState(false);
    const [relay, setRelay] = useState();

    useEffect(() => {
        (async () => {
            if (relayId) {
                const apiGetRelay = getRelayChannel + relayId;
                const res = await axios.get(apiGetRelay);
                setRelay(res.data);
            } else {
                setRelay(null);
            }
        })();
    }, [relayId, isReset]);

    const handleChange = async () => {
        const api = changeStateRelay + relay?._id;
        const data = {
            mqttPath: home.mqttPath,
        };

        await axios
            .patch(api, {
                body: data,
            })
            .then((res) => {
                setIsReset(!isReset);
            })
            .catch((error) => {
                if (error?.response) {
                    console.log(error.response.data);
                } else {
                    console.log(error);
                }
            });
    };

    const linkButton = !relay && currentHome?.access === ADMIN;

    return (
        <Box>
            {relay && (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    height="56px"
                    borderRadius="10px"
                    sx={{ backgroundColor: colors.blueAccent[700], pl: '10px', pr: '10px' }}
                >
                    <Typography variant="h3" sx={{ ml: '5px', flex: '3' }}>
                        Relay
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={relay?.state} onChange={handleChange} />}
                        sx={{ flex: '1' }}
                    />
                    {currentHome?.access === ADMIN && (
                        <Chip label="Unlink" onClick={handleUnlink} sx={{ flex: '1' }} />
                    )}
                </Stack>
            )}
            {linkButton && (
                <ButtonStyle
                    width="100%"
                    height="48px"
                    handleClick={handleLink}
                    name="LINK RELAY"
                />
            )}
        </Box>
    );
};

export default RelayComponent;
