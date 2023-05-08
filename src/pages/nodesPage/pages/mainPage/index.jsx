import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, AlertTitle, Box, LinearProgress, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNodes } from '../../../../app/state';
import { tokens } from '../../../../app/theme';
import HeaderChild from '../../../../components/HeaderChild';
import ModalDelete from '../../../../components/ModalDelete';
import { addNode, getAllNodes, getAllRooms, nodeApi } from '../../../../const/API';

const MainPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const nodes = useSelector((state) => state.nodes);
    const home = useSelector((state) => state.home);
    const [rooms, setRooms] = useState([]);
    const [isReload, setIsReload] = useState();
    const [isLineNear, setIsLineNear] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [nodeSelect, setNodeSelect] = useState();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const apiAddNode = addNode + home._id;

    useEffect(() => {
        (async () => {
            const api = getAllRooms + home._id;
            const res = await axios.get(api);
            setRooms(res.data.rooms);
        })();
    }, [home._id]);

    const buttonHandle = () => {
        setIsLineNear(true);
        axios
            .post(apiAddNode, {
                topic: home?.mqttPath + '/permit_join',
            })
            .then((res) => {
                setIsLineNear(false);
                setIsAlert(true);
                if (res.data) {
                    setIsReload(!isReload);
                    setIsSuccess(true);
                } else {
                    setIsSuccess(false);
                }
                setTimeout(() => {
                    setIsAlert(false);
                }, 10000);
            })
            .catch((error) => {
                setIsLineNear(false);
                console.log(error);
            });
    };

    useEffect(() => {
        (async () => {
            if (home) {
                const api = getAllNodes + '/' + home?._id;
                const res = await axios.get(api);
                if (res.data) {
                    const nodes = res.data.map((device) => {
                        const room = rooms.find((room) => room?._id === device.room);
                        delete device.room;
                        device.room = room;
                        return device;
                    });
                    dispatch(setNodes({ nodes: nodes }));
                }
            }
        })();
    }, [isReload, dispatch, isReset, rooms, home?._id, home]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
        },
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
            field: 'room',
            headerName: 'Room',
            flex: 1,
            renderCell: ({ row: { room } }) => {
                return <Box>{room?.name}</Box>;
            },
        },
        {
            field: 'type',
            headerName: 'Type Node',
            flex: 1,
        },
        {
            field: 'numChannel',
            headerName: 'Number Channel',
            flex: 1,
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

    const handleDeleteNode = async () => {
        const api = nodeApi + home._id + '/' + nodeSelect._id;

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

    const handleDelete = (node) => {
        setNodeSelect(node);
        setOpenModal(true);
    };

    const handleClick = (params) => {
        if (params.field === 'delete') {
            handleDelete(params.row);
        } else if (params.field === 'name') {
            navigate('/nodes/' + params.row._id);
        }
    };

    return (
        <Box m="20px">
            <HeaderChild
                title="Nodes"
                subtitle="Managing the Nodes"
                addButton="Add Node"
                buttonHandle={buttonHandle}
            />

            {openModal && (
                <ModalDelete
                    open={openModal}
                    handleModal={setOpenModal}
                    name={nodeSelect?.name}
                    handleDelete={handleDeleteNode}
                />
            )}

            {isLineNear && (
                <Box>
                    <LinearProgress color="success" />
                </Box>
            )}

            {isAlert && !isSuccess && (
                <Alert
                    severity="error"
                    onClose={() => {
                        setIsAlert(false);
                    }}
                >
                    <AlertTitle>Error</AlertTitle>
                    Can not find any node! — <strong>Try again!</strong>
                </Alert>
            )}

            {isAlert && isSuccess && (
                <Alert
                    severity="success"
                    onClose={() => {
                        setIsAlert(false);
                    }}
                >
                    <AlertTitle>Success</AlertTitle>
                    Find a node! — <strong>check it out!</strong>
                </Alert>
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
                {nodes && (
                    <DataGrid
                        rows={nodes?.map((node, index) => {
                            return {
                                ...node,
                                id: index + 1,
                            };
                        })}
                        columns={columns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        onCellClick={handleClick}
                    />
                )}
            </Box>
        </Box>
    );
};

export default MainPage;
