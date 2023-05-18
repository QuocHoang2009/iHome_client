import AirOutlinedIcon from '@mui/icons-material/AirOutlined';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import { Box, Chip, Stack, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { tokens } from '../app/theme';
import { ADMIN, getSensorInfo, host, nodeApi } from '../const/API';
import ButtonStyle from './ButtonStyle';
import CardCustom from './CardCustom';

const SensorComponent = (props) => {
    const { sensorId, handleLink, handleUnlink } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const currentHome = useSelector((state) => state.currentHome);

    const [sensor, setSensor] = useState();
    const [value, setValue] = useState();

    useEffect(() => {
        (async () => {
            if (sensorId) {
                const apiGetSensor = nodeApi + sensorId;
                const res = await axios.get(apiGetSensor);
                if (res.data) {
                    res.data.airquality = res.data.airquality * 10000;
                    setSensor(res.data?.node);
                }
            } else {
                setSensor(null);
            }
        })();
    }, [sensorId]);

    useEffect(() => {
        const socket = io.connect(host);

        socket.on(`changeSensor/${sensor?.address}`, (data) => {
            setSensor(data);
        });
    }, [sensor]);

    useEffect(() => {
        (async () => {
            if (sensor) {
                const apiGetSensor = getSensorInfo + sensor?.address;
                const res = await axios.get(apiGetSensor);
                setValue(res.data);
            } else {
                setSensor(null);
            }
        })();
    }, [sensor]);

    const linkButton = !sensor && currentHome?.access === ADMIN;

    return (
        <Box>
            {sensor && (
                <Stack borderRadius="10px" sx={{ backgroundColor: colors.blueAccent[700] }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        height="56px"
                        sx={{ pl: '10px', pr: '10px' }}
                    >
                        <Typography variant="h3" sx={{ ml: '5px', flex: '3' }}>
                            Sensor
                        </Typography>
                        {currentHome?.access === ADMIN && (
                            <Chip label="Unlink" onClick={handleUnlink} sx={{ flex: '1' }} />
                        )}
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing="2px"
                        width="100%"
                        padding="16px"
                    >
                        <CardCustom
                            title="Temperature"
                            value={value?.temp.toFixed(2) + ' °C'}
                            Icon={<DeviceThermostatIcon sx={{ fontSize: '60px' }} />}
                        />
                        <CardCustom
                            title="Humidity"
                            value={value?.humidity.toFixed(2) + ' %'}
                            Icon={<WaterDropOutlinedIcon sx={{ fontSize: '60px' }} />}
                        />
                        <CardCustom
                            title="Air quality"
                            value={value?.airquality.toFixed(5) + ' ppm'}
                            Icon={<AirOutlinedIcon sx={{ fontSize: '60px' }} />}
                        />
                    </Stack>
                </Stack>
            )}
            {linkButton && (
                <ButtonStyle
                    width="100%"
                    height="48px"
                    handleClick={handleLink}
                    name="LINK SENSOR"
                />
            )}
        </Box>
    );
};

export default SensorComponent;
