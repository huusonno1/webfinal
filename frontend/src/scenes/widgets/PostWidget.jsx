import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, TextField, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import FriendComment from "components/FriendComment";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState(comments || []);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  useEffect(() => {
      const fetchComments = async () => {
          const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
              method: "GET",
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          const data = await response.json();
          setPostComments(data);
      };

      if (isComments) {
          fetchComments();
      }
  }, [isComments, postId, token]);

  const patchLike = async () => {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
          method: "PATCH",
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
  };

  const handleCommentSubmit = async () => {
      if (!commentText.trim()) return;

      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
          method: "POST",
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: commentText, user_id: loggedInUserId }),
      });

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setPostComments(updatedPost.comments); // Update comments in state
      setCommentText(""); // Clear the input field
  };

  return (
      <WidgetWrapper m="2rem 0">
          <Friend
              friendId={postUserId}
              name={name}
              subtitle={location}
              userPicturePath={userPicturePath}
          />
          <Typography color={main} sx={{ mt: "1rem" }}>
              {description}
          </Typography>
          {picturePath && (
              <img
                  width="100%"
                  height="auto"
                  alt="post"
                  style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                  src={`http://localhost:3001/assets/${picturePath}`}
              />
          )}
          <FlexBetween mt="0.25rem">
              <FlexBetween gap="1rem">
                  <FlexBetween gap="0.3rem">
                      <IconButton onClick={patchLike}>
                          {isLiked ? (
                              <FavoriteOutlined sx={{ color: primary }} />
                          ) : (
                              <FavoriteBorderOutlined />
                          )}
                      </IconButton>
                      <Typography>{likeCount}</Typography>
                  </FlexBetween>

                  <FlexBetween gap="0.3rem">
                      <IconButton onClick={() => setIsComments(!isComments)}>
                          <ChatBubbleOutlineOutlined />
                      </IconButton>
                      <Typography>{postComments.length}</Typography>
                  </FlexBetween>
              </FlexBetween>

              <IconButton>
                  <ShareOutlined />
              </IconButton>
          </FlexBetween>
          {isComments && (
              <Box mt="0.5rem">
                  {postComments.map((comment, i) => (
                      <Box key={i}>
                          <Divider />
                          <FlexBetween gap="1rem" sx={{ m: "0.5rem 0", pl: "1rem" }}>
                              {comment.user && comment.user._id && ( // Kiểm tra xem user và user._id có tồn tại
                                  <FriendComment
                                      friendId={comment.user._id}
                                      name={`${comment.user.firstName} ${comment.user.lastName}`}
                                      userPicturePath={comment.user.picturePath}
                                  />
                              )}
                              <Typography sx={{ color: main }}>{comment.comment}</Typography>
                          </FlexBetween>
                      </Box>
                  ))}

                  <Divider />
                  <Box display="flex" alignItems="center" mt="1rem">
                      <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button
                          variant="contained"
                          color="primary"
                          onClick={handleCommentSubmit}
                          sx={{ ml: "1rem" }}
                      >
                          Post
                      </Button>
                  </Box>
              </Box>
          )}
      </WidgetWrapper>
  );
};

export default PostWidget;
