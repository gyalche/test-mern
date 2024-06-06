import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import { getUserInfo, storeAccessToken, storeRefreshToken, storeUserInfo } from '../../services/redux/slices/user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const settings = ['Profile', 'Change password', 'Logout'];
export const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const navigate=useNavigate()
  const dispatch=useDispatch();
  const user=useSelector(getUserInfo);
  console.log("userInfo", user)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (value:string) => {
  if(value==="Logout"){
    dispatch(storeUserInfo({}));
    dispatch(storeAccessToken(''));
    dispatch(storeRefreshToken(''))
    navigate('/')
  }
    setAnchorElUser(null);
  };
  return (
    <div className="navbar">
      <Typography variant="h5" sx={{ textShadow: '1px 1px 2px silver' }}>
        TASK KEEPER
      </Typography>

      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open">
          <IconButton onClick={handleOpenUserMenu} sx={{border:'2px solid', maxHeight:'30px', maxWidth:'30px'}}>
            {!user.profile?.url ? (<>
              <p>{user?.name[0].toUpperCase()}</p>
            </>):(
            <Avatar alt="Remy Sharp" src={user?.profile?.url} style={{objectFit:'contain'}} />
            )}
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={()=>handleCloseUserMenu(setting)}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </div>
  );
};
