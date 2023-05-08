import { Box, Stack, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonStyle from '../../../../components/ButtonStyle';
import HeaderChild from '../../../../components/HeaderChild';
import {
    ADMIN,
    getDevicesByRoom,
    getRelayChannel,
    linkRoomRelay,
    linkRoomSensor,
    roomApi,
    unlinkRoomRelay,
    unlinkRoomSensor,
    updateDevice,
} from '../../../../const/API';

import { useTheme } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../../app/theme';
import AdeChart from '../../../../components/AdeChart';
import AdeComponent from '../../../../components/AdeComponent';
import ModalDelete from '../../../../components/ModalDelete';
import RelayComponent from '../../../../components/RelayComponent';
import RelaysDialog from '../../../../components/RelaysDialog';
import SensorComponent from '../../../../components/SensorComponent';
import SensorsDialog from '../../../../components/SensorsDialog';

const DASHBOARD = 'Dashboard';
const DEVICESPAGE = 'Devices';

const RoomPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const currentHome = useSelector((state) => state.currentHome);
    const home = useSelector((state) => state.home);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [room, setRoom] = useState();
    const [devices, setDevices] = useState();
    const [channel, setChannel] = useState();
    const [isReset, setIsReset] = useState(false);
    const [selectedValueLink, setSelectedValueLink] = useState();
    const [openModalLinkRelay, setOpenModalLinkRelay] = useState(false);
    const [openModalUnlinkRelay, setOpenModalUnlinkRelay] = useState(false);
    const [openModalLinkSensor, setOpenModalLinkSensor] = useState(false);
    const [openModalUnlinkSensor, setOpenModalUnlinkSensor] = useState(false);
    const [tab, setTab] = useState(DASHBOARD);

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'name',
            headerName: 'Name',
            flex: 2,
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
            field: 'room',
            headerName: 'Room',
            flex: 1,
            renderCell: ({ row: { room } }) => {
                return <Box>{room?.name}</Box>;
            },
        },
        {
            field: 'state',
            headerName: 'State',
            flex: 1,
            renderCell: ({ row: { relay } }) => {
                const access = currentHome?.access === ADMIN && !relay;
                return (
                    <Box>
                        {access && <ButtonStyle name="LINK" width="75px" height="35px" />}
                        {relay && <RelayComponent channelId={relay._id} />}
                    </Box>
                );
            },
        },
    ];

    useEffect(() => {
        (async () => {
            const api = roomApi + params.id;
            const res = await axios.get(api);
            if (res.data) setRoom(res.data);
            const resDevice = await axios.get(getDevicesByRoom + params.id);
            if (resDevice.data) {
                const { devices, relays } = resDevice.data;
                setDevices(
                    devices.map((device) => {
                        const relayFilter = (relay) => {
                            return relay?._id === device.relay;
                        };

                        device.room = res.data;
                        if (device?.relay) {
                            device.relay = relays.find(relayFilter);
                        }
                        return device;
                    }),
                );
            }
        })();
    }, [params.id, isReset]);

    useEffect(() => {
        (async () => {
            if (room?.relay) {
                const api = getRelayChannel + room?.relay;
                const res = await axios.get(api);
                if (res.data) setChannel(res.data);
            }
        })();
    }, [room?.relay]);

    const handleEdit = () => {
        console.log('edit');
    };

    const handleClickOpenModalLinkRelay = () => {
        setOpenModalLinkRelay(true);
    };

    const handleCloseModalLinkRelay = async (value) => {
        setOpenModalLinkRelay(false);
        if (value) {
            setSelectedValueLink(value);
            const data = {
                room: room._id,
                relay: value.channels[value.channel - 1]._id,
            };

            await axios
                .patch(linkRoomRelay, {
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

    const handleUnlinkRoomRelay = async () => {
        const data = {
            room: room._id,
            relay: room.relay,
        };

        await axios
            .patch(unlinkRoomRelay, { body: data })
            .then((res) => {
                setIsReset((prev) => !prev);
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

    const handleClickOpenModalLinkSensor = () => {
        setOpenModalLinkSensor(true);
    };

    const handleUnlinkSensor = () => {
        setOpenModalUnlinkSensor(true);
    };

    const handleCloseModalLinkSensor = async (value) => {
        setOpenModalLinkSensor(false);
        if (value) {
            setSelectedValueLink(value);

            const data = {
                room: room?._id,
                sensor: value._id,
            };

            await axios
                .patch(linkRoomSensor, {
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

    const handleUnlinkHomeSensor = async () => {
        const data = {
            room: room._id,
            sensor: room.sensor,
        };
        await axios
            .patch(unlinkRoomSensor, { body: data })
            .then((res) => {
                setIsReset((prev) => !prev);
            })
            .catch((error) => {
                if (error?.response) {
                    console.log(error.response.data);
                } else {
                    console.log(error);
                }
            });
        setOpenModalUnlinkSensor(false);
    };

    const handleChangeTab = (_, value) => {
        setTab(value);
    };

    const handleChangeState = async (device) => {
        const data = {
            mqttPath: home?.mqttPath + '/control',
            relay: device.relay,
        };

        await axios
            .patch(updateDevice, {
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
            navigate('/devices/' + params.row._id);
        } else if (params.field === 'state') {
            if (params.row.relay) {
                handleChangeState(params.row);
            }
        }
    };

    return (
        <Box m="20px">
            <HeaderChild
                title={room?.name}
                subtitle="Managing the Rooms"
                addButton={currentHome?.access !== 'user' && 'Edit Room'}
                buttonHandle={handleEdit}
            />

            {openModalUnlinkRelay && (
                <ModalDelete
                    open={openModalUnlinkRelay}
                    handleModal={setOpenModalUnlinkRelay}
                    name={'Unlink Relay'}
                    handleDelete={handleUnlinkRoomRelay}
                />
            )}

            {openModalUnlinkSensor && (
                <ModalDelete
                    open={openModalUnlinkSensor}
                    handleModal={setOpenModalUnlinkSensor}
                    name={'Unlink Sensor'}
                    handleDelete={handleUnlinkHomeSensor}
                />
            )}

            <Tabs
                value={tab}
                onChange={handleChangeTab}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value={DASHBOARD} label={DASHBOARD} />
                <Tab value={DEVICESPAGE} label={DEVICESPAGE} />
            </Tabs>

            {tab === DASHBOARD ? (
                <Stack direction="column" spacing="16px" width="100%" sx={{ mt: '16px' }}>
                    <AdeComponent
                        relayId={room?.relay}
                        handleLink={handleClickOpenModalLinkRelay}
                        handleUnlink={handleUnlinkRelay}
                    />
                    <SensorComponent
                        sensorId={room?.sensor}
                        handleLink={handleClickOpenModalLinkSensor}
                        handleUnlink={handleUnlinkSensor}
                    />
                    <AdeChart address={channel ? channel.address : null} />
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
                        rows={devices?.map((device, index) => {
                            return {
                                ...device,
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

            <SensorsDialog
                selectedValue={selectedValueLink}
                open={openModalLinkSensor}
                onClose={handleCloseModalLinkSensor}
            />
        </Box>
    );
};

export default RoomPage;
