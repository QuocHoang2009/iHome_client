export const host = 'https://ihome.onrender.com';

//login
export const registerUser = host + '/auth/register';
export const loginUser = host + '/auth/login';

//node
export const getAllNodes = host + '/nodes/all';
export const getAllRelays = host + '/nodes/allRelay/';
export const addNode = host + '/nodes/addnode/';
export const nodeApi = host + '/nodes/';
export const editNode = host + '/nodes/edit/';
export const getAdeInfor = host + '/nodes/ades/';
export const getSensorInfo = host + '/nodes/sensor/';
export const getRelayChannel = host + '/nodes/relay/';
export const changeStateRelay = host + '/nodes/relay/changestate/';
export const getAllSensors = host + '/nodes/allsensors/';
export const getAllAdeNodes = host + '/nodes/allades/';

//home
export const getAllHomes = host + '/homes/all/';
export const getAllUserHomes = host + '/homes/allUser/';
export const getUserHome = host + '/homes/usershome';
export const getHome = host + '/homes/';
export const addHome = host + '/homes/addhome/';
export const linkHome = host + '/homes';
export const linkHomeSensor = host + '/homes/sensor';
export const unLinkHome = host + '/homes/unlink';
export const unLinkHomeSensor = host + '/homes/unlink/sensor';

//rooms
export const getAllRooms = host + '/rooms/all/';
export const addRoom = host + '/rooms/addroom';
export const roomApi = host + '/rooms/';
export const updateRoom = host + '/rooms';
export const linkRoomRelay = host + '/rooms/link/relay';
export const unlinkRoomRelay = host + '/rooms/unlink/relay';
export const linkRoomSensor = host + '/rooms/link/sensor';
export const unlinkRoomSensor = host + '/rooms/unlink/sensor';

//devices
export const getAllDevices = host + '/devices/all/';
export const getDevicesByRoom = host + '/devices/room/';
export const addDevice = host + '/devices/adddevice';
export const linkDevice = host + '/devices/linkdevice';
export const deviceApi = host + '/devices/';
export const updateDevice = host + '/devices';
export const disconnectRelay = host + '/devices/disconnect';
export const linkButtonApi = host + '/devices/linkbutton';
export const disconnectButtonApi = host + '/devices/disconnectbutton';
export const editDevice = host + '/devices/edit/';

//get information relayADE

//member
export const getAllMembers = host + '/members/all/';
export const getMembersByEmail = host + '/members/findbyemail';
export const memberHomeApi = host + '/members';

export const ADMIN = 'admin';
export const MANAGER = 'manager';
export const USER = 'user';
