import axios from 'axios'

const baseURL = 'http://localhost:5000/api';

const get_api = axios.create({ baseURL });
const post_api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } })
const form_api = axios.create({ baseURL, headers: { 'Content-Type': 'multipart/form-data' } })

export const fetchExploreImages = filename => baseURL + `/explore/image/${filename}`;
export const fetchUserImages = filename => baseURL + `/users/image/${filename}`;

//GET Request API's
export const exploreListAPI = () => get_api.get(`/explore`);
export const exploreItemAPI = exploreID => get_api.get(`/explore/${exploreID}`);
export const userExploreListAPI = userID => get_api.get(`/users/${userID}/explore`);
export const userStoreListAPI = userID => get_api.get(`/users/${userID}/store`);
export const userCartListAPI = userID => get_api.get(`/users/${userID}/cart`);
export const tagsAPI = () => get_api.get(`/users/tags`);
export const commonImagesAPI = () => get_api.get(`/users/commonImages`);
export const userDetailsAPI = userID => get_api.get(`/users/${userID}`);
export const awardListAPI = () => get_api.get(`/users/awards`);
//POST Request API's
export const loginAPI = userData => post_api.post(`/users/login`, userData);
export const signUpAPI = userData => post_api.post(`/users/signup`, userData);

//PUT Request API's
export const likeExploreAPI = (exploreID, userData) => get_api.put(`/explore/${exploreID}/like`, userData);
export const dislikeExploreAPI = (exploreID, userData) => get_api.put(`/explore/${exploreID}/dislike`, userData);
export const awardExploreAPI = (exploreID, awardData) => get_api.put(`/explore/${exploreID}/award`, awardData);

//DELETE Request API's
export const deleteStoreItemAPI = (storeID, userID) => post_api.delete(`/store/${storeID}`, userID);


// export const likeExplore = exploreID => apis.put(`/explore/${exploreID}/like`, { user: getState().common.user })
// export const dislikeExplore = exploreID => apis.put(`/explore/${exploreID}/dislike`, { user: getState().common.user })
// export const getAllMovies = () => api.get(`/movies`)
// export const updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
// export const deleteMovieById = id => api.delete(`/movie/${id}`)
// export const getMovieById = id => api.get(`/movie/${id}`)