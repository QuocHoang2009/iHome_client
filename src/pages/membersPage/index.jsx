import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

import {
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Formik } from 'formik';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { setMembers } from '../../app/state';
import { tokens } from '../../app/theme';
import HeaderChild from '../../components/HeaderChild';
import {
    ADMIN,
    MANAGER,
    USER,
    getAllMembers,
    getAllRooms,
    getMembersByEmail,
    memberHomeApi,
} from '../../const/API';

const initialValues = {
    email: '',
};

const checkoutSchema = yup.object().shape({
    email: yup.string().required('required'),
});

const initialValuesUser = {
    access: '',
    rooms: [],
};

const checkoutSchemaUser = yup.object().shape({
    access: yup.string().required('required'),
    rooms: yup.array().required('required'),
});

const ModalAddMember = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = props.user;
    const currentHome = useSelector((state) => state.currentHome);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        (async () => {
            const api = getAllRooms + currentHome?.home;
            const res = await axios.get(api);
            if (res.data) {
                setRooms(res.data.rooms);
            }
        })();
    }, [currentHome]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleFormSubmit = async (values) => {
        const data = {
            home: currentHome.home,
            user: user._id,
            ...values,
        };

        await axios
            .post(memberHomeApi, {
                body: data,
            })
            .then((res) => {
                console.log(res.data);
            })
            .catch((error) => {
                if (error?.response) {
                    console.log(error.response.data);
                } else {
                    console.log(error);
                }
            });
        props.handleCloseModal();
    };

    const accessLevel = [ADMIN, MANAGER, USER];

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <Modal
            keepMounted
            open={props.openModal}
            onClose={props.handleCloseModal}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValuesUser}
                    validationSchema={checkoutSchemaUser}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                        resetForm,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    '& > div': { gridColumn: 'span 4' },
                                }}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    height="100px"
                                    width="100%"
                                >
                                    <FormControl fullWidth>
                                        <InputLabel>Access</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={values.access}
                                            label="access"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            name="access"
                                            error={
                                                Boolean(touched.access) && Boolean(errors.access)
                                            }
                                            sx={{ gridColumn: 'span 4' }}
                                        >
                                            {accessLevel.map((access, key) => {
                                                return (
                                                    <MenuItem value={access} key={key}>
                                                        {access}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>

                                    {values.access === 'user' && (
                                        <FormControl fullWidth>
                                            <InputLabel>Rooms</InputLabel>
                                            <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                multiple
                                                value={values.rooms}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="rooms"
                                                renderValue={(selected) => (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        {selected?.map((value, index) => (
                                                            <Chip label={value.name} key={index} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                                name="rooms"
                                                error={
                                                    Boolean(touched.access) &&
                                                    Boolean(errors.access)
                                                }
                                                sx={{ gridColumn: 'span 4' }}
                                            >
                                                {rooms?.map((room, index) => (
                                                    <MenuItem key={index} value={room}>
                                                        <Checkbox
                                                            checked={
                                                                values.rooms.indexOf(room) !== -1
                                                            }
                                                        />
                                                        <ListItemText primary={room.name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </Box>
                            </Box>

                            {/* BUTTONS */}
                            <Box display="flex" flexDirection="row" width="100%">
                                <Button
                                    width="100%"
                                    type="submit"
                                    sx={{
                                        m: '2rem 0',
                                        p: '1rem',
                                        backgroundColor: colors.primary[500],
                                        color: colors.greenAccent[600],
                                        '&:hover': { color: colors.greenAccent[400] },
                                    }}
                                >
                                    {'ADD MEMBER'}
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
};

const MembersPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [stateMember, setStateMember] = useState(true);
    const [usersFind, setUsersFind] = useState([]);
    const [isAddMember, setIsAddMember] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [memberSelected, setMembersSelected] = useState({});
    const home = useSelector((state) => state.home);
    const members = useSelector((state) => state.members);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        (async () => {
            const api = getAllMembers + home?._id;
            const res = await axios.get(api);
            if (res.data) {
                dispatch(setMembers({ members: res.data }));
            }
        })();
    }, [home, dispatch, isAddMember, isReset]);

    const membersData = members.members?.map((member, index) => {
        return {
            _id: member._id,
            id: index + 1,
            name: member.firstName + ' ' + member.lastName,
            age: member.age,
            email: member.email,
            access: members.homesMembers[index].access,
        };
    });

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            cellClassName: 'name-column--cell',
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'accessLevel',
            headerName: 'Access Level',
            flex: 1,
            renderCell: ({ row: { access } }) => {
                return (
                    <Box
                        width="60%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={
                            access === ADMIN
                                ? colors.greenAccent[600]
                                : access === MANAGER
                                ? colors.greenAccent[700]
                                : colors.greenAccent[700]
                        }
                        borderRadius="4px"
                    >
                        {access === ADMIN && <AdminPanelSettingsOutlinedIcon />}
                        {access === MANAGER && <SecurityOutlinedIcon />}
                        {access === USER && <LockOpenOutlinedIcon />}
                        <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                            {access}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: ({ row: { _id, access } }) => {
                return (
                    <Box
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                            },
                        }}
                    >
                        {access !== ADMIN && user._id !== _id && <DeleteIcon />}
                    </Box>
                );
            },
        },
    ];

    const columnsUser = [
        { field: 'id', headerName: 'ID', flex: 1 },
        {
            field: 'name',
            headerName: 'Name',
            flex: 2,
            cellClassName: 'name-column--cell',
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 3,
        },
    ];

    const buttonHandle = () => {
        setStateMember(!stateMember);
    };

    const handleRowClick = async (params) => {
        const dataUser = params.row;
        console.log(dataUser);

        if (dataUser.access !== ADMIN && user._id !== dataUser._id && params.field === 'delete') {
            const api = memberHomeApi + '/' + home._id + '/' + dataUser._id;
            const res = await axios.delete(api);
            console.log(res);
            setIsReset(!isReset);
        }
    };

    const handleCloseModalAdd = () => {
        setIsAddMember(false);
    };

    const addMemberHandle = (params) => {
        setMembersSelected(params.row);
        setIsAddMember(true);
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        const api = getMembersByEmail + '/' + values.email;
        await axios
            .get(api)
            .then((res) => {
                const userNotExist = res.data.filter((user) => {
                    return members.members?.findIndex((member) => member._id === user._id) === -1;
                });
                const users = userNotExist?.map((member, index) => {
                    return {
                        id: index + 1,
                        name: member.firstName + ' ' + member.lastName,
                        age: member.age,
                        email: member.email,
                        _id: member._id,
                    };
                });

                setUsersFind([...users]);
            })
            .catch((error) => {
                if (error?.response) {
                    console.log(error.response.data);
                } else {
                    console.log(error);
                }
            });
    };

    return (
        <Box m="20px">
            <HeaderChild
                title="Members"
                subtitle="Managing the Members"
                addButton={stateMember ? 'Add Members' : 'View Members'}
                buttonHandle={buttonHandle}
            />

            {isAddMember && (
                <ModalAddMember
                    openModal={isAddMember}
                    handleCloseModal={handleCloseModalAdd}
                    user={memberSelected}
                />
            )}

            {stateMember ? (
                <Box
                    m="40px 0 0 0"
                    height="60vh"
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                            cursor: 'pointer',
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
                        rows={membersData ? membersData : []}
                        columns={columns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        onCellClick={handleRowClick}
                    />
                </Box>
            ) : (
                <Box>
                    <Typography variant="h5" color={colors.greenAccent[400]}>
                        Enter Email
                    </Typography>
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={checkoutSchema}
                    >
                        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Box display="flex" justifyContent="space-between" m="20px 0">
                                    <Box display="grid" height="45px" width="79%">
                                        <TextField
                                            label="Email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.email}
                                            name="email"
                                            error={Boolean(touched.email) && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                            sx={{ gridColumn: 'span 4' }}
                                        />
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
                                            Find
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        )}
                    </Formik>
                    {usersFind?.length !== 0 ? (
                        <Box
                            m="40px 0 0 0"
                            height="50vh"
                            sx={{
                                '& .MuiDataGrid-root': {
                                    border: 'none',
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: 'none',
                                    cursor: 'pointer',
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
                                rows={usersFind}
                                columns={columnsUser}
                                pageSize={100}
                                rowsPerPageOptions={[100]}
                                onRowClick={addMemberHandle}
                            />
                        </Box>
                    ) : (
                        <Box></Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default MembersPage;
