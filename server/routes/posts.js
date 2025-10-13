import express from 'express';
const router = express.Router();

import { postBucket, postUpl } from '../config/gridfs_config.js';
import { protect } from '../middleware/authMw.js';

import NodeCache from "node-cache";
const imageCache = new NodeCache({ stdTTL: 3600 });

//Import Schemas
import Post from '../models/post.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';

// @route   GET api/v1.01/artworks/image/:filename --- Image from gridFS storage --- Public
router.get('/image/:filename', async (req, res) => {
    const { filename } = req.params;
    const MAX_RETRIES = 3; // number of retry attempts
    const RETRY_DELAY_MS = 300; // base delay in ms for exponential backoff

    const cachedImage = imageCache.get(filename);
    if (cachedImage) {
        res.set({
            "Content-Type": cachedImage.contentType,
            "Cache-Control": "public, max-age=31536000", // browser cache
        });
        return res.send(cachedImage.buffer);
    }

    const fetchImageFromGridFS = (attempt = 1) => {
        try {
            const downloadStream = postBucket.openDownloadStreamByName(filename);
            let chunks = [];

            downloadStream.on("data", (chunk) => chunks.push(chunk));

            downloadStream.on("end", () => {
                const fileBuffer = Buffer.concat(chunks);

                // Guess content type by extension (basic way)
                let contentType = "image/jpeg";
                if (filename.endsWith(".webp")) contentType = "image/webp";
                if (filename.endsWith(".png")) contentType = "image/png";
                if (filename.endsWith(".gif")) contentType = "image/gif";

                // 3. Save to cache
                imageCache.set(filename, { buffer: fileBuffer, contentType });

                // 4. Send to client
                res.set({
                    "Content-Type": contentType,
                    "Cache-Control": "public, max-age=31536000",
                });
                res.send(fileBuffer);
            });

            downloadStream.on("error", (err) => {
                console.error("GridFS error:", err);
                if (attempt < MAX_RETRIES) {
                    const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
                    console.log(`Retrying in ${delay}ms...`);
                    setTimeout(() => fetchImageFromGridFS(attempt + 1), delay);
                } else {
                    return res.status(404).json({ err: "File not found after retries" });
                }
            });
        } catch (err) {
            console.log("Server err", err);
            if (attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
                console.log(`Retrying in ${delay}ms due to server error...`);
                setTimeout(() => fetchImageFromGridFS(attempt + 1), delay);
            } else {
                return res.status(500).json({ msg: err.message });
            }
        }
    }

    fetchImageFromGridFS();
});

// @route   GET api/v1.01/posts --- Fetch all posts --- Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'name username avatar is_verified is_premium')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name username avatar'
                }
            });
        res.json(posts);
    } catch (err) {
        res.status(500).send('Unable to fetch posts');
    }
});

// @route   Get api/v1.01/posts/:id --- Fetch post by ID --- Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name username avatar')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name username avatar'
                }
            });
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('Unable to fetch artwork item');
    }
});

// @route   POST api/v1.01/posts/new --- Create new post --- Private
router.post('/new', protect, postUpl.any(), async (req, res) => {
    try {
        const user = await User.findById(req.body.userID);

        const newPost = new Post({
            author: user._id,
            visibility: "public",
            full_text: req.body.title,
            files: req.files.map(file => { return file.filename }),
            poll: {
                question: req.body.poll.question,
                multiple_choice: req.body.poll.isMultipleChoice,
                options: req.body.poll.options,
                expires_at: req.body.poll.expiry
            },
            views: [],
            likes: [],
            comments: []
        });

        newPost.save()
            .then(data => res.send(data))
            .catch(err => console.log(err))
    } catch (err) {
        console.log("err: ", err)
        return res.status(404).json({ msg: err.name });
    }
});

// @route   PUT Edit api/v1.01/posts/:id --- Edit post details --- Private
router.put('/:id', protect, function (req, res) {
    try {
        const updatedPost = { ...req.body };
        Post.findByIdAndUpdate(req.params.id, { $set: updatedPost }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.send(data);
            }
        });
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   Delete api/v1.01/posts/:id --- Delete a post --- Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("No such post found!");
        }

        post.files.map(async file => {
            const to_delete = await postBucket.find({ filename: file });
            const fileToDelete = await to_delete.next();
            if (!fileToDelete) return;
            postBucket.delete(fileToDelete._id);
        });

        const users = await User.find({});
        users.map(user => {
            if (user.post_bookmarks.some(item => item === req.params.id)) {
                user.post_bookmarks = [...user.post_bookmarks.filter(item => item != req.params.id)];
            }
            user.save();
        })
        post.deleteOne({ _id: artwork._id });
        res.send('Post removed successfully!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Post removal failed!');
    }
});

