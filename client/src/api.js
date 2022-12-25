import axios from 'axios';

const baseURL = 'https://artyst-web.vercel.app/api';
export const taggerURL = 'https://artyst-web.vercel.app/tagger/model.json';
// const baseURL = 'http://localhost:5000/api';
// export const taggerURL = 'http://localhost:5000/api/tagger/model.json';

const get_api = axios.create({ baseURL });
const post_api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });
const form_api = axios.create({ baseURL, headers: { 'Content-Type': 'multipart/form-data' } });

export const viewerIP = () => axios.get('https://api.ipify.org?format=json');

export const fetchExploreImages = filename => baseURL + `/explore/image/${filename}`;
export const fetchStoreImages = filename => baseURL + `/store/image/${filename}`;
export const fetchUserImages = filename => baseURL + `/users/image/${filename}`;
export const googleRedirectURL = baseURL + `/users/googleAuth`;

//GET Request API's
export const googleLoginAPI = () => get_api.get(`/users/googleAuth`);
export const exploreListAPI = () => get_api.get(`/explore`);
export const exploreItemAPI = exploreID => get_api.get(`/explore/${exploreID}`);
export const searchExploreListAPI = (query, filter, period) => get_api.get(`/explore/search?query=${query}&filter=${filter}&period=${period}`);
export const filterExploreListAPI = (filter, period) => get_api.get(`/explore?filter=${filter}&period=${period}`);
export const sellerListAPI = () => get_api.get('/users?type=seller');
export const storeListAPI = () => get_api.get(`/store`);
export const storeItemAPI = storeID => get_api.get(`/store/${storeID}`);
export const categorizedStoreListAPI = (category) => get_api.get(`/store?category=${category}`);
export const userExploreListAPI = userID => get_api.get(`/users/${userID}/explore`);
export const userStoreListAPI = userID => get_api.get(`/users/${userID}/store`);
export const userCartListAPI = userID => get_api.get(`/users/${userID}/cart`);
export const tagsAPI = () => get_api.get(`/users/tags`);
export const commonImagesAPI = () => get_api.get(`/users/commonImages`);
export const userDetailsAPI = userID => get_api.get(`/users/${userID}`);
export const avatarListAPI = () => get_api.get(`/users/avatars`);
export const awardListAPI = () => get_api.get(`/users/awards`);
export const locationsListAPI = () => get_api.get(`/users/locations`);

//POST Request API's
export const loginAPI = userData => post_api.post(`/users/login`, userData);
export const signUpAPI = userData => post_api.post(`/users/signup`, userData);
export const exploreUploadAPI = exploreData => form_api.post(`/explore/new`, exploreData);
export const exploreAddCommentAPI = (exploreID, commentText, userData) => post_api.post(`/explore/${exploreID}/comments/new`, { content: commentText, user: userData })
export const storeUploadAPI = storeData => form_api.post(`/store/new`, storeData);
export const bookmarkExploreAPI = (userID, bookmarkData) => post_api.post(`/users/${userID}/bookmark`, bookmarkData);
export const addUserCartAPI = (userID, cartData) => get_api.post(`/users/${userID}/cart/add`, cartData);
export const editAvatarAPI = (userID, avatar) => get_api.post(`/users/${userID}/avatar`, avatar);

//PUT Request API's
export const exploreItemEditAPI = (exploreID, updatedData) => get_api.put(`/explore/${exploreID}`, updatedData)
export const exploreItemViewedAPI = (exploreID, viewerID) => get_api.put(`/explore/${exploreID}/viewed`, { viewer_id: viewerID });
export const exploreEditCommentAPI = (exploreID, newComment, commentID, userData) => get_api.put(`/explore/${exploreID}/comments/${commentID}`, { content: newComment, user: userData })
export const likeExploreAPI = (exploreID, userData) => get_api.put(`/explore/${exploreID}/like`, userData);
export const dislikeExploreAPI = (exploreID, userData) => get_api.put(`/explore/${exploreID}/dislike`, userData);
export const exploreLikeCommentAPI = (exploreID, commentID, userData) => get_api.put(`/explore/${exploreID}/comments/${commentID}/like`, { user: userData });
export const exploreDislikeCommentAPI = (exploreID, commentID, userData) => get_api.put(`/explore/${exploreID}/comments/${commentID}/dislike`, { user: userData });
export const awardExploreAPI = (exploreID, userID, awardData) => get_api.put(`/explore/${exploreID}/award`, { userID: userID, ...awardData });
export const updateUserDataAPI = (userID, userData) => get_api.put(`/users/${userID}`, userData);
export const updateUserCartAPI = (userID, cartID, cartData) => get_api.put(`/users/${userID}/cart/${cartID}`, cartData);

//DELETE Request API's
export const deleteExploreItemAPI = (exploreID) => post_api.delete(`/explore/${exploreID}`);
export const exploreDeleteCommentAPI = (exploreID, commentID) => get_api.delete(`/explore/${exploreID}/comments/${commentID}`);
export const deleteStoreItemAPI = (storeID, userID) => post_api.delete(`/store/${storeID}`, userID);
export const deleteBookmarkAPI = (bookmarkID, userID) => get_api.delete(`/users/${userID}/bookmark/${bookmarkID}`);
export const deleteCartItemAPI = (cartID, userID) => get_api.delete(`/users/${userID}/cart/${cartID}`);


// export const likeExplore = exploreID => apis.put(`/explore/${exploreID}/like`, { user: getState().common.user })
// export const dislikeExplore = exploreID => apis.put(`/explore/${exploreID}/dislike`, { user: getState().common.user })
// export const getAllMovies = () => api.get(`/movies`)
// export const updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
// export const deleteMovieById = id => api.delete(`/movie/${id}`)
// export const getMovieById = id => api.get(`/movie/${id}`)