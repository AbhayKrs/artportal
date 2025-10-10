import { useNavigate } from "react-router-dom";
import moment from 'moment';

import { api_artworkImages, api_userImages } from '../../utils/api_routes';
import { ReactComponent as VerifiedIcon } from '../../assets/icons/verified.svg';
import { ReactComponent as Artportal_logo } from '../../assets/icons/artportal_logo.svg';

const UserBadge = ({ size, icon = false, link, user }) => {
    let navigate = useNavigate();

    return (
        <div onClick={() => navigate(link)} className="flex flex-row gap-1 items-center cursor-pointer">
            {icon && <div className={`${size === "sm" ? "w-4 h-4" : "w-6 h-6"} overflow-hidden`}>
                {user.avatar.icon.length > 0 && <img loading='lazy' src={api_userImages(user.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />}
            </div>}
            <div className='flex flex-row items-center gap-1'>
                <p className={`text-neutral-700 dark:text-gray-400 ${size === "sm" ? "text-sm" : "text-base"} font-medium tracking-wide`}>{user.username}</p>
                <VerifiedIcon className={`stroke-current stroke-1 text-neutral-800 dark:text-gray-300 ${size === "sm" ? "h-3.5 w-4" : "h-4 w-4"}`} />
                <Artportal_logo fill="#059669" className={`${size === "sm" ? "h-2.5" : "h-3"} w-auto`} />
            </div>
        </div>
    )
}

export default UserBadge;

