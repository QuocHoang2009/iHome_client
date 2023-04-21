import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ChartsPage from "../pages/chartsPage";
import ContactsPage from "../pages/contactsPage";
import DevicesPage from "../pages/devicesPage";
import FAQPage from "../pages/faqPage";
import HomePage from "../pages/homePage";
import MembersPage from "../pages/membersPage";
import NodesPage from "../pages/nodesPage";
import RoomsPage from "../pages/roomsPage";

const sidebarItems = [
  {
    title: "Home",
    path: "/home",
    icon: <HomeOutlinedIcon />,
    component: HomePage,
  },
  {
    title: "Members",
    path: "/members",
    icon: <PeopleOutlinedIcon />,
    component: MembersPage,
  },
  {
    title: "Rooms",
    path: "/rooms",
    icon: <DoorFrontIcon />,
    component: RoomsPage,
  },
  {
    title: "Devices",
    path: "/devices",
    icon: <DevicesOtherIcon />,
    component: DevicesPage,
  },
  {
    title: "Nodes",
    path: "/nodes",
    icon: <DeviceThermostatIcon />,
    component: NodesPage,
  },
  {
    title: "Charts",
    path: "/charts",
    icon: <TimelineOutlinedIcon />,
    component: ChartsPage,
  },
  {
    title: "Contacts Information",
    path: "/contacts",
    icon: <ContactsOutlinedIcon />,
    component: ContactsPage,
  },
  {
    title: "FAQ Page",
    path: "/faq",
    icon: <HelpOutlineOutlinedIcon />,
    component: FAQPage,
  },
];

export default sidebarItems;
