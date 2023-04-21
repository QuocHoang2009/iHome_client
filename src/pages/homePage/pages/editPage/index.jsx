import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HeaderChild from "../../../../components/HeaderChild";

const EditPage = () => {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate("/home");
  };

  return (
    <Box m="20px">
      <HeaderChild
        title="My Home"
        subtitle="Edit Home"
        addButton="Save Edit"
        buttonHandle={handleEdit}
      />
      <Stack direction="row" spacing="2px" width="100%">
        <Box>Edit Page</Box>
      </Stack>
    </Box>
  );
};

export default EditPage;
