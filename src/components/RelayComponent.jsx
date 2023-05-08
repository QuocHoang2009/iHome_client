import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { changeStateRelay, getRelayChannel } from '../const/API';

const RelayComponent = (props) => {
    const { channelId } = props;

    const home = useSelector((state) => state.home);

    const [channel, setChannel] = useState(null);
    const [isReset, setIsReset] = useState(false);

    useEffect(() => {
        (async () => {
            if (channelId) {
                const api = getRelayChannel + channelId;
                const res = await axios.get(api);
                if (res.data) {
                    setChannel(res.data);
                }
            } else {
                setChannel(null);
            }
        })();
    }, [channelId, isReset]);

    const handleChange = async () => {
        const api = changeStateRelay + channel?._id;
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

    return (
        <Box>
            <LightbulbIcon
                color={channel?.state ? 'success' : 'disabled'}
                onClick={handleChange}
                sx={{
                    flex: '1',
                    fontSize: '55px',
                    ':hover': {
                        cursor: 'pointer',
                        opacity: 0.9,
                    },
                }}
            />
        </Box>
    );
};

export default RelayComponent;
