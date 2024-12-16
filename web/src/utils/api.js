import axios from 'axios';

// const api_baseURL = 'https://artportalweb.onrender.com/api/v1';
// export const api_taggerURL = 'https://artportalweb.onrender.com/api/v1.01/tagger/model.json';
const baseURL = 'http://localhost:5000/api/v1.01';
export const taggerURL = baseURL + '/tagger/model.json';
export const api_googleRedirectURL = baseURL + `/auth/googleAuth/login`;

export const api_fetchArtworkImages = filename => baseURL + `/artworks/image/${filename}`;
export const api_fetchStoreImages = filename => baseURL + `/store/image/${filename}`;
export const api_fetchUserImages = filename => baseURL + `/common/files/${filename}`;

const artportal_get = axios.create({ baseURL });
const artportal_post = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });
const artportal_form = axios.create({ baseURL, headers: { 'Content-Type': 'multipart/form-data' } });

export const api_tags = () => artportal_get.get(`/common/tags`);
export const api_signIn = userData => artportal_post.post(`/auth/login`, userData);
export const api_signUp = userData => artportal_post.post(`/auth/signup`, userData);
export const api_googleLogin = () => artportal_get.get(`/auth/googleAuth/login`);
export const api_userDetails = userID => artportal_get.get(`/users/${userID}`);
export const api_updateUserData = (userID, userData) => artportal_get.put(`/users/${userID}`, userData);
export const api_deleteBookmark = (bookmarkID, userID) => artportal_get.delete(`/users/${userID}/bookmark/${bookmarkID}`);
export const api_artworkList = () => artportal_get.get(`/artworks`);
export const api_search = (type, value) => artportal_get.get(`/search?type=${type}&value=${value}`);
export const api_exploreItem = (id, payload) => artportal_get.get(`/artworks/${id}`, payload);
export const api_filterExploreList = (filter, period) => artportal_get.get(`/artworks?filter=${filter}&period=${period}`);
export const api_searchFilterExploreList = (type, value, filter, period) => artportal_get.get(`/search?type=${type}&value=${value}&filter=${filter}&period=${period}`);
export const api_sellerList = () => artportal_get.get('/users?type=seller');
export const api_storeList = () => artportal_get.get(`/store`);
export const api_storeItem = storeID => artportal_get.get(`/store/${storeID}`);
export const api_categorizedStoreList = (category) => artportal_get.get(`/store?category=${category}`);
export const api_userExploreList = userID => artportal_get.get(`/users/${userID}/artworks`);
export const api_userStoreList = userID => artportal_get.get(`/users/${userID}/store`);
export const api_userCartList = userID => artportal_get.get(`/users/${userID}/cart`);
export const api_avatarList = () => artportal_get.get(`/common/avatars`);
export const api_awardList = () => artportal_get.get(`/common/stickers`);
export const api_locationsList = () => artportal_get.get(`/common/locations`);
export const api_exploreUpload = exploreData => artportal_form.post(`/artworks/new`, exploreData);
export const api_addExploreItemComment = (exploreID, commentText, userData) => artportal_post.post(`/artworks/${exploreID}/comments/new`, { content: commentText, user: userData })
export const api_storeUpload = storeData => artportal_form.post(`/store/new`, storeData);
export const api_bookmarkExploreItem = (userID, bookmarkData) => artportal_post.post(`/users/${userID}/bookmark`, bookmarkData);
export const api_addUserCart = (userID, cartData) => artportal_get.post(`/users/${userID}/cart/add`, cartData);
export const api_editAvatar = (userID, avatar) => artportal_get.post(`/users/${userID}/avatar`, avatar);
export const api_exploreItemEdit = (exploreID, updatedData) => artportal_get.put(`/artworks/${exploreID}`, updatedData)
export const api_exploreItemViewed = (exploreID, viewerID) => artportal_get.put(`/artworks/${exploreID}/viewed`, { viewer_id: viewerID });
export const api_exploreEditComment = (exploreID, newComment, commentID, userData) => artportal_get.put(`/artworks/${exploreID}/comments/${commentID}`, { content: newComment, user: userData })
export const api_likeExplore = (exploreID, userData) => artportal_get.put(`/artworks/${exploreID}/like`, userData);
export const api_dislikeExplore = (exploreID, userData) => artportal_get.put(`/artworks/${exploreID}/dislike`, userData);
export const api_exploreLikeComment = (exploreID, commentID, userData) => artportal_get.put(`/artworks/${exploreID}/comments/${commentID}/like`, { user: userData });
export const api_exploreDislikeComment = (exploreID, commentID, userData) => artportal_get.put(`/artworks/${exploreID}/comments/${commentID}/dislike`, { user: userData });
export const api_awardExplore = (exploreID, userID, awardData) => artportal_get.put(`/artworks/${exploreID}/award`, { userID: userID, ...awardData });
export const api_updateUserCart = (userID, cartID, cartData) => artportal_get.put(`/users/${userID}/cart/${cartID}`, cartData);
export const api_deleteExploreItem = (exploreID) => artportal_post.delete(`/artworks/${exploreID}`);
export const api_exploreDeleteComment = (exploreID, commentID) => artportal_get.delete(`/artworks/${exploreID}/comments/${commentID}`);
export const api_deleteStoreItem = (storeID, userID) => artportal_post.delete(`/store/${storeID}`, userID);
export const api_deleteCartItem = (cartID, userID) => artportal_get.delete(`/users/${userID}/cart/${cartID}`);

// export const api_likeExplore = exploreID => apis.put(`/artworks/${exploreID}/like`, { user: getState().common.user })
// export const api_dislikeExplore = exploreID => apis.put(`/artworks/${exploreID}/dislike`, { user: getState().common.user })
// export const api_getAllMovies = () => api.get(`/movies`)
// export const api_updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
// export const api_deleteMovieById = id => api.delete(`/movie/${id}`)
// export const api_getMovieById = id => api.get(`/movie/${id}`)