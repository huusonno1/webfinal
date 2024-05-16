import Post from "../models/Post.js"
import User from "../models/User.js";

/* CREATE */
const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

/* READ */
const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

// COMMENT
const addComment = async (req, res) => {
    const { id } = req.params;
    const { comment, user_id } = req.body;

    if (!comment || !user_id) {
        return res.status(400).json({ message: 'Comment and user_id are required' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ comment, user_id });
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get comments for a post
const getComments = async (req, res) => {
    const { id  } = req.params;

    try {
        const post = await Post.findById(id).populate({
            path: 'comments.user_id',
            select: 'firstName lastName picturePath'
        });

        if (!post) return res.status(404).json({ message: 'Post not found' });

        const commentsWithUserDetails = post.comments.map(comment => ({
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            user: {
                _id: comment.user_id._id,
                firstName: comment.user_id.firstName,
                lastName: comment.user_id.lastName,
                picturePath: comment.user_id.picturePath
            }
        }));

        res.status(200).json(commentsWithUserDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export {
    createPost,
    getFeedPosts,
    getUserPosts,
    likePost,
    addComment,
    getComments,
};

