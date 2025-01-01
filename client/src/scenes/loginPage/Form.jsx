import { useState } from "react"; // import the useState hook
import { 
    Box,    // Box component
    Typography,   // Typography component
    TextField,  // TextField component
    Button,     
    useTheme,   // useTheme hook
    useMediaQuery   // useMediaQuery hook
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';    // EditOutlinedIcon component
import { useDispatch } from "react-redux";  // useDispatch hook
import { Formik } from "formik"; 
import * as Yup from "yup";     // Form validation library
import { useNavigate } from "react-router-dom"; // useNavigate hook
import { setLogin } from "state";  // setLogin action
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";  // FlexBetween component

{/* Form validation schema */}
const registerSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    location: Yup.string().required("Location is required"),
    occupation: Yup.string().required("Occupation is required"),
    picture: Yup.string().required("Picture is required")
});

const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required")
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    occupation: "",
    picture: ""
};

const initialValuesLogin = {
    email: "",
    password: ""
};

{/* Form component */}
const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    {/* Login function */}
    const login = async (values, onSubmitProps) => {
        const loginResponse = await fetch(
            "http://localhost:3001/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            }
        );
        const loggedIn = await loginResponse.json();
        if(loggedIn.user){
            dispatch(setLogin({
                user: loggedIn.user,
                token: loggedIn.token,
            }));
            navigate("/home");
        }
        onSubmitProps.resetForm();
    };

    {/* Register function */}
    const register = async (values, onSubmitProps) => {
        // this allows us to send form info along with the picture
        const formData = new FormData();
        for(let value in values) {
            formData.append(value, values[value]);
        }
        formData.append('picturePath', values.picture.name);

        // get the user response from the server
        const saveUserResponse = await fetch(
            "http://localhost:3001/auth/register",
            {
                method: "POST",
                body: formData
            }
        );
        const registeredUser = await saveUserResponse.json();
        onSubmitProps.resetForm();
        if(registeredUser.user){
            setLogin({
                user: registeredUser.user,
                token: registeredUser.token,
            });
            navigate("/home");
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) {
            await login(values, onSubmitProps);
        }
        if (isRegister) {
            await register(values, onSubmitProps);
        }
    }

    return (
        <Formik onSubmit={handleFormSubmit} initialValues={isLogin ? initialValuesLogin : initialValuesRegister} validationSchema={isLogin ? loginSchema : registerSchema}>
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                resetForm
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box 
                        display="grid" 
                        gap="30px" 
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))" 
                        sx={{
                            "& > div": {gridColumn: isNonMobileScreens ? undefined : "span 4"}
                        }}>
                            {isRegister && (
                                <>
                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                        helperText={touched.firstName && errors.firstName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Last Name"
                                        variant="outlined"
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Location"
                                        variant="outlined"
                                        name="location"
                                        value={values.location}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.location) && Boolean(errors.location)}
                                        helperText={touched.location && errors.location}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        label="Occupation"
                                        variant="outlined"
                                        name="occupation"
                                        value={values.occupation}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                        helperText={touched.occupation && errors.occupation}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Box
                                        gridColumn="span 4"
                                        border={`1px solid S{palette.neutral.medium}`}
                                        borderRadius="5px"
                                        p="1rem"
                                    >
                                        <Dropzone
                                            acceptedFiles=".png, .jpg, .jpeg"
                                            multiple={false}
                                            onDrop={(acceptedFiles) => {
                                                setFieldValue("picture", acceptedFiles[0]);
                                            }}
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <Box
                                                    {...getRootProps()}
                                                    border={`2px dashed ${palette.primary.main}`}
                                                    p="1rem"
                                                    sx={{
                                                        "&:hover": {
                                                            cursor: "pointer"
                                                        }
                                                    }}
                                                >
                                                    <input {...getInputProps()} />
                                                    {!values.picture ? (
                                                        <p>Add Picture Here</p>
                                                    ) : (
                                                        <FlexBetween>
                                                            <Typography>
                                                                {values.picture.name}
                                                            </Typography>
                                                            <EditOutlinedIcon />
                                                        </FlexBetween>
                                                    )}
                                                </Box>
                                            )}
                                        </Dropzone>
                                    </Box>
                                </>
                            )}
                            <TextField
                                label="Email"
                                variant="outlined"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(touched.email) && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(touched.password) && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: "span 2" }}
                            />
                    </Box>
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: "1rem", p:"1rem", backgroundColor: palette.primary.main, color: palette.background.alt, "&:hover": {color: palette.primary.main} }} >
                            {isLogin ? "Login" : "Register"}
                        </Button>
                        <Typography onClick={() => {
                            setPageType(isLogin ? "register" : "login");
                            resetForm();
                            }} 
                            sx={{ textDecoration: "underline", color: palette.primary.main, "&:hover": {cursor: "pointer", color: palette.primary.light} }}>
                            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    );
}

export default Form;