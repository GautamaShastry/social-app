import React from 'react'
import { useState } from 'react';
import { 
    Box,
    IconButton,
    Typography,
    InputBase,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Select
} from '@mui/material';

import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Help,
    Menu,
    Close,
    Notifications
} from "@mui/icons-material";

import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from 'state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch(); // used to dispatch actions
    const navigate = useNavigate(); // used to navigate to different routes
    const user = useSelector((state) => state.user); // get the user from the state
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); // check if the screen is not mobile
    const theme = useTheme(); // get the current theme
    const neutralLight = theme.palette.neutral.light; // get the light neutral color
    const dark = theme.palette.neutral.dark; // get the dark neutral color
    const background = theme.palette.background.default; // get the default background color
    const primaryLight = theme.palette.primary.light; // get the light primary color
    const alt = theme.palette.background.alt; // get the alt background color

    const fullName = `${user.firstName} ${user.lastName}`; // get the user's full name

    return (
        <FlexBetween padding="1rem 6%" backgroundColor={background}>
            <FlexBetween gap="1.75rem">
                {/* LOGO */}
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate("/home")}
                    sx={{ 
                        "&:hover": {
                            cursor: "pointer",
                            color: primaryLight,
                        },
                    }}
                >
                    The Friends Hub
                </Typography>
                {/* SEARCH BAR */}
                {isNonMobileScreens && (
                    <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                        <InputBase
                            placeholder="Search..." />
                                <IconButton>
                                    <Search />
                                </IconButton>
                    </FlexBetween>
                )}
            </FlexBetween>
            {/* DESKTOP NAV */}
            {isNonMobileScreens ? (
                <FlexBetween gap="2rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === "dark" ? <DarkMode sx={{fontSize: "25px"}} /> : <LightMode sx={{ color: dark, fontSize: "25px" }} />}
                    </IconButton>
                    <Message sx={{ fontSize: "25px" }} />
                    <Notifications sx={{ fontSize: "25px" }} />
                    <Help sx={{ fontSize: "25px" }} />
                    <FormControl variant='standard' value={fullName} sx={{ fontSize: "25px" }}>
                        <Select
                            value={fullName}
                            sx={{ backgroundColor: neutralLight, borderRadius: "0.25rem", width: "150px", p: "0.25rem 1rem", "& .MuiSvgIcon-root": {
                                pr: "0.25rem",
                                width: "3rem",
                            },
                            "& .MuiSelect-select:focus": {
                                backgroundColor: neutralLight,
                            }
                        }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                dispatch(setLogout());
                                navigate("/");
                            }}>
                                <Typography>Logout</Typography>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </FlexBetween>
            ) : (
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                <Menu />
            </IconButton>
        )}
        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
            <Box
                position="fixed"
                right="0"
                bottom="0"
                zIndex="10"
                height="100%"
                minWidth="300px"
                maxWidth="500px"
                backgroundColor={background}
            >
                <Box display="flex" justifyContent="flex-end" padding="1rem">
                    <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                        <Close />
                    </IconButton>
                </Box>
                { /* MENU ITEMS */}
                <FlexBetween display="flex" flexDirection="column" gap="3rem" justifyContent="center" alignItems="center">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === "dark" ? <DarkMode sx={{fontSize: "25px"}} /> : <LightMode sx={{ color: dark, fontSize: "25px" }} />}
                    </IconButton>
                    <Message sx={{ fontSize: "25px" }} />
                    <Notifications sx={{ fontSize: "25px" }} />
                    <Help sx={{ fontSize: "25px" }} />
                    <FormControl variant='standard' value={fullName} sx={{ fontSize: "25px" }}>
                        <Select
                            value={fullName}
                            sx={{ backgroundColor: neutralLight, borderRadius: "0.25rem", width: "150px", p: "0.25rem 1rem", "& .MuiSvgIcon-root": {
                                pr: "0.25rem",
                                width: "3rem",
                            },
                            "& .MuiSelect-select:focus": {
                                backgroundColor: neutralLight,
                            }
                        }}
                        input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                dispatch(setLogout());
                                navigate("/");
                            }}>
                                <Typography>Logout</Typography>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </FlexBetween>
            </Box>
        )}
        </FlexBetween>
    );
}

export default Navbar;
