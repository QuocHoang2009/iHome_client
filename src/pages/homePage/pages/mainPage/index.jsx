import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../../../app/theme';
import AdeChart from '../../../../components/AdeChart';
import HeaderChild from '../../../../components/HeaderChild';
import ModalDelete from '../../../../components/ModalDelete';
import RelayComponent from '../../../../components/RelayComponent';
import RelaysDialog from '../../../../components/RelaysDialog';
import {
    USER,
    changeStateRelay,
    getAllRooms,
    getHome,
    getRelayChannel,
    linkHome,
    unLinkHome,
} from '../../../../const/API';

const DASHBOARD = 'Dashboard';
const ROOMSPAGE = 'Rooms';

const MainPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const currentHome = useSelector((state) => state.currentHome);

    const [home, setHome] = useState(useSelector((state) => state.home));
    const [rooms, setRooms] = useState([]);
    const [channel, setChannel] = useState();
    const [isReset, setIsReset] = useState(false);
    const [selectedValueLink, setSelectedValueLink] = useState();
    const [openModalLinkRelay, setOpenModalLinkRelay] = useState(false);
    const [openModalUnlinkRelay, setOpenModalUnlinkRelay] = useState(false);
    // const [openModalLinkSensor, setOpenModalLinkSensor] = useState(false);
    // const [openModalUnlinkSensor, setOpenModalUnlinkSensor] = useState(false);
    const [tab, setTab] = useState(DASHBOARD);

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'name',
            headerName: 'Name',
            flex: 3,
            renderCell: ({ row: { name } }) => {
                return (
                    <Box
                        sx={{
                            ':hover': {
                                cursor: 'pointer',
                            },
                        }}
                    >
                        {name}
                    </Box>
                );
            },
        },
        {
            field: 'state',
            headerName: 'State',
            flex: 1,
            renderCell: ({ row: { relay, state } }) => {
                return (
                    <Box>
                        {relay && (
                            // <FormControlLabel value={state} control={<Switch checked={state} />} />
                            <LightbulbIcon />
                        )}
                    </Box>
                );
            },
        },
    ];

    useEffect(() => {
        (async () => {
            if (home?._id) {
                const api = getHome + home?._id;
                const res = await axios.get(api);
                if (res.data) setHome(res.data);
            }
        })();
    }, [home?._id, isReset, currentHome]);

    useEffect(() => {
        (async () => {
            if (home?._id) {
                const res = await axios.get(getAllRooms + home?._id);
                setRooms(res.data.rooms);
            }

            if (currentHome?.access === USER) {
                if (currentHome?.rooms.length !== 0) navigate('/rooms');
                else setTab(ROOMSPAGE);
            }
        })();
    }, [home?._id, navigate, currentHome]);

    useEffect(() => {
        (async () => {
            if (home?.relay) {
                const api = getRelayChannel + home?.relay;
                const res = await axios.get(api);
                if (res.data) setChannel(res.data);
            }
        })();
    }, [home?.relay]);

    const handleEdit = () => {
        navigate('/home/edit');
    };

    const handleClickOpenModalLinkRelay = () => {
        setOpenModalLinkRelay(true);
    };

    const handleCloseModalLinkRelay = async (value) => {
        setOpenModalLinkRelay(false);
        if (value) {
            setSelectedValueLink(value);
            const data = {
                home: home._id,
                relay: value.channels[value.channel - 1]._id,
            };

            await axios
                .patch(linkHome, {
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
        }
    };

    const handleUnlinkHomeRelay = async () => {
        const data = {
            home: home._id,
            relayChannel: home.relay,
        };
        await axios
            .patch(unLinkHome, { body: data })
            .then((res) => {
                setIsReset((prev) => !prev);
                console.log(res.data);
            })
            .catch((error) => {
                if (error?.response) {
                    console.log(error.response.data);
                } else {
                    console.log(error);
                }
            });
        setOpenModalUnlinkRelay(false);
    };

    const handleUnlinkRelay = () => {
        setOpenModalUnlinkRelay(true);
    };

    // const handleClickOpenModalLinkSensor = () => {
    //     setOpenModalLinkSensor(true);
    // };

    // const handleUnlinkSensor = () => {
    //     setOpenModalUnlinkSensor(true);
    // };

    // const handleCloseModalLinkSensor = async (value) => {
    //     setOpenModalLinkSensor(false);
    //     if (value) {
    //         setSelectedValueLink(value);

    //         const data = {
    //             home: home?._id,
    //             sensor: value._id,
    //         };

    //         await axios
    //             .patch(linkHomeSensor, {
    //                 body: data,
    //             })
    //             .then((res) => {
    //                 setIsReset(!isReset);
    //             })
    //             .catch((error) => {
    //                 if (error?.response) {
    //                     console.log(error.response.data);
    //                 } else {
    //                     console.log(error);
    //                 }
    //             });
    //     }
    // };

    // const handleUnlinkHomeSensor = async () => {
    //     const data = {
    //         home: home._id,
    //         sensor: home.sensor,
    //     };
    //     await axios
    //         .patch(unLinkHomeSensor, { body: data })
    //         .then((res) => {
    //             setIsReset((prev) => !prev);
    //             console.log(res.data);
    //         })
    //         .catch((error) => {
    //             if (error?.response) {
    //                 console.log(error.response.data);
    //             } else {
    //                 console.log(error);
    //             }
    //         });
    //     setOpenModalUnlinkSensor(false);
    // };

    const handleChangeTab = (_, value) => {
        setTab(value);
    };

    const handleChangeState = async (room) => {
        const data = {
            mqttPath: home?.mqttPath + '/control',
            relay: room.relay,
            id: room._id,
            state: !room.state,
        };

        const api = changeStateRelay + room.relay;

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

    const handleClick = (params) => {
        if (params.field === 'name') {
            navigate('/rooms/' + params.row._id);
        } else if (params.field === 'state') {
            if (params.row.relay) {
                handleChangeState(params.row);
            }
        }
    };

    return (
        <Box m="20px">
            <HeaderChild
                title={home?.name}
                subtitle="Information Home"
                addButton={currentHome?.access !== USER && 'Edit Home'}
                buttonHandle={handleEdit}
            />
            <Tabs
                value={tab}
                onChange={handleChangeTab}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
                sx={{ mb: '16px' }}
            >
                <Tab value={DASHBOARD} label="Dashboard" />
                <Tab value={ROOMSPAGE} label="Rooms" />
            </Tabs>

            {openModalUnlinkRelay && (
                <ModalDelete
                    open={openModalUnlinkRelay}
                    handleModal={setOpenModalUnlinkRelay}
                    name={'Unlink Relay'}
                    handleDelete={handleUnlinkHomeRelay}
                />
            )}
            {/* {openModalUnlinkSensor && (
                <ModalDelete
                    open={openModalUnlinkSensor}
                    handleModal={setOpenModalUnlinkSensor}
                    name={'Unlink Sensor'}
                    handleDelete={handleUnlinkHomeSensor}
                />
            )} */}

            {tab === DASHBOARD ? (
                <Stack direction="column" spacing="16px" width="100%">
                    <RelayComponent
                        relayId={home?.relay}
                        handleLink={handleClickOpenModalLinkRelay}
                        handleUnlink={handleUnlinkRelay}
                    />
                    {/* <SensorComponent
                        sensorId={home?.sensor}
                        handleLink={handleClickOpenModalLinkSensor}
                        handleUnlink={handleUnlinkSensor}
                    /> */}
                    <AdeChart address={channel?.address} />
                </Stack>
            ) : (
                <Box
                    m="16px 0 0 0"
                    height="50vh"
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                        },
                        '& .name-column--cell': {
                            color: colors.greenAccent[300],
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: colors.blueAccent[700],
                            borderBottom: 'none',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: colors.primary[400],
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                            backgroundColor: colors.blueAccent[700],
                        },
                        '& .MuiCheckbox-root': {
                            color: `${colors.greenAccent[200]} !important`,
                        },
                    }}
                >
                    <DataGrid
                        rows={rooms?.map((room, index) => {
                            return {
                                ...room,
                                id: index + 1,
                            };
                        })}
                        columns={columns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        onCellClick={handleClick}
                    />
                </Box>
            )}

            <RelaysDialog
                selectedValue={selectedValueLink}
                open={openModalLinkRelay}
                onClose={handleCloseModalLinkRelay}
            />
            {/* <SensorsDialog
                selectedValue={selectedValueLink}
                open={openModalLinkSensor}
                onClose={handleCloseModalLinkSensor}
            /> */}
        </Box>
    );
};

export default MainPage;
