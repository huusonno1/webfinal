import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import NavBar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";


const HomePage = () => {
    const { _id, picturePath } = useSelector((state) => state.user);

    return (
        <Box>
            <NavBar />
            <Box
                width="100%"
                padding="2rem 6%"
                display= "flex"
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={ "26%" }>
                    <UserWidget userId={_id} picturePath={picturePath} />
                </Box>
                <Box flexBasis="42%" >
                    <MyPostWidget picturePath={picturePath} />
                </Box>
            </Box>
        </Box>
    );
}

export default HomePage;