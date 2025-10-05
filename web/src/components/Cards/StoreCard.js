import { useNavigate } from "react-router-dom";

import { api_productImages } from '../../utils/api_routes';
import { ReactComponent as CartAddIcon } from '../../assets/icons/cart_add.svg';
import UserBadge from "../Badges/UserBadge";

const StoreCard = ({ size, product, seller }) => {
    let navigate = useNavigate();
    console.log("product", product)

    return (
        <div className={`flex-none rounded-md cursor-pointer ${size === 'l' ? 'h-52 w-full' : 'h-40 w-full'}`} onClick={() => navigate(`/store/${product._id}`)}>
            {product.images[0].length > 0 && <img src={api_productImages(product.images[0])} className='object-cover h-36 w-full rounded-md' />}
            < div className="flex flex-row justify-between text-gray-200 rounded-b-md py-2 px-1 w-full" >
                <div className="flex flex-col">
                    <h3 className={`${size === 'l' ? 'text-base' : 'text-sm'} font-bold leading-5 capitalize`}>{product.title.length > 20 ? product.title.slice(0, 20) + "..." : product.title}</h3>
                    <UserBadge size="sm" link={`/ users / ${product.seller._id} `} user={seller} />
                </div>
                <div className="flex flex-row gap-1 items-start ml-1">
                    <div class="text-xs py-1 px-1.5 text-nowrap rounded-md bg-blue-700">USD $4.89</div>
                    <CartAddIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                </div>
            </div >
        </div >
    )
}

export default StoreCard;