import { useNavigate } from "react-router-dom";
import moment from 'moment';

import { api_artworkImages, api_userImages } from '../../utils/api_routes';

const EventCard = ({ size, artwork }) => {
    let navigate = useNavigate();

    return (
        <div className={`relative flex-none rounded-md  cursor-pointer ${size === 'l' ? 'h-44 w-full' : 'h-40 w-full'}`} onClick={() => { }}>
            {artwork.files[0].length > 0 && <img src={api_artworkImages(artwork.files[0])} className='object-cover w-full h-full rounded-md' />}
            <div className="items-end h-full w-full absolute top-0 flex flex-row">
                <div className="flex flex-col w-full pb-2 pt-14 px-2 bg-gradient-to-t from-black text-gray-200" >
                    <h3 className={`${size === 'l' ? 'text-base' : 'text-sm'} font-bold leading-5 capitalize`}>[Event] {artwork.title.length > 20 ? artwork.title.slice(0, 20) + "..." : artwork.title}</h3>
                    <p className={`${size === 'l' ? 'text-sm' : 'text-xs'} font-medium leading-5 capitalize`}>{artwork.description.length > 20 ? artwork.description.slice(0, 20) + "..." : artwork.description}</p>
                </div >
            </div>
        </div >
    )
}

export default EventCard;