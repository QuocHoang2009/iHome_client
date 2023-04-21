import { Box, useTheme } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { tokens } from '../app/theme';
import HeaderChild from './HeaderChild';
import useChart from './useChart';

const ChartComponent = (props) => {
    const { title, subtitle, width, chartData, chartLabels, unit } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const chartOptions = useChart({
        plotOptions: { bar: { columnWidth: '16%' } },
        fill: { type: chartData.map((i) => i.fill) },
        labels: chartLabels,
        xaxis: { type: 'datetime' },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                        return `${y.toFixed(3)} ` + unit;
                    }
                    return y;
                },
            },
        },
    });

    return (
        chartData && (
            <Box
                padding="16px"
                width={width && width}
                borderRadius="10px"
                sx={{ backgroundColor: colors.primary[400] }}
            >
                <HeaderChild title={title} subtitle={subtitle} variant="h4" />
                <Box dir="ltr">
                    <ReactApexChart
                        type="line"
                        series={chartData}
                        options={chartOptions}
                        height={364}
                    />
                </Box>
            </Box>
        )
    );
};

export default ChartComponent;
