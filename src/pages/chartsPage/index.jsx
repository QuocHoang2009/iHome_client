import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdeChart from '../../components/AdeChart';
import HeaderChild from '../../components/HeaderChild';
import { getAllAdeNodes } from '../../const/API';

const ChartsPage = () => {
    const home = useSelector((state) => state.home);
    const dispatch = useDispatch();
    const [adeNodes, setAdeNodes] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await axios.get(getAllAdeNodes + home._id);
            if (res?.data) {
                setAdeNodes(res.data);
            }
        })();
    }, [home._id, dispatch]);

    return (
        <Box m="20px">
            <HeaderChild title="Charts" subtitle="All charts here!" />
            {adeNodes?.map((node, key) => {
                return <AdeChart key={key} address={node?.address} title={node.name} />;
            })}
        </Box>
    );
};

export default ChartsPage;
