import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Logout from '@mui/icons-material/Logout';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Settings from '@mui/icons-material/Settings';
import { Box, Divider, IconButton, useTheme } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import InputBase from "@mui/material/InputBase";
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout } from "../app/state";
import { ColorModeContext, tokens } from "../app/theme";
import { getImg } from "../const/API";

const Header = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = () => {
    setAnchorEl(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = ()=>{
    dispatch(setLogout());
    navigate('/login');
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      <Box display="flex">
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            width="45px"
            height="45px"
        >
          <IconButton 
            width="100%"
            height="100%" 
            onClick={colorMode.toggleColorMode}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Box>

        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            width="45px"
            height="45px"
        >
          <IconButton 
            width="100%"
            height="100%"
          >
            <NotificationsOutlinedIcon />
          </IconButton>
        </Box>
      
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar src={getImg + `${user?.picturePath}`} sx={{ width: 45, height: 45 }}/>
          </IconButton>
        </Tooltip>
      
        <Menu
          anchorEl={()=> {return anchorEl}}
          id="account-menu"
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
            <MenuItem onClick={()=> navigate('/profile')}>
              <Avatar src={getImg + `${user?.picturePath}`} /> 
              {user?.firstName + " " + user?.lastName}
            </MenuItem>
            <Divider/>
            <MenuItem onClick={()=> navigate('/settings')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;