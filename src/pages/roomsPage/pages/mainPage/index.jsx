import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField, useTheme } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { tokens } from '../../../../app/theme';
import ButtonStyle from '../../../../components/ButtonStyle';
import HeaderChild from '../../../../components/HeaderChild';
import ModalDelete from '../../../../components/ModalDelete';
import RelaysDialog from '../../../../components/RelaysDialog';
import {
    ADMIN,
    USER,
    addRoom,
    changeStateRelay,
    getAllRooms,
    linkRoomRelay,
    roomApi,
} from '../../../../const/API';

const initialValues = {
    name: '',
    home: '',
};

const checkoutSchema = yup.object().shape({
    name: yup.string().required('required'),
});

const MainPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const home = useSelector((state) => state.home);
    const currentHome = useSelector((state) => state.currentHome);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isAdd, setIsAdd] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [roomSelect, setRoomSelect] = useState();
    const [isReset, setIsReset] = useState(false);
    const [rooms, setRoomsPage] = useState([]);
    const [openModalLink, setOpenModalLink] = useState(false);
    const [selectedValueLink, setSelectedValueLink] = useState();

    const handleClickOpenModalLink = () => {
        setOpenModalLink(true);
    };

    const handleCloseModalLink = async (value) => {
        setOpenModalLink(false);
        if (value) {
            setSelectedValueLink(value);
            const data = {
                room: roomSelect._id,
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

    useEffect(() => {
        (async () => {
            if (home?._id) {
                const apiGetRooms = getAllRooms + home?._id;
                const res = await axios.get(apiGetRooms);
                if (currentHome?.access === 'user' && currentHome?.rooms.length !== 0) {
                    const roomsTmp = res.data?.filter(
                        (room) =>
                            currentHome?.rooms?.findIndex((roomId) => room?._id === roomId) !== -1,
                    );
                    setRoomsPage(roomsTmp);
                } else {
                    setRoomsPage(res.data);
                }
            }
        })();
    }, [dispatch, home, isAdd, navigate, isReset, currentHome]);

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
            renderCell: ({ row: { relay } }) => {
                const access = currentHome?.access === ADMIN && !relay;
                return (
                    <Box>
                        {access && <ButtonStyle name="LINK" width="75px" height="35px" />}{' '}
                        {relay && (
                            <FormControlLabel
                                value={relay.state}
                                control={<Switch checked={relay.state} />}
                            />
                        )}
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

    const addRoomHandle = async (values, onSubmitProps) => {
        values.home = home?._id;

        await axios
            .post(addRoom, {
                body: values,
            })
            .then((res) => {
                const room = res.data;
                if (!room) return;
                onSubmitProps.resetForm();
                setIsAdd(false);
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
        await addRoomHandle(values, onSubmitProps);
    };

    const handleDeleteRoom = async () => {
        const api = roomApi + roomSelect._id;
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

    const handleDelete = (room) => {
        setRoomSelect(room);
        setOpenModal(true);
    };

    const handleChangeState = async (room) => {
        const data = {
            mqttPath: home?.mqttPath,
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

    const handleLink = (room) => {
        setRoomSelect(room);
        handleClickOpenModalLink();
    };

    const handleClick = (params) => {
        if (params.field === 'delete' && currentHome?.access === ADMIN) {
            handleDelete(params.row);
        } else if (params.field === 'name') {
            navigate('/rooms/' + params.row._id);
        } else if (params.field === 'state') {
            if (params.row.relay) {
                handleChangeState(params.row);
            } else {
                if (currentHome?.access === ADMIN) handleLink(params.row);
            }
        }
    };

    return (
        <Box m="20px">
            <HeaderChild
                title="Rooms"
                subtitle="Managing the Rooms"
                addButton={currentHome?.access !== USER && 'Add Room'}
                buttonHandle={buttonHandle}
            />

            {openModal && (
                <ModalDelete
                    open={openModal}
                    handleModal={setOpenModal}
                    name={roomSelect.name}
                    handleDelete={handleDeleteRoom}
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
                                <Box display="grid" height="45px" width="68%">
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

                                <Box height="45px" width="30%">
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
                                        Create room
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

            <RelaysDialog
                selectedValue={selectedValueLink}
                open={openModalLink}
                onClose={handleCloseModalLink}
            />
        </Box>
    );
};

export default MainPage;
