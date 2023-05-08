import { Box, Chip, Stack, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { tokens } from '../app/theme';
import { ADMIN, getRelayChannel } from '../const/API';
import ButtonStyle from './ButtonStyle';
import RelayComponent from './RelayComponent';

const AdeComponent = (props) => {
    const relayId = props.relayId;
    const handleLink = props.handleLink;
    const handleUnlink = props.handleUnlink;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const currentHome = useSelector((state) => state.currentHome);

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
    }, [relayId]);

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
                    <Typography variant="h3" sx={{ ml: '5px', flex: '2' }}>
                        Relay
                    </Typography>
                    <RelayComponent channelId={relay._id} />
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

export default AdeComponent;