// @route   PUT api/v1.01/posts/:id/like --- Like a post --- Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        try {
            Post.findByIdAndUpdate(
                req.params.id, {
                $addToSet: { likes: req.body.userID }
            },
                { new: true }
            )
                .then(() => {
                    return res.json("Success");
                })
                .catch(err => {
                    console.log(err);
                });
        } catch (err) {
            res.status(500).send('Failed to get likes count!');
        }
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   PUT api/v1.01/posts/:id/dislike --- Dislike a post --- Private
router.put('/:id/dislike', protect, async (req, res) => {
    try {
        try {
            Post.findByIdAndUpdate(
                req.params.id, {
                $pull: { likes: req.body.userID }
            },
                { new: true }
            )
                .then(() => {
                    return res.json("Success");
                })
                .catch(err => {
                    console.log(err);
                });
        } catch (err) {
            res.status(500).send('Failed to get likes count!');
        }
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/posts/:id/comments --- Fetch post comments --- Public
router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.send(post.comments);
    } catch (err) {
        res.status(500).send('Adding a comment failed');
    }
});

// @route   POST api/v1.01/posts/:id/comments/new --- Add a new comment --- Private
router.post('/:id/comments/new', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.body.userID);

        const newComment = new Comment({
            author: user._id,
            text: req.body.text,
            is_parent: req.body.isParent,
            parent_ref: req.body.parentID,
            likes: []
        });

        newComment.save()
            .then(savedComment => {
                post.comments.push(savedComment._id);
                post.save();
                res.send(post.comments);
            })
            .catch(error => {
                console.error('Error saving comment:', error);
            });
    } catch (err) {
        console.log("err", err);
        res.status(500).send('Adding a comment failed');
    }
});

// @route   PUT api/v1.01/artworks/:id/comments/:comment_id --- Edit a comment --- Private
router.put('/:id/comments/:comment_id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = await Comment.findById(req.params.comment_id);

        if (!comment) {
            return res.status(401).json({ msg: 'Comment does not exist!' })
        }

        await Comment.findByIdAndUpdate(
            req.params.comment_id,
            { text: req.body.text },
            { new: true },
            async (err, updatedComment) => {
                if (err) {
                    console.log(err)
                } else {
                    const index = post.comments.findIndex(comment => comment._id === updatedComment._id);
                    post.comments[index] = updatedComment;
                    post.save();
                }
            }
        );
        return res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Editing a comment failed');
    }
});

// @route   DELETE api/v1.01/artworks/:id/comments/:comment_id --- Delete a comment --- Private
router.delete('/:id/comments/:comment_id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === req.params.comment_id);

        if (commentIndex === -1) {
            return res.status(404).json({ msg: 'Comment does not exist!' });
        }

        await Comment.findByIdAndDelete(req.params.comment_id)
            .then(deletedComment => {
                if (deletedComment) {
                    post.comments.splice(commentIndex, 1);
                    post.save();
                    return res.json(post.comments);
                } else {
                    console.log('Comment not found in the Comment collection.');
                }
            })
            .catch(error => {
                console.error('Error deleting comment from Comment collection:', error);
            });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Deleting a comment failed');
    }
});

// @route   PUT api/v1.01/artworks/:id/comments/:comment_id/like --- Like a comment --- Private
router.put('/:id/comments/:comment_id/like', protect, async (req, res) => {
    try {
        Comment.findByIdAndUpdate(
            req.params.comment_id, {
            $addToSet: { likes: req.body.userID }
        },
            { new: true }
        )
            .then(() => {
                return res.json("Success");
            })
            .catch(err => {
                console.log(err);
            });
    } catch (err) {
        console.log("err", err);
        res.status(500).send('Failed to like comment!');
    }
});

// @route   PUT api/v1.01/artworks/:id/comments/:comment_id/dislike --- Dislike a comment --- Private
router.put('/:id/comments/:comment_id/dislike', protect, async (req, res) => {
    try {
        Comment.findByIdAndUpdate(
            req.params.comment_id, {
            $pull: { likes: req.body.userID }
        },
            { new: true }
        )
            .then(() => {
                return res.json("Success");
            })
            .catch(err => {
                console.log(err);
            });
    } catch (err) {
        res.status(500).send('Failed to dislike comment!');
    }
});

export default router;
