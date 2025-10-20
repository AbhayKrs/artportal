import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { api_artworkImages } from '../utils/api_routes';
import { a_fetchArtwork, a_handleDislikeArtwork, a_handleLikeArtwork } from '../store/actions/artworks.actions';
import { r_setSnackMessage } from '../store/reducers/common.reducer';

import UserBadge from './Badges/UserBadge';
import Divider from './Divider';
import ImageCarousel from './Carousels/ImageCaroursel';
import PostText from './Typography/PostText';

import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';
import { ReactComponent as LikeIcon } from '../assets/icons/like.svg';
import { ReactComponent as LikeFilledIcon } from '../assets/icons/likefilled.svg';
import { ReactComponent as DislikeIcon } from '../assets/icons/dislike.svg';
import { ReactComponent as DislikeFilledIcon } from '../assets/icons/dislikefilled.svg';
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg';
import { ReactComponent as PinIcon } from '../assets/icons/pin.svg';
import { ReactComponent as LinkIcon } from '../assets/icons/link.svg';
import { ReactComponent as MoreIcon } from '../assets/icons/more.svg';

const PostList = ({ list }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const handleInvalidUser = () => {
        const msgData = {
            open: true,
            message: 'User not logged in. Please Sign In/Sign Up to perform the action.',
            type: 'warning'
        }
        dispatch(r_setSnackMessage(msgData));
    }

    const handleToggleLike = async (status, id) => {
        if (!status) {
            dispatch(a_handleDislikeArtwork({ artworkID: id, userID: user.id }));
        } else {
            dispatch(a_handleLikeArtwork({ artworkID: id, userID: user.id }));
        }
        setTimeout(() => {
            dispatch(a_fetchArtwork(id));
        }, 2000);
    }

    return (
        <div className='flex flex-col gap-4'>
            {list.map(itm => (
                <>
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-row items-center justify-between'>
                                <div className='flex flex-row gap-2'>
                                    <UserBadge icon size="md" link={`/users/${itm.author._id} `} user={itm.author} />
                                    <span className='text-base text-neutral-700 dark:text-gray-300'>{moment(itm.createdAt).fromNow()}</span>
                                </div>
                                <MoreIcon className="h-6 w-6 text-neutral-800 dark:text-gray-400" />
                            </div>
                            <PostText text={itm.full_text} />
                            <ImageCarousel source="posts" size={28} fit="contain" imagePaths={itm.files} />
                        </div>
                        <div className='flex flex-row gap-4'>
                            <div className='flex flex-row items-center gap-1'>
                                {itm.likes.filter(item => item === user.id).length > 0 ?
                                    <button disabled>
                                        <LikeFilledIcon className='w-4 h-4 text-neutral-700 dark:text-gray-200' />
                                    </button>
                                    :
                                    <button
                                        onClick={() => { user.is_verified ? handleToggleLike(true, itm._id) : handleInvalidUser() }}
                                    >
                                        <LikeIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                                    </button>
                                }
                                <p className="font-semibold text-neutral-600 dark:text-gray-400 text-base">
                                    {itm.likes.length}
                                </p>
                            </div>
                            <div className='flex flex-row gap-1'>
                                <CommentIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                                <p className="font-semibold text-neutral-600 dark:text-gray-400 text-base">
                                    {itm.comments.length}
                                </p>
                            </div>
                            <PinIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                            <LinkIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                        </div>
                    </div>
                    <Divider noPadding />
                </>
            ))}
        </div>
    )
}

export default PostList