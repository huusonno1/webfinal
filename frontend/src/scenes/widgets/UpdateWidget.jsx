import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, InputBase, Button, IconButton } from "@mui/material";
import UserImage from "components/UserImage";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPosts } from "state";
  
const UpdateWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [location, setLocation] = useState("");
    const [occupation, setOccupation] = useState("");
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const mediumMain = palette.neutral.mediumMain;
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        getUser();
    }, []);

    if (!user) {
        return null;
    }

    

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("occupation", occupation);
        formData.append("location", location);
        if (image) {
          formData.append("picture", image);
          formData.append("picturePath", image.name);
        }
    
        const updateUserResponse = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await updateUserResponse.json();
        setUser(data);
    };


    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                        margin: "1rem"
                    }}
                />
            </FlexBetween>
            <FlexBetween gap="1.5rem">
                <InputBase
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                        margin: "1rem"
                    }}
                />
            </FlexBetween>
            <FlexBetween gap="1.5rem">
                <InputBase
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                        margin: "1rem"
                    }}
                />
            </FlexBetween>
            <FlexBetween gap="1.5rem">
                <InputBase
                    placeholder="Location"
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                        margin: "1rem"
                    }}
                />
            </FlexBetween>
            <FlexBetween gap="1.5rem">   
                <InputBase
                    placeholder="Occupation"
                    onChange={(e) => setOccupation(e.target.value)}
                    value={occupation}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                        margin: "1rem"
                    }}
                />
            </FlexBetween>

            {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    <input {...getInputProps()} />
                                    {!image ? (
                                        <p>Add Image Here</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{image.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0" }} /> 
            
            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Image
                    </Typography>
                </FlexBetween>

                <Button
                    disabled={!firstName && !lastName && !location && !occupation}
                    onClick={() => {
                        if (firstName || lastName || location || occupation) { // Kiểm tra có ít nhất một trường đã được nhập
                            handleUpdate(); // Gọi hàm handleUpdate khi có dữ liệu được nhập
                        } else {
                            console.log("Please enter at least one field!"); // Thông báo khi không có dữ liệu nhập
                        }
                    }}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                    }}
                >
                    UPDATE
                </Button>
            </FlexBetween>
        </WidgetWrapper>
    );

}

export default UpdateWidget;