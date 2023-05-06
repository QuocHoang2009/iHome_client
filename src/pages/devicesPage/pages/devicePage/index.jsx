import DeleteIcon from '@mui/icons-material/Delete';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { tokens } from '../../../../app/theme';
import BoxEdit from '../../../../components/BoxEdit';
import ButtonsDialog from '../../../../components/ButtonsDialog';
import HeaderChild from '../../../../components/HeaderChild';
import ModalDelete from '../../../../components/ModalDelete';
import RelaysDialog from '../../../../components/RelaysDialog';
import {
    ADMIN,
    deviceApi,
    disconnectButtonApi,
    disconnectRelay,
    editDevice,
    getAllRooms,
    linkButtonApi,
    linkDevice,
    updateDevice,
} from '../../../../const/API';

const initialValues = {
    name: '',
    room: '',
};

const checkoutSchema = yup.object().shape({
    name: yup.string().required('required'),
    room: yup.string().required('required'),
});

const DevicePage = () => {
    const params = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const home = useSelector((state) => state.home);
    const currentHome = useSelector((state) => state.currentHome);
    const [rooms, setRooms] = useState([]);
    const [currentDevice, setCurrentDevice] = useState();
    const [isReset, setIsReset] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [openModalLink, setOpenModalLink] = useState(false);
    const [selectedValueLink, setSelectedValueLink] = useState();
    const [selectedButton, setSelectedButton] = useState();
    const [openModalButton, setOpenModalButton] = useState(false);
    const [openButtonDisconnectModal, setOpenButtonDisconnectModal] = useState(false);
    const [isEdit, setIsEdit] = useState();

    useEffect(() => {
        (async () => {
            const api = getAllRooms + home._id;
            const res = await axios.get(api);
            setRooms(res.data.rooms);
        })();
    }, [home._id]);

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
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
            field: 'channel',
            headerName: 'Channel',
            flex: 1,
            renderCell: ({ row: { channel } }) => {
                return <Box>{channel}</Box>;
            },
        },
        {
            field: 'state',
            headerName: 'State',
            flex: 1,
            renderCell: ({ row: { state } }) => {
                return (
                    <Box>
                        <LightbulbIcon
                            color={state ? 'success' : 'disabled'}
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
            },
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: () => {
                return (
                    <Box
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                            },
                        }}
                    >
                        <DeleteIcon />
                    </Box>
                );
            },
        },
    ];

    const buttonColumns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
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
            field: 'channel',
            headerName: 'Channel',
            flex: 1,
            renderCell: ({ row: { numChannel } }) => {
                return <Box>{numChannel}</Box>;
            },
        },
        {
            field: 'room',
            headerName: 'Room',
            flex: 1,
            renderCell: ({ row: { room } }) => {
                const roomRes = rooms?.find((roomSelect) => {
                    return room?._id === roomSelect?.room;
                });
                return <Box>{roomRes?.name}</Box>;
            },
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: () => {
                return (
                    <Box
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                            },
                        }}
                    >
                        <DeleteIcon />
                    </Box>
                );
            },
        },
    ];

    const handleDisconnect = async () => {
        const data = {
            relayChannel: currentDevice.relay._id,
            device: currentDevice._id,
        };

        await axios
            .patch(disconnectRelay, {
                body: data,
            })
            .then((res) => {
                setOpenModal(false);
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

    const handleDelete = () => {
        setOpenModal(true);
    };

    const handleChangeState = async () => {
        const data = {
            mqttPath: home.mqttPath + '/control',
            relay: currentDevice.relay,
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

    const handleClickOpenModalLink = () => {
        setOpenModalLink(true);
    };

    const handleCloseModalLink = async (value) => {
        setOpenModalLink(false);
        if (value) {
            setSelectedValueLink(value);
            const data = {
                device: currentDevice._id,
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

    const handleClickOpenModalButton = () => {
        setOpenModalButton(true);
    };

    const handleCloseModalButton = async (value) => {
        setOpenModalButton(false);
        if (value) {
            setSelectedButton(value);
            const data = {
                relay: {
                    _id: currentDevice.relay._id,
                    channel: currentDevice.relay.channel,
                },
                button: {
                    _id: value._id,
                    channel: value.channel,
                },
                mqttPath: home.mqttPath + '/link_dev',
            };

            await axios
                .patch(linkButtonApi, {
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
            const api = deviceApi + params.id;
            const res = await axios.get(api);
            const device = res.data;
            setCurrentDevice(device);
        })();
    }, [params.id, isReset]);

    const relayRow = [{ id: 1, state: currentDevice?.state, ...currentDevice?.relay }];
    let buttons = currentDevice?.relay?.buttons;
    initialValues.name = currentDevice?.name;
    initialValues.room = currentDevice?.room?._id;

    const handleClick = (params) => {
        if (params.field === 'delete' && currentHome?.access === ADMIN) {
            handleDelete(params.row);
        } else if (params.field === 'name' && currentHome?.access === ADMIN) {
            navigate('/nodes/' + params.row._id);
        } else if (params.field === 'state') {
            handleChangeState(params.row);
        }
    };

    const handleDisconnectButton = async () => {
        setOpenButtonDisconnectModal(false);
        const relay = currentDevice.relay;
        const button = selectedButton;
        const data = {
            relay: {
                _id: relay._id,
                channel: relay.channel,
            },
            button: {
                _id: button._id,
                channel: button.numChannel,
            },
            mqttPath: home.mqttPath + '/disconnect_dev',
        };

        await axios
            .patch(disconnectButtonApi, {
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

    const handleClickButtonTable = (params) => {
        if (params.field === 'delete' && currentHome?.access !== 'user') {
            setSelectedButton(params.row);
            setOpenButtonDisconnectModal(true);
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        const api = editDevice + currentDevice._id;

        await axios
            .patch(api, {
                body: values,
            })
            .then((res) => {
                const device = res.data;
                if (!device) return;
                onSubmitProps.resetForm();
                setIsEdit(false);
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

    const editHandle = () => {
        setIsEdit(true);
    };

    return (
        <Box m="20px">
            <HeaderChild
                title={currentDevice?.name}
                subtitle={currentDevice?.room?.name}
                addButton={currentHome?.access !== 'user' && 'Edit'}
                buttonHandle={editHandle}
            />
            {openModal && (
                <ModalDelete
                    open={openModal}
                    handleModal={setOpenModal}
                    name={
                        'Disconnect ' +
                        currentDevice?.relay?.name +
                        ' channel ' +
                        currentDevice?.relay?.channel
                    }
                    handleDelete={handleDisconnect}
                />
            )}

            {openButtonDisconnectModal && (
                <ModalDelete
                    open={openButtonDisconnectModal}
                    handleModal={setOpenButtonDisconnectModal}
                    name={
                        'Disconnect ' +
                        currentDevice?.relay?.name +
                        ' channel ' +
                        currentDevice?.relay?.channel
                    }
                    handleDelete={handleDisconnectButton}
                />
            )}

            {isEdit && (
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
                                            {rooms?.map((room, key) => {
                                                return (
                                                    <MenuItem value={room?._id} key={key}>
                                                        {room?.name}
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
                                        Edit device
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    )}
                </Formik>
            )}

            <BoxEdit title="Relay">
                {currentDevice?.relay ? (
                    <Box
                        m="10px 0 0 0"
                        height="22.5vh"
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
                            rows={relayRow}
                            columns={columns}
                            pageSize={100}
                            rowsPerPageOptions={[100]}
                            onCellClick={handleClick}
                        />
                    </Box>
                ) : (
                    currentHome?.access === ADMIN && (
                        <Box
                            width="150px"
                            height="40px"
                            m="0"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            backgroundColor={colors.greenAccent[600]}
                            borderRadius="4px"
                            onClick={() => handleClickOpenModalLink()}
                            sx={{
                                ':hover': {
                                    cursor: 'pointer',
                                    opacity: 0.8,
                                },
                            }}
                        >
                            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                                Link with relay
                            </Typography>
                        </Box>
                    )
                )}
            </BoxEdit>
            <RelaysDialog
                selectedValue={selectedValueLink}
                open={openModalLink}
                onClose={handleCloseModalLink}
            />
            {currentHome?.access === ADMIN && (
                <BoxEdit
                    title="Button"
                    button={currentHome?.access === ADMIN && 'Add Button'}
                    buttonHandle={handleClickOpenModalButton}
                >
                    {currentDevice?.relay && (
                        <Box
                            m="10px 0 0 0"
                            height="48vh"
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
                                rows={buttons?.map((button, index) => {
                                    return {
                                        ...button,
                                        id: index + 1,
                                    };
                                })}
                                columns={buttonColumns}
                                pageSize={100}
                                rowsPerPageOptions={[100]}
                                onCellClick={handleClickButtonTable}
                            />
                        </Box>
                    )}
                </BoxEdit>
            )}

            <ButtonsDialog
                selectedValue={selectedButton}
                open={openModalButton}
                onClose={handleCloseModalButton}
            />
        </Box>
    );
};

export default DevicePage;
