import axios from 'axios';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { setCurrentHome, setHomes } from '../app/state';
import DefaultLayout from '../components/DefaultLayout';
import { ADMIN, getAllHomes } from '../const/API';
import sidebarItems from '../const/sidebarItems';

const Pages = () => {
    const user = useSelector((state) => state.user);
    const apiGetHomes = getAllHomes + user._id;
    const dispatch = useDispatch();
    const currentHome = useSelector((state) => state.currentHome);

    useEffect(() => {
        (async () => {
            const res = await axios.get(apiGetHomes);
            if (res?.data) {
                dispatch(setHomes({ homes: res.data }));
                if (res.data === 0) {
                    dispatch(setCurrentHome({ currentHome: null }));
                } else {
                    dispatch(setCurrentHome({ currentHome: res.data[0] }));
                }
            }
        })();
    }, [apiGetHomes, dispatch]);

    return (
        <>
            <Helmet>
                <title> iHome </title>
            </Helmet>

            <Routes>
                <Route path={`/`} element={<Navigate to="/home" />} />
                {sidebarItems.map((item, key) => {
                    let Page = item.component;
                    if (item.title !== 'Nodes' && item.title !== 'Members') {
                        return (
                            <Route
                                key={key}
                                path={`${item.path}/*`}
                                element={
                                    <DefaultLayout>
                                        <Page />
                                    </DefaultLayout>
                                }
                            />
                        );
                    } else {
                        if (currentHome?.access === ADMIN && item.title === 'Nodes') {
                            return (
                                <Route
                                    key={key}
                                    path={`${item.path}/*`}
                                    element={
                                        <DefaultLayout>
                                            <Page />
                                        </DefaultLayout>
                                    }
                                />
                            );
                        }
                        if (currentHome?.access !== 'user' && item.title === 'Members') {
                            return (
                                <Route
                                    key={key}
                                    path={`${item.path}/*`}
                                    element={
                                        <DefaultLayout>
                                            <Page />
                                        </DefaultLayout>
                                    }
                                />
                            );
                        }

                        return null;
                    }
                })}
            </Routes>
        </>
    );
};

export default Pages;
