import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
    Box,
    Button,
    TextField, Typography, useMediaQuery, useTheme
} from "@mui/material";
import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { setLogin } from "../../app/state";
import { tokens } from "../../app/theme";
import FlexBetween from "../../components/FlexBetween";
import { loginUser, registerUser } from "../../const/API";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    userName: yup.string().required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    picture: yup.string().required("required"),
    age: yup.number().required("required")
});

const loginSchema = yup.object().shape({
    userName: yup.string().required("required"),
    password: yup.string().required("required"),
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    location: "",
    picture: "",
    age: 0,
};

const initialValuesLogin = {
    userName: "",
    password: "",
};


const Form = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [pageType, setPageType] = useState("login");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    
    const register = async (values, onSubmitProps) => {
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value]);
        }
        formData.append("picturePath", values.picture.name);

        const savedUserResponse = await fetch(
            registerUser,
            {
                method: "POST",
                body: formData,
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            setPageType("login");
        }
    };

    const login = async (values, onSubmitProps) => {
        await axios.post(loginUser, {
            body: values,
        })
        .then((res) => {
            const loggedIn = res.data;
            if (loggedIn === undefined) return;

            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );

            onSubmitProps.resetForm();
            navigate("/");
        })
        .catch((error) => {
            if(error?.response){
                console.log(error.response.data.msg);
            }
            else{
                console.log(error);
            }
        });
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                >
                    {isRegister && (
                    <>
                        <TextField
                            label="First Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName"
                            error={
                                Boolean(touched.firstName) && Boolean(errors.firstName)
                            }
                            helperText={touched.firstName && errors.firstName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Last Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastName"
                            error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            name="location"
                            error={Boolean(touched.location) && Boolean(errors.location)}
                            helperText={touched.location && errors.location}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Age"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.age}
                            name="age"
                            helperText={touched.age && errors.age}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <Box
                        gridColumn="span 4"
                        border={`1px solid ${colors.primary[500]}`}
                        borderRadius="5px"
                        p="1rem"
                        >
                        <Dropzone
                            acceptedFiles=".jpg,.jpeg,.png"
                            multiple={false}
                            onDrop={(acceptedFiles) =>
                            setFieldValue("picture", acceptedFiles[0])
                            }
                        >
                            {({ getRootProps, getInputProps }) => (
                            <Box
                                {...getRootProps()}
                                border={`2px dashed ${colors.primary[500]}`}
                                p="1rem"
                                sx={{ "&:hover": { cursor: "pointer" } }}
                            >
                                <input {...getInputProps()} />
                                {!values.picture ? (
                                <p>Add Picture Here</p>
                                ) : (
                                <FlexBetween>
                                    <Typography>{values.picture.name}</Typography>
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
                        label="user name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.userName}
                        name="userName"
                        error={Boolean(touched.userName) && Boolean(errors.userName)}
                        helperText={touched.userName && errors.userName}
                        sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        name="password"
                        error={Boolean(touched.password) && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{ gridColumn: "span 4" }}
                    />
                </Box>

                {/* BUTTONS */}
                <Box>
                    <Button
                        fullWidth
                        type="submit"
                        sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: colors.primary[500],
                            color: colors.greenAccent[600],
                            "&:hover": { color: colors.greenAccent[400] },
                        }}
                    >
                        {isLogin ? "LOGIN" : "REGISTER"}
                    </Button>

                    <Typography
                        onClick={() => {
                            setPageType(isLogin ? "register" : "login");
                            resetForm();
                        }}
                        sx={{
                            textDecoration: "underline",
                            color: colors.greenAccent[600],
                            "&:hover": {
                            cursor: "pointer",
                            color: colors.greenAccent[400],
                            },
                        }}
                    >
                    {isLogin
                        ? "Don't have an account? Sign Up here."
                        : "Already have an account? Login here."}
                    </Typography>
                </Box>
                </form>
            )}
        </Formik>
    )
};

export default Form;