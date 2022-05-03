import axios from 'axios'

const baseURL = 'http://localhost:5000/api';

const get_api = axios.create({ baseURL });
const post_api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } })
const form_api = axios.create({ baseURL, headers: { 'Content-Type': 'multipart/form-data' } })

export const fetchArtworkImages = filename => baseURL + `/artworks/image/${filename}`;
export const fetchUserImages = filename => baseURL + `/users/image/${filename}`;

//GET Request API's
export const artworkListAPI = () => get_api.get(`/artworks`);
export const artworkItemAPI = artworkID => get_api.get(`/artworks/${artworkID}`);
export const userArtworkListAPI = userID => get_api.get(`/users/${userID}/artworks`);
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
export const likeArtworkAPI = (artworkID, userData) => get_api.put(`/artworks/${artworkID}/like`, userData);
export const dislikeArtworkAPI = (artworkID, userData) => get_api.put(`/artworks/${artworkID}/dislike`, userData);
export const awardArtworkAPI = (artworkID, awardData) => get_api.put(`/artworks/${artworkID}/award`, awardData);

//DELETE Request API's
export const deleteStoreItemAPI = (storeID, userID) => post_api.delete(`/store/${storeID}`, userID);


// export const likeArtwork = artworkID => apis.put(`/artworks/${artworkID}/like`, { user: getState().common.user })
// export const dislikeArtwork = artworkID => apis.put(`/artworks/${artworkID}/dislike`, { user: getState().common.user })
// export const getAllMovies = () => api.get(`/movies`)
// export const updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
// export const deleteMovieById = id => api.delete(`/movie/${id}`)
// export const getMovieById = id => api.get(`/movie/${id}`)