import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selected: 'Home',
    isCollapsed: false,
    mode: 'light',
    user: null,
    token: null,
    homesUser: [],
    home: null,
    homes: [],
    currentHome: null,
    nodes: [],
    relayNodes: [],
    members: [],
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsCollapsed: (state, action) => {
            state.isCollapsed = action.payload.isCollapsed;
        },
        setSelected: (state, action) => {
            state.selected = action.payload.selected;
        },
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setHome: (state, action) => {
            state.home = action.payload.home;
        },
        setHomes: (state, action) => {
            state.homes = action.payload.homes;
        },
        setHomesUser: (state, action) => {
            state.homesUser = action.payload.homesUser;
        },
        setCurrentHome: (state, action) => {
            state.currentHome = action.payload.currentHome;
        },
        setNodes: (state, action) => {
            state.nodes = action.payload.nodes;
        },
        setRelayNodes: (state, action) => {
            state.relayNodes = action.payload.relayNodes;
        },
        setMembers: (state, action) => {
            state.members = action.payload.members;
        },
    },
});

export const {
    setIsCollapsed,
    setSelected,
    setMode,
    setLogin,
    setLogout,
    setHome,
    setHomes,
    setCurrentHome,
    setNodes,
    setHomesUser,
    setRelayNodes,
    setMembers,
} = authSlice.actions;

export default authSlice.reducer;
