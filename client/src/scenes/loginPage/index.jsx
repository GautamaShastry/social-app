import React from 'react'
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Form from './Form';

const LoginPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    return (
        <Box>
            <Box width="100%" backgroundColor={theme.palette.background.alt} p="1rem 6%" textAlign="center">
                <Typography
                    fontWeight="bold"
                    fontSize="32px"
                    color='primary'
                >
                    The Friends Hub
                </Typography>
            </Box>
            <Box width={isNonMobileScreens ? "50%" : "93%"} margin="2rem auto" padding="2rem" backgroundColor={theme.palette.background.alt}>
                <Typography
                    fontWeight="500"
                    variant='h5'
                    sx={{ marginBottom: "1.5rem" }}
                >
                    Welcome to The Friends Hub, a social media platform for developers.
                </Typography>
                <Form />
            </Box>
        </Box>
    );
}

export default LoginPage;
