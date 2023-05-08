import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { tokens } from '../../../../app/theme';
import ButtonStyle from '../../../../components/ButtonStyle';
import HeaderChild from '../../../../components/HeaderChild';
import ModalDelete from '../../../../components/ModalDelete';
import RelayComponent from '../../../../components/RelayComponent';
import RelaysDialog from '../../../../components/RelaysDialog';
import {
    ADMIN,
    USER,
    addDevice,
    deviceApi,
    getAllDevices,
    getAllRooms,
    linkDevice,
} from '../../../../const/API';

const initialValues = {
    name: '',
    home: '',
    room: '',
};

const checkoutSchema = yup.object().shape({
    name: yup.string().required('required'),
    room: yup.string().required('required'),
});

const MainPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const home = useSelector((state) => state.home);
    const currentHome = useSelector((state) => state.currentHome);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const [isAdd, setIsAdd] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deviceSelect, setDeviceSelect] = useState();
    const [devices, setDevices] = useState([]);
    const [openModalLink, setOpenModalLink] = useState(false);
    const [selectedValueLink, setSelectedValueLink] = useState();

    useEffect(() => {
        (async () => {
            const api = getAllRooms + home._id;
            const res = await axios.get(api);
            setRooms(res.data.rooms);
        })();
    }, [home._id]);

    const handleClickOpenModalLink = () => {
        setOpenModalLink(true);
    };

    const handleCloseModalLink = async (value) => {
        setOpenModalLink(false);
        if (value) {
            setSelectedValueLink(value);
            const data = {
                device: deviceSelect._id,
                relay: value.channels[value.channel - 1]._id,
            };

            await axios
                .post(linkDevice, {
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

    useEffect(() => {
        (async () => {
            if (home?._id) {
                const apiGetDevices = getAllDevices + home?._id;
                const res = await axios.get(apiGetDevices);
                const { devices, relays } = res.data;

                let devicesTmp = [];
                if (currentHome?.access !== USER || currentHome?.rooms.length === 0) {
                    devicesTmp = devices;
                } else {
                    devicesTmp = devices?.filter(
                        (device) =>
                            currentHome?.rooms?.findIndex((room) => room === device?.room) !== -1,
                    );
                }

                setDevices(
                    devicesTmp.map((device) => {
                        const relayFilter = (relay) => {
                            return relay?._id === device.relay;
                        };
                        const room = rooms.find((room) => room?._id === device.room);
                        delete device.room;
                        device.room = room;
                        if (device?.relay) {
                            device.relay = relays.find(relayFilter);
                        }
                        return device;
                    }),
                );
            }
        })();
    }, [home, isAdd, navigate, isReset, rooms, currentHome]);

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
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: () => {
                return (
                    currentHome?.access === ADMIN && (
                        <Box
                            sx={{
                                '&:hover': {
                                    cursor: 'pointer',
                                },
                            }}
                        >
                            <DeleteIcon />
                        </Box>
                    )
                );
            },
        },
    ];

    const buttonHandle = () => setIsAdd(true);

    const addDeviceHandle = async (values, onSubmitProps) => {
        values.home = home?._id;

        await axios
            .post(addDevice, {
                body: values,
            })
            .then((res) => {
                const device = res.data;
                if (!device) return;
                onSubmitProps.resetForm();
                setIsAdd(false);
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

    const handleFormSubmit = async (values, onSubmitProps) => {
        await addDeviceHandle(values, onSubmitProps);
    };

    const handleDeleteDevice = async () => {
        const api = deviceApi + deviceSelect._id;
        await axios
            .delete(api)
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
        setOpenModal(false);
    };

    const handleDelete = (device) => {
        setDeviceSelect(device);
        setOpenModal(true);
    };

    const handleLink = (device) => {
        setDeviceSelect(device);
        handleClickOpenModalLink();
    };

    const handleClick = (params) => {
        if (params.field === 'delete' && currentHome?.access === ADMIN) {
            handleDelete(params.row);
        } else if (params.field === 'name') {
            navigate('/devices/' + params.row._id);
        } else if (params.field === 'state') {
            if (!params.row.relay) {
                if (currentHome?.access === ADMIN) handleLink(params.row);
            }
        }
    };

    return (
        <Box m="20px">
            <HeaderChild
                title="Devices"
                subtitle="Managing the Devices"
                addButton={currentHome?.access !== 'user' && 'Add Device'}
                buttonHandle={buttonHandle}
            />

            {openModal && (
                <ModalDelete
                    open={openModal}
                    handleModal={setOpenModal}
                    name={'Delete ' + deviceSelect.name}
                    handleDelete={handleDeleteDevice}
                />
            )}

            {isAdd && (
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}
                >
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Box display="flex" justifyContent="space-between" m="20px 0">
                                <Box display="grid" height="45px" width="39%">
                                    <TextField
                                        label="Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        name="name"
                                        error={Boolean(touched.name) && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                        sx={{ gridColumn: 'span 4' }}
                                    />
                                </Box>

                                <Box display="grid" height="45px" width="39%">
                                    <FormControl fullWidth>
                                        <InputLabel>Room</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={values.room}
                                            label="room"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            name="room"
                                            error={Boolean(touched.room) && Boolean(errors.room)}
                                            sx={{ gridColumn: 'span 4' }}
                                        >
                                            {rooms.map((room, key) => {
                                                return (
                                                    <MenuItem value={room._id} key={key}>
                                                        {room.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box height="45px" width="20%">
                                    <Button
                                        fullWidth
                                        type="submit"
                                        sx={{
                                            p: '1rem',
                                            backgroundColor: colors.greenAccent[600],
                                            color: '#fff',
                                            '&:hover': { color: colors.greenAccent[400] },
                                        }}
                                    >
                                        Create device
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    )}
                </Formik>
            )}

            <Box
                m="40px 0 0 0"
                height="60vh"
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

            <RelaysDialog
                selectedValue={selectedValueLink}
                open={openModalLink}
                onClose={handleCloseModalLink}
            />
        </Box>
    );
};

export default MainPage;
