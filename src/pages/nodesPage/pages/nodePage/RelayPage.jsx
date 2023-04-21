import { Box, useTheme } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { tokens } from "../../../../app/theme";
import { nodeApi, updateDevice } from "../../../../const/API";

const RelayPage = ()=>{
    const params = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const home = useSelector((state)=> state.currentHome);
    const [isReset, setIsReset] = useState();
    const [channels, setChannels] = useState([]);

    useEffect(()=>{
        (async ()=>{
            const api = nodeApi + params.id;
            const res = await axios.get(api);
            setChannels(res.data.channels);
        })()
    }, [params.id, isReset]);

    const columns = [
        { field: "id", headerName: "ID" },
        {
            field: "link",
            headerName: "Link",
            flex: 2,
            renderCell: ({ row: { link } }) => {
                return (
                    <Box 
                        sx={{
                            ":hover":{
                                cursor: "pointer",
                            }
                        }}
                    >
                        {link}
                    </Box>
                );
            },
        },
        {
            field: "state",
            headerName: "State",
            flex: 1,
            renderCell: ({ row: { state } }) => {
                return (
                    <Box>
                        <FormControlLabel value={state} control={<Switch checked={state} />} />
                    </Box>
                );
            },
        }
    ];

    const handleChangeState = async (relay)=>{
        const data = {
            mqttPath: home.mqttPath,
            relay: relay,
        }

        await axios.patch(updateDevice, {
            body: data,
        })
        .then((res) => {
            setIsReset(!isReset);
        })
        .catch((error) => {
            if(error?.response){
                console.log(error.response.data);
            }
            else{
                console.log(error);
            }
        });
    }

    const handleClick = (params)=>{
        if(params.field === "state"){
            handleChangeState(params.row);
        }
    }

    return(
        <Box
            m="40px 0 0 0"
            height="60vh"
            sx={{
            "& .MuiDataGrid-root": {
                border: "none",
            },
            "& .MuiDataGrid-cell": {
                borderBottom: "none",
            },
            "& .name-column--cell": {
                color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
            },
            }}
        >
            <DataGrid 
                rows={channels?.map((channel, index)=>{
                    return {
                        ...channel,
                        id: index + 1
                    }
                })}
                columns={columns} 
                pageSize={100}
                rowsPerPageOptions={[100]}
                onCellClick={handleClick}
            />
        </Box>
    )
}

export default RelayPage;