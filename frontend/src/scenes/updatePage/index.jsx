import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";

import UserWidget from "scenes/widgets/UserWidget";
import UpdateWidget from "scenes/widgets/UpdateWidget";

const UpdatePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis=  "26%">
          <UserWidget userId={userId} picturePath={user.picturePath} />
        </Box>
        <Box
            flexBasis="42%"
        >
          <UpdateWidget  userId={userId} picturePath={user.picturePath} />
        </Box>
      </Box>
    </Box>
  );
};

export default UpdatePage;