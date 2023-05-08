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
import axios from 'axios';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { tokens } from '../../../../app/theme';
import HeaderChild from '../../../../components/HeaderChild';
import { editNode, getAllRooms, nodeApi } from '../../../../const/API';
import ButtonPage from './ButtonPage';
import RelayPage from './RelayPage';
import SensorPage from './SensorPage';

const initialValues = {
    name: '',
    room: '',
};

const checkoutSchema = yup.object().shape({
    name: yup.string().required('required'),
    room: yup.string().required('required'),
});

const NodePage = () => {
    const params = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const home = useSelector((state) => state.home);
    const [rooms, setRooms] = useState([]);
    const [currentNode, setCurrentNode] = useState();
    const [isReset, setIsReset] = useState();
    const [isEdit, setIsEdit] = useState();

    useEffect(() => {
        (async () => {
            const api = getAllRooms + home._id;
            const res = await axios.get(api);
            setRooms(res.data.rooms);
        })();
    }, [home._id]);

    useEffect(() => {
        (async () => {
            const api = nodeApi + params.id;
            const res = await axios.get(api);
            const { node } = res.data;
            setCurrentNode(node);
        })();
    }, [params.id, isReset]);

    const handleFormSubmit = async (values, onSubmitProps) => {
        const api = editNode + currentNode._id;

        await axios
            .patch(api, {
                body: values,
            })
            .then((res) => {
                const node = res.data;
                if (!node) return;
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

    let PageChild;
    if (currentNode?.type === 'Relay') {
        PageChild = RelayPage;
    } else if (currentNode?.type === 'Button') {
        PageChild = ButtonPage;
    } else if (currentNode?.type === 'Sensor') {
        PageChild = SensorPage;
    }

    return (
        <Box m="20px">
            <HeaderChild
                title={currentNode?.name}
                subtitle={currentNode?.room.name}
                addButton="Edit"
                buttonHandle={editHandle}
            />

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
                                        Edit device
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    )}
                </Formik>
            )}

            {PageChild && <PageChild />}
        </Box>
    );
};

export default NodePage;
