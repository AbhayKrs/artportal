import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { api_productImages } from '../../utils/api_routes';
import { ReactComponent as CartAddIcon } from '../../assets/icons/cart_add.svg';
import { ReactComponent as CartRemoveIcon } from '../../assets/icons/cart_remove.svg';

import UserBadge from "../Badges/UserBadge";
import { a_addToCart, a_removeFromCart } from "../../store/actions/user.actions";
import Ratings from "../Ratings";

const StoreCard = ({ size, product, seller }) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    return (
        <div className={`flex-none rounded-md cursor-pointer ${size === 'l' ? 'h-52 w-full' : 'h-40 w-full'}`} onClick={() => navigate(`/store/${product._id}`)}>
            {product.images[0].length > 0 && <img src={api_productImages(product.images[0])} className='object-cover h-48 w-full rounded-md' />}
            <div className="flex flex-col gap-1 text-neutral-800 dark:text-gray-200 rounded-b-md py-2 px-1 w-full" >
                <div className="flex flex-col gap-0.5">
                    <h3 className={`${size === 'l' ? 'text-base' : 'text-sm'} font-bold capitalize`}>{product.title.length > 40 ? product.title.slice(0, 40) + "..." : product.title}</h3>
                    <Ratings size='sm' withValues rating={product.average_rating} color='text-blue-700' />
                </div>
                {/* <UserBadge size="sm" link={`/ users / ${product.seller._id} `} user={seller} /> */}
                <div className="flex flex-row items-center gap-2">
                    <div className="text-sm font-medium text-nowrap text-red-500">-25%</div>
                    <div className="text-sm py-1.5 px-1.5 tracking-wide text-nowrap rounded-md text-gray-200 bg-blue-700">&#8377; {product.price}</div>
                    <button className="bg-gray-300 dark:bg-neutral-800 rounded-lg p-1 hover:bg-neutral-700">
                        <CartAddIcon
                            onClick={(e) => {
                                e.stopPropagation(); // ✅ prevents parent click
                                dispatch(a_addToCart(product._id));
                            }}
                            className='h-5 w-auto text-neutral-800 dark:text-gray-300'
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StoreCard;