import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';
import { getSumCosts, getTotalSumCosts } from 'services/category';
import { getUserCurrency } from 'services/users';

const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
    const theme = useTheme();

    const [user_currency, setUserCurrency] = useState(' ');
    useEffect(() => {
        const fetchData = async () => {
            setUserCurrency(await getUserCurrency());
        };
        fetchData();
    }, []);
    const [total_sum_costs, setTotalSumCosts] = useState(' ');
    useEffect(() => {
        const fetchData = async () => {
            setTotalSumCosts(await getTotalSumCosts());
        };
        fetchData();
    }, []);

    const customization = useSelector((state) => state.customization);
    const [chartDataMy, setChartDataMy] = useState(chartData);
    const [categories, setCategories] = useState([
        {
            name: 'Продукти',
            data: [468]
        },
        {
            name: 'Комуналка',
            data: [0, 1312]
        },
        {
            name: 'Бензин',
            data: [0, 0, 1500]
        },
        {
            name: 'Подарунки',
            data: [0, 0, 0, 800]
        }
    ]);

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSumCosts();
            const series = data.map((item, index) => {
                return { name: item.category_name, data: [...Array(index).fill(0), item.category_quantity] };
            });
            const xaxisCategories = series.map((item) => item.name);
            const newData = chartData;
            newData.series = series;
            newData.options.xaxis.categories = xaxisCategories;
            setCategories(series);
            setChartDataMy(newData);
            console.log(newData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const newChartData = {
            ...chartDataMy.options,
            colors: [primary200, primaryDark, secondaryMain, primary, darkLight, grey200],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: grey200
            },
            tooltip: {
                theme: 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            }
        };

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500, categories]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Total costs for the month</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">
                                                {total_sum_costs} {user_currency}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartDataMy} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
