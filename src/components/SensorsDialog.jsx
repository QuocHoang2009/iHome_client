import { Dialog, DialogTitle } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllSensors } from '../const/API';

const SensorsDialog = (props) => {
    const home = useSelector((state) => state.home);
    const { onClose, selectedValue, open } = props;
    const [sensorsNode, setSensorsNode] = useState([]);

    useEffect(() => {
        (async () => {
            const api = getAllSensors + home._id;
            const res = await axios.get(api);
            if (res.data) {
                setSensorsNode(res.data.filter((sensor) => !sensor.link));
            }
        })();
    }, [home, open]);

    const handleListItemClick = (value) => {
        onClose(value);
    };

    const handleClose = () => {
        onClose(selectedValue?.sensor);
    };

    const SensorsNotLink = (sensor, key) => {
        const tmp = sensor.sensor;
        if (tmp?.link) return;

        return (
            <ListItem disableGutters key={key}>
                <ListItemButton onClick={() => handleListItemClick(tmp)}>
                    <ListItemText primary={tmp?.name} />
                </ListItemButton>
            </ListItem>
        );
    };

    return (
        <Dialog onClose={() => handleClose()} open={open}>
            <DialogTitle minWidth="200px">SELECT SENSOR</DialogTitle>
            <List sx={{ pt: 0 }}>
                {sensorsNode.map((sensor, index) => (
                    <SensorsNotLink sensor={sensor} key={index} />
                ))}
                <ListItemButton onClick={() => handleListItemClick()}>
                    <ListItemText primary={'Cancel'} />
                </ListItemButton>
            </List>
        </Dialog>
    );
};

export default SensorsDialog;
