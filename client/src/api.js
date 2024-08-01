import axios from 'axios';

// const baseURL = 'https://artystweb.onrender.com/api/v1';
// export const taggerURL = 'https://artystweb.onrender.com/api/v1.01/tagger/model.json';
const baseURL = 'http://localhost:5000/api/v1';
export const taggerURL = 'http://localhost:5000/api/v1.01/tagger/model.json';

const get_api = axios.create({ baseURL });
const post_api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });
const form_api = axios.create({ baseURL, headers: { 'Content-Type': 'multipart/form-data' } });

export const viewerIP = () => axios.get('https://api.ipify.org?format=json');

export const fetchArtworkImages = filename => baseURL + `/artworks/image/${filename}`;
export const fetchStoreImages = filename => baseURL + `/store/image/${filename}`;
export const fetchUserImages = filename => baseURL + `/users/image/${filename}`;
export const googleRedirectURL = baseURL + `/auth/google`;

//GET Request API's
export const googleLoginAPI = () => get_api.get(`/auth/google`);
export const artworkListAPI = () => get_api.get(`/artworks`);
export const searchAPI = (type, value) => get_api.get(`/search?type=${type}&value=${value}`);
export const exploreItemAPI = (id, payload) => get_api.get(`/artworks/${id}`, payload);
export const filterExploreListAPI = (filter, period) => get_api.get(`/artworks?filter=${filter}&period=${period}`);
export const searchFilterExploreListAPI = (type, value, filter, period) => get_api.get(`/artworks/search?type=${type}&value=${value}&filter=${filter}&period=${period}`);
export const sellerListAPI = () => get_api.get('/users?type=seller');
export const storeListAPI = () => get_api.get(`/store`);
export const storeItemAPI = storeID => get_api.get(`/store/${storeID}`);
export const categorizedStoreListAPI = (category) => get_api.get(`/store?category=${category}`);
export const userExploreListAPI = userID => get_api.get(`/users/${userID}/artworks`);
export const userStoreListAPI = userID => get_api.get(`/users/${userID}/store`);
export const userCartListAPI = userID => get_api.get(`/users/${userID}/cart`);
export const tagsAPI = () => get_api.get(`/users/tags`);
export const commonImagesAPI = () => get_api.get(`/users/commonImages`);
export const userDetailsAPI = userID => get_api.get(`/users/${userID}`);
export const avatarListAPI = () => get_api.get(`/users/avatars`);
export const awardListAPI = () => get_api.get(`/users/awards`);
export const locationsListAPI = () => get_api.get(`/users/locations`);

//POST Request API's
export const loginAPI = userData => post_api.post(`/auth/login`, userData);
export const signUpAPI = userData => post_api.post(`/auth/signup`, userData);
export const exploreUploadAPI = exploreData => form_api.post(`/artworks/new`, exploreData);
export const addArtworkCommentAPI = (exploreID, commentText, userData) => post_api.post(`/artworks/${exploreID}/comments/new`, { content: commentText, user: userData })
export const storeUploadAPI = storeData => form_api.post(`/store/new`, storeData);
export const bookmarkArtworkAPI = (userID, bookmarkData) => post_api.post(`/users/${userID}/bookmark`, bookmarkData);
export const addUserCartAPI = (userID, cartData) => get_api.post(`/users/${userID}/cart/add`, cartData);
export const editAvatarAPI = (userID, avatar) => get_api.post(`/users/${userID}/avatar`, avatar);

//PUT Request API's
export const updateUserThemeAPI = (userID, theme) => get_api.put(`/users/${userID}?theme=${theme}`);
export const exploreItemEditAPI = (exploreID, updatedData) => get_api.put(`/artworks/${exploreID}`, updatedData)
export const exploreItemViewedAPI = (exploreID, viewerID) => get_api.put(`/artworks/${exploreID}/viewed`, { viewer_id: viewerID });
export const exploreEditCommentAPI = (exploreID, newComment, commentID, userData) => get_api.put(`/artworks/${exploreID}/comments/${commentID}`, { content: newComment, user: userData })
export const likeExploreAPI = (exploreID, userData) => get_api.put(`/artworks/${exploreID}/like`, userData);
export const dislikeExploreAPI = (exploreID, userData) => get_api.put(`/artworks/${exploreID}/dislike`, userData);
export const exploreLikeCommentAPI = (exploreID, commentID, userData) => get_api.put(`/artworks/${exploreID}/comments/${commentID}/like`, { user: userData });
export const exploreDislikeCommentAPI = (exploreID, commentID, userData) => get_api.put(`/artworks/${exploreID}/comments/${commentID}/dislike`, { user: userData });
export const awardExploreAPI = (exploreID, userID, awardData) => get_api.put(`/artworks/${exploreID}/award`, { userID: userID, ...awardData });
export const updateUserDataAPI = (userID, userData) => get_api.put(`/users/${userID}`, userData);
export const updateUserCartAPI = (userID, cartID, cartData) => get_api.put(`/users/${userID}/cart/${cartID}`, cartData);

//DELETE Request API's
export const deleteExploreItemAPI = (exploreID) => post_api.delete(`/artworks/${exploreID}`);
export const exploreDeleteCommentAPI = (exploreID, commentID) => get_api.delete(`/artworks/${exploreID}/comments/${commentID}`);
export const deleteStoreItemAPI = (storeID, userID) => post_api.delete(`/store/${storeID}`, userID);
export const deleteBookmarkAPI = (bookmarkID, userID) => get_api.delete(`/users/${userID}/bookmark/${bookmarkID}`);
export const deleteCartItemAPI = (cartID, userID) => get_api.delete(`/users/${userID}/cart/${cartID}`);


// export const likeExplore = exploreID => apis.put(`/artworks/${exploreID}/like`, { user: getState().common.user })
// export const dislikeExplore = exploreID => apis.put(`/artworks/${exploreID}/dislike`, { user: getState().common.user })
// export const getAllMovies = () => api.get(`/movies`)
// export const updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
// export const deleteMovieById = id => api.delete(`/movie/${id}`)
// export const getMovieById = id => api.get(`/movie/${id}`)