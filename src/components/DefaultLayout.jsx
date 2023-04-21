import { Box, Dialog, DialogTitle } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getImg } from "../const/API";
import Header from "./Header";
import SideBar from "./SideBar";

import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { useTheme } from "@emotion/react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { blue } from "@mui/material/colors";
import { Formik } from "formik";
import Dropzone from "react-dropzone";
import * as yup from "yup";
import { setCurrentHome, setHomesUser } from "../app/state";
import { tokens } from "../app/theme";
import FlexBetween from "./FlexBetween";

import axios from "axios";
import { useDispatch } from "react-redux";
import { addHome, getAllUserHomes } from "../const/API";

import * as React from "react";
import { useEffect } from "react";

const homeSchema = yup.object().shape({
  name: yup.string().required("required"),
  address: yup.string().required("required"),
  mqttPath: yup.string().required("required"),
  picturePath: yup.string().required("required"),
});

const initialValuesHome = {
  name: "",
  address: "",
  mqttPath: "",
  picturePath: "",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalAddHome = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const addHomeHandle = async (values, onSubmitProps) => {
    await axios
      .post(addHome + user._id, {
        body: values,
      })
      .then((res) => {
        const currentHome = res.data;
        if (currentHome === undefined) return;

        dispatch(
          setCurrentHome({
            currentHome: currentHome,
          })
        );

        onSubmitProps.resetForm();
        props.handleCloseModal();
      })
      .catch((error) => {
        if (error?.response) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await addHomeHandle(values, onSubmitProps);
  };

  return (
    <Modal
      keepMounted
      open={props.openModal}
      onClose={props.handleCloseModal}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValuesHome}
          validationSchema={homeSchema}
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
                  "& > div": { gridColumn: "span 4" },
                }}
              >
                <TextField
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={Boolean(touched.name) && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  error={Boolean(touched.address) && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Hub code"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.mqttPath}
                  name="mqttPath"
                  error={Boolean(touched.mqttPath) && Boolean(errors.mqttPath)}
                  helperText={touched.mqttPath && errors.mqttPath}
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
                      setFieldValue("picturePath", acceptedFiles[0])
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
                        {!values.picturePath ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picturePath.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
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
                  {"ADD HOME"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

const SimpleDialog = (props) => {
  const { onClose, selectedValue, open } = props;
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const user = useSelector((state) => state.user);
  const apiGetHomes = getAllUserHomes + user._id;
  const homes = useSelector((state) => state.homesUser);

  useEffect(() => {
    (async () => {
      const res = await axios.get(apiGetHomes);
      if (res?.data) {
        dispatch(setHomesUser({ homesUser: res.data }));
      }
    })();
  }, [dispatch, apiGetHomes]);

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={() => handleClose()} open={open}>
      <DialogTitle minWidth="200px">SET HOME</DialogTitle>
      <List sx={{ pt: 0 }}>
        {homes.map((home, index) => (
          <ListItem disableGutters key={index}>
            <ListItemButton onClick={() => handleListItemClick(home)}>
              <ListItemAvatar>
                {home?.picturePath ? (
                  <Avatar src={getImg + `${home.picturePath}`} />
                ) : (
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText primary={home?.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <ListItemButton autoFocus onClick={() => handleOpenModal()}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add Home" />
          </ListItemButton>
        </ListItem>
      </List>
      <ModalAddHome openModal={openModal} handleCloseModal={handleCloseModal} />
    </Dialog>
  );
};

function DefaultLayout(props) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    useSelector((state) => state.currentHome)
  );
  const dispatch = useDispatch();
  const user = useState(useSelector((state) => state.user));
  const homes = useState(useSelector((state) => state.homes));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);

    const homeRes = homes[0].find((home) => {
      return home.user === user[0]._id && home.home === value._id;
    });

    dispatch(setCurrentHome({ currentHome: homeRes }));
  };

  return (
    <Stack direction="row" width="100%">
      <SideBar handleClickOpen={() => handleClickOpen()} />
      <Stack width="100%">
        <Header />
        {props.children}
      </Stack>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </Stack>
  );
}

export default DefaultLayout;
