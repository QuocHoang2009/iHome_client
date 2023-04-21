import merge from 'lodash/merge';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { tokens } from '../app/theme';

// ----------------------------------------------------------------------

export default function useChart(options) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const LABEL_TOTAL = {
        show: true,
        label: 'Total',
        color: colors.greenAccent[400],
        fontSize: theme.typography.h2.fontSize,
        fontWeight: theme.typography.subtitle2.fontWeight,
        lineHeight: theme.typography.subtitle2.lineHeight,
    };

    const LABEL_VALUE = {
        offsetY: 8,
        color: colors.greenAccent[400],
        fontSize: theme.typography.h3.fontSize,
        fontWeight: theme.typography.h3.fontWeight,
        lineHeight: theme.typography.h3.lineHeight,
    };

    const baseOptions = {
        // Colors
        colors: [
            colors.greenAccent[400],
            colors.greenAccent[400],
            colors.greenAccent[400],
            colors.greenAccent[400],
            colors.greenAccent[400],
            colors.greenAccent[400],
            colors.greenAccent[400],
            colors.greenAccent[400],
            colors.greenAccent[400],
        ],

        // Chart
        chart: {
            toolbar: { show: true },
            zoom: { enabled: true },
            // animations: { enabled: false },
            foreColor: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
        },

        // States
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                    value: 0.04,
                },
            },
            active: {
                filter: {
                    type: 'darken',
                    value: 0.88,
                },
            },
        },

        // Fill
        fill: {
            opacity: 1,
            gradient: {
                type: 'vertical',
                shadeIntensity: 0,
                opacityFrom: 0.4,
                opacityTo: 0,
                stops: [0, 100],
            },
        },

        // Datalabels
        dataLabels: { enabled: false },

        // Stroke
        stroke: {
            width: 3,
            curve: 'smooth',
            lineCap: 'round',
        },

        // Grid
        grid: {
            strokeDashArray: 3,
            borderColor: colors.greenAccent[400],
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },

        // Xaxis
        xaxis: {
            axisBorder: { show: false },
            axisTicks: { show: true },
        },

        // Markers
        markers: {
            size: 0,
            strokeColors: colors.primary[500],
        },

        // Tooltip
        tooltip: {
            x: {
                show: true,
            },
            theme: 'dark',
        },

        // Legend
        legend: {
            show: true,
            fontSize: String(13),
            position: 'top',
            horizontalAlign: 'right',
            markers: {
                radius: 12,
            },
            fontWeight: 500,
            itemMargin: { horizontal: 12 },
            labels: {
                colors: colors.greenAccent[400],
            },
        },

        // plotOptions
        plotOptions: {
            // Bar
            bar: {
                borderRadius: 4,
                columnWidth: '28%',
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
            },

            // Pie + Donut
            pie: {
                donut: {
                    labels: {
                        show: true,
                        value: LABEL_VALUE,
                        total: LABEL_TOTAL,
                    },
                },
            },

            // Radialbar
            radialBar: {
                track: {
                    strokeWidth: '100%',
                    background: alpha(theme.palette.grey[500], 0.16),
                },
                dataLabels: {
                    value: LABEL_VALUE,
                    total: LABEL_TOTAL,
                },
            },

            // Radar
            radar: {
                polygons: {
                    fill: { colors: ['transparent'] },
                    strokeColors: colors.primary[500],
                    connectorColors: colors.primary[500],
                },
            },

            // polarArea
            polarArea: {
                rings: {
                    strokeColor: colors.primary[500],
                },
                spokes: {
                    connectorColors: colors.primary[500],
                },
            },
        },

        // Responsive
        responsive: [
            {
                // sm
                breakpoint: theme.breakpoints.values.sm,
                options: {
                    plotOptions: { bar: { columnWidth: '40%' } },
                },
            },
            {
                // md
                breakpoint: theme.breakpoints.values.md,
                options: {
                    plotOptions: { bar: { columnWidth: '32%' } },
                },
            },
        ],
    };

    return merge(baseOptions, options);
}
