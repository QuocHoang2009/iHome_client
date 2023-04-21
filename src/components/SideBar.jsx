import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Menu, MenuItem, ProSidebar } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setIsCollapsed, setSelected } from '../app/state';
import { tokens } from '../app/theme';
import { ADMIN, USER, getImg } from '../const/API';
import sidebarItems from '../const/sidebarItems';

import axios from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import { getHome } from '../const/API';

import { setHome } from '../app/state';

const Item = ({ title, to, icon }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const selected = useSelector((state) => state.selected);
    const currentHome = useSelector((state) => state.currentHome);
    const dispatch = useDispatch();
    if (title !== 'Nodes' && title !== 'Members' && title !== 'Charts' && title !== 'Home') {
        return (
            <MenuItem
                active={selected === title}
                style={{
                    color: colors.grey[100],
                }}
                onClick={() => dispatch(setSelected({ selected: title }))}
                icon={icon}
            >
                <Typography>{title}</Typography>
                <Link to={to} />
            </MenuItem>
        );
    } else if (title === 'Nodes') {
        if (currentHome?.access === ADMIN) {
            return (
                <MenuItem
                    active={selected === title}
                    style={{
                        color: colors.grey[100],
                    }}
                    onClick={() => dispatch(setSelected({ selected: title }))}
                    icon={icon}
                >
                    <Typography>{title}</Typography>
                    <Link to={to} />
                </MenuItem>
            );
        }
    } else if (title === 'Members') {
        if (currentHome?.access !== USER) {
            return (
                <MenuItem
                    active={selected === title}
                    style={{
                        color: colors.grey[100],
                    }}
                    onClick={() => dispatch(setSelected({ selected: title }))}
                    icon={icon}
                >
                    <Typography>{title}</Typography>
                    <Link to={to} />
                </MenuItem>
            );
        }
    } else if (title === 'Charts' || title === 'Home') {
        if (currentHome?.access !== USER || currentHome?.rooms.length === 0) {
            return (
                <MenuItem
                    active={selected === title}
                    style={{
                        color: colors.grey[100],
                    }}
                    onClick={() => dispatch(setSelected({ selected: title }))}
                    icon={icon}
                >
                    <Typography>{title}</Typography>
                    <Link to={to} />
                </MenuItem>
            );
        }
    } else {
        if (currentHome?.access !== USER && currentHome.rooms.length === 0) {
            return (
                <MenuItem
                    active={selected === title}
                    style={{
                        color: colors.grey[100],
                    }}
                    onClick={() => dispatch(setSelected({ selected: title }))}
                    icon={icon}
                >
                    <Typography>{title}</Typography>
                    <Link to={to} />
                </MenuItem>
            );
        }
    }
};

const Sidebar = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isCollapsed = useSelector((state) => state.isCollapsed);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleClickOpen = props.handleClickOpen;
    const currentHome = useSelector((state) => state.currentHome);
    const home = useSelector((state) => state.home);

    useEffect(() => {
        (async () => {
            const api = getHome + currentHome.home;
            const res = await axios.get(api);
            if (res.data) {
                dispatch(setHome({ home: res.data }));
            }
        })();
    }, [currentHome, dispatch]);

    return (
        <Box
            position="sticky"
            top="0"
            height="100vh"
            sx={{
                '& .pro-sidebar-inner': {
                    background: `${colors.primary[400]} !important`,
                },
                '& .pro-icon-wrapper': {
                    backgroundColor: 'transparent !important',
                },
                '& .pro-inner-item': {
                    padding: '5px 35px 5px 20px !important',
                },
                '& .pro-inner-item:hover': {
                    color: '#868dfb !important',
                },
                '& .pro-menu-item.active': {
                    color: '#6870fa !important',
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        style={{
                            margin: '10px 0 20px 0',
                            color: colors.grey[100],
                        }}
                    >
                        {isCollapsed ? (
                            <IconButton
                                onClick={() =>
                                    dispatch(setIsCollapsed({ isCollapsed: !isCollapsed }))
                                }
                            >
                                <MenuOutlinedIcon />
                            </IconButton>
                        ) : (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Box onClick={() => navigate('/')}>
                                    <Typography variant="h3" color={colors.grey[100]}>
                                        iHome
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() =>
                                        dispatch(setIsCollapsed({ isCollapsed: !isCollapsed }))
                                    }
                                >
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {isCollapsed ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            onClick={() => handleClickOpen()}
                            sx={{
                                ':hover': {
                                    opacity: 0.8,
                                },
                            }}
                        >
                            <img
                                alt="profile-user"
                                width="50px"
                                height="50px"
                                src={getImg + `${home?.picturePath}`}
                                style={{ cursor: 'pointer', borderRadius: '50%' }}
                            />
                        </Box>
                    ) : (
                        <Box mb="25px">
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                onClick={() => handleClickOpen()}
                                sx={{
                                    ':hover': {
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                <img
                                    alt="profile-user"
                                    width="100px"
                                    height="100px"
                                    src={getImg + `${home?.picturePath}`}
                                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: '10px 0 0 0' }}
                                >
                                    {home ? home?.name : 'Home'}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : '10%'}>
                        {sidebarItems.map((item, key) => {
                            return (
                                <Item
                                    key={key}
                                    title={item.title}
                                    to={item.path}
                                    icon={item.icon}
                                />
                            );
                        })}
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
