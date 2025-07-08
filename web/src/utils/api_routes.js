import axios from 'axios';

// const api_baseURL = 'https://artportal.onrender.com/api/v1.01';
const api_baseURL = 'http://localhost:5000/api/v1.01';

export const api_taggerURL = api_baseURL + '/tagger/model.json';
export const api_googleRedirectURL = api_baseURL + `/auth/googleAuth/login`;

export const api_fetchArtworkImages = filename => api_baseURL + `/artworks/image/${filename}`;
export const api_fetchStoreImages = filename => api_baseURL + `/store/image/${filename}`;
export const api_fetchUserImages = filename => api_baseURL + `/common/files/${filename}`;

const apiClient = axios.create({ baseURL: api_baseURL });
apiClient.interceptors.request.use((config) => {
    // Retrieve the token from secure storage
    let token = null;
    if (localStorage.jwtToken)
        token = localStorage.getItem('jwtToken'); // Replace with your token retrieval logic
    else
        token = sessionStorage.getItem('jwtToken'); // Replace with your token retrieval logic

    if (token) {
        // Add Authorization header if token exists
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Handle request error
    return Promise.reject(error);
});

export const api_tags = () => apiClient.get(`/common/tags`);
export const api_signIn = userData => apiClient.post(`/auth/login`, userData, { headers: { 'Content-Type': 'application/json' } });
export const api_signUp = userData => apiClient.post(`/auth/signup`, userData, { headers: { 'Content-Type': 'application/json' } });
export const api_googleLogin = () => apiClient.get(`/auth/googleAuth/login`);
export const api_userDetails = userID => apiClient.get(`/users/${userID}`);
export const api_updateUserData = (userID, userData) => apiClient.put(`/users/${userID}`, userData);
export const api_deleteBookmark = (bookmarkID, userID) => apiClient.delete(`/users/${userID}/bookmark/${bookmarkID}`);
export const api_artworkList = () => apiClient.get(`/artworks`);
export const api_search = (type, value) => apiClient.get(`/search?type=${type}&value=${value}`);
export const api_exploreItem = (id, payload) => apiClient.get(`/artworks/${id}`, payload);
export const api_filterExploreList = (filter, period) => apiClient.get(`/artworks?filter=${filter}&period=${period}`);
export const api_searchFilterExploreList = (type, value, filter, period) => apiClient.get(`/search?type=${type}&value=${value}&filter=${filter}&period=${period}`);
export const api_sellerList = () => apiClient.get('/users?type=seller');
export const api_storeList = () => apiClient.get(`/store`);
export const api_storeItem = storeID => apiClient.get(`/store/${storeID}`);
export const api_categorizedStoreList = (category) => apiClient.get(`/store?category=${category}`);
export const api_userExploreList = userID => apiClient.get(`/users/${userID}/artworks`);
export const api_userStoreList = userID => apiClient.get(`/users/${userID}/store`);
export const api_userCartList = userID => apiClient.get(`/users/${userID}/cart`);
export const api_avatarList = () => apiClient.get(`/common/avatars`);
export const api_awardList = () => apiClient.get(`/common/stickers`);
export const api_locationsList = () => apiClient.get(`/common/locations`);
export const api_exploreUpload = exploreData => apiClient.post(`/artworks/new`, exploreData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const api_commentOnArtwork = (isParent, userID, artworkID, parentID, commentText) => apiClient.post(`/artworks/${artworkID}/comments/new`, { userID, text: commentText, isParent, parentID }, { headers: { 'Content-Type': 'application/json' } })
export const api_storeUpload = storeData => apiClient.post(`/store/new`, storeData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const api_bookmarkExploreItem = (userID, artworkID) => apiClient.post(`/users/${userID}/bookmark`, { artworkID }, { headers: { 'Content-Type': 'application/json' } });
export const api_addUserCart = (userID, cartData) => apiClient.post(`/users/${userID}/cart/add`, cartData);
export const api_editAvatar = (userID, avatar) => apiClient.post(`/users/${userID}/avatar`, avatar);
export const api_exploreItemEdit = (artworkID, updatedData) => apiClient.put(`/artworks/${artworkID}`, updatedData)
export const api_exploreItemViewed = (artworkID, viewerID) => apiClient.put(`/artworks/${artworkID}/viewed`, { viewer_id: viewerID });
export const api_exploreEditComment = (artworkID, newComment, commentID, userData) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}`, { content: newComment, user: userData })
export const api_likeArtwork = (artworkID, userID) => apiClient.put(`/artworks/${artworkID}/like`, { userID });
export const api_dislikeArtwork = (artworkID, userID) => apiClient.put(`/artworks/${artworkID}/dislike`, { userID });
export const api_likeComment = (artworkID, commentID, userID) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}/like`, { userID });
export const api_dislikeComment = (artworkID, commentID, userID) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}/dislike`, { userID });
export const api_awardExplore = (artworkID, userID, awardData) => apiClient.put(`/artworks/${artworkID}/award`, { userID: userID, ...awardData });
export const api_updateUserCart = (userID, cartID, cartData) => apiClient.put(`/users/${userID}/cart/${cartID}`, cartData);
export const api_deleteArtwork = (artworkID) => apiClient.delete(`/artworks/${artworkID}`, { headers: { 'Content-Type': 'application/json' } });
export const api_exploreDeleteComment = (artworkID, commentID) => apiClient.delete(`/artworks/${artworkID}/comments/${commentID}`);
export const api_deleteStoreItem = (storeID, userID) => apiClient.delete(`/store/${storeID}`, userID, { headers: { 'Content-Type': 'application/json' } });
export const api_deleteCartItem = (cartID, userID) => apiClient.delete(`/users/${userID}/cart/${cartID}`);

// export const api_likeArtwork = artworkID => apis.put(`/artworks/${artworkID}/like`, { user: getState().common.user })
// export const api_dislikeArtwork = artworkID => apis.put(`/artworks/${artworkID}/dislike`, { user: getState().common.user })
// export const api_getAllMovies = () => api.get(`/movies`)
// export const api_updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
// export const api_deleteMovieById = id => api.delete(`/movie/${id}`)
// export const api_getMovieById = id => api.get(`/movie/${id}`)