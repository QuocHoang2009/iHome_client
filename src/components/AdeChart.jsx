import { Stack, useTheme } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { tokens } from '../app/theme';
import { getAdeInfor, host } from '../const/API';
import ChartComponent from './ChartComponent';
import HeaderChild from './HeaderChild';

const AdeChart = (props) => {
    const { address, title } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [data, setData] = useState([]);
    const [time, setTime] = useState([]);

    useEffect(() => {
        (async () => {
            if (address) {
                const apiGetADE = getAdeInfor + address;
                const res = await axios.get(apiGetADE);
                if (res.data) {
                    setData(res.data);
                    setTime(
                        res.data?.map((data) => {
                            return data?.createdAt;
                        }),
                    );
                }
            } else {
                setTime([]);
                setData([]);
            }
        })();
    }, [address]);

    useEffect(() => {
        const socket = io.connect(host);
        socket.on(`changeAde/${address}`, (adeUpdate) => {
            setData([...data, adeUpdate]);
            setTime([...time, adeUpdate?.createdAt]);
        });
    }, [address, time, data]);

    const powerData = [
        {
            name: 'Power',
            type: 'area',
            fill: 'gradient',
            data: data && data?.map((data) => data.power.toFixed(2)),
        },
    ];

    const vrmsData = [
        {
            name: 'Vrms',
            type: 'area',
            fill: 'gradient',
            data: data && data?.map((data) => data.vrms.toFixed(2)),
        },
    ];

    const irmsData = [
        {
            name: 'Irms',
            type: 'area',
            fill: 'gradient',
            data: data && data?.map((data) => data.irms.toFixed(3)),
        },
    ];

    const showAde = address && data?.length !== 0;

    return (
        showAde && (
            <Stack
                spacing="16px"
                padding="16px"
                borderRadius="10px"
                sx={{ backgroundColor: colors.blueAccent[700] }}
            >
                <HeaderChild title={title ? title : 'ADE Information'} variant="h3" />
                <ChartComponent
                    title="Power Consumption"
                    unit="W"
                    chartData={powerData}
                    chartLabels={time}
                />
                <Stack direction="row" spacing="16px">
                    <ChartComponent
                        title="Volt"
                        unit="V"
                        width="50%"
                        chartData={vrmsData}
                        chartLabels={time}
                    />
                    <ChartComponent
                        title="Current"
                        unit="A"
                        width="50%"
                        chartData={irmsData}
                        chartLabels={time}
                    />
                </Stack>
            </Stack>
        )
    );
};

export default AdeChart;
