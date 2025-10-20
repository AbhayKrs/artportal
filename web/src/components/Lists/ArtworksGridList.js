import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api_artworkImages } from '../../utils/api_routes';

import MasonryGrid from '../Grids/Masonry';

const ArtworksGridList = ({ search, list }) => {
    const navigate = useNavigate();
    const [listData, setListData] = useState([]);

    useEffect(() => {
        if (search && search.length > 0) {
            list = list.filter(itm => itm.title.includes(search));
        }
        setListData(list);
    }, [search, list])

    return (
        <MasonryGrid cols={5}>
            {listData.map((item, index) => (
                <div onClick={() => navigate(`/artworks/${item._id}`)} className='relative group group-hover:block cursor-pointer'>
                    <img loading='lazy'
                        id={index}
                        className='object-cover w-full h-full'
                        src={api_artworkImages(item.files[0])}
                    />
                </div>
            ))}
        </MasonryGrid>
    )
}

export default ArtworksGridList;