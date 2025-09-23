import axios from 'axios';

let accessToken = null;
console.log("NODE_ENV", process.env)
// const api_baseURL = 'https://artportal.onrender.com/api/v1.01';
const api_baseURL = 'http://localhost:5000/api/v1.01';

export const api_taggerURL = api_baseURL + '/tagger/model.json';
export const api_googleRedirectURL = api_baseURL + `/auth/google/login`;

export const api_artworkImages = filename => api_baseURL + `/artworks/image/${filename}`;
export const api_storeImages = filename => api_baseURL + `/store/image/${filename}`;
export const api_userImages = filename => api_baseURL + `/common/files/${filename}`;

const apiClient = axios.create({
    baseURL: api_baseURL,
    withCredentials: true
});
// Attach token before each request
apiClient.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }, (error) => Promise.reject(error)
);
// Auto-refresh on 401
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If access token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Ask server for a new access token
                const res = await axios.post(
                    api_baseURL + "/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                accessToken = res.data.token; // save new access token

                // Retry the original request with new token
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Session expired. Please log in again.");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export const api_tags = () => apiClient.get(`/common/tags`);
export const api_signIn = userData => apiClient.post(`/auth/login`, userData, { headers: { 'Content-Type': 'application/json' } });
export const api_signUp = userData => apiClient.post(`/auth/signup`, userData, { headers: { 'Content-Type': 'application/json' } });
export const api_googleLogin = (payload) => apiClient.post(`/auth/google/login`, { token: payload });
export const api_users = (type, value) => apiClient.get(`/users?type=${type}&value=${value}`);
export const api_userData = userID => apiClient.get(`/users/${userID}`);
export const api_updateUserData = (userID, userData) => apiClient.put(`/users/${userID}`, userData);
export const api_deleteBookmark = (bookmarkID, userID) => apiClient.delete(`/users/${userID}/bookmark/${bookmarkID}`);
export const api_artworks = (type, value, filter, period) => apiClient.get(`/artworks?type=${type}&value=${value}&filter=${filter}&period=${period}`);
export const api_artworkItem = (id, payload) => apiClient.get(`/artworks/${id}`, payload);
export const api_storeListings = () => apiClient.get(`/store`);
export const api_storeItem = storeID => apiClient.get(`/store/${storeID}`);
export const api_categorizedStoreListings = (category) => apiClient.get(`/store?category=${category}`);
export const api_userArtworks = userID => apiClient.get(`/users/${userID}/artworks`);
export const api_userStoreListings = userID => apiClient.get(`/users/${userID}/store`);
export const api_userCart = userID => apiClient.get(`/users/${userID}/cart`);
export const api_avatars = () => apiClient.get(`/common/avatars`);
export const api_awards = () => apiClient.get(`/common/stickers`);
export const api_locations = () => apiClient.get(`/common/locations`);
export const api_artworkUpload = data => apiClient.post(`/artworks/new`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const api_commentOnArtwork = (isParent, userID, artworkID, parentID, commentText) => apiClient.post(`/artworks/${artworkID}/comments/new`, { userID, text: commentText, isParent, parentID }, { headers: { 'Content-Type': 'application/json' } })
export const api_storeUpload = storeData => apiClient.post(`/store/new`, storeData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const api_bookmarkArtwork = (userID, artworkID) => apiClient.post(`/users/${userID}/bookmark`, { artworkID }, { headers: { 'Content-Type': 'application/json' } });
export const api_addToCart = (userID, cartData) => apiClient.post(`/users/${userID}/cart/add`, cartData);
export const api_editAvatar = (userID, avatar) => apiClient.post(`/users/${userID}/avatar`, avatar);
export const api_editArtwork = (artworkID, updatedData) => apiClient.put(`/artworks/${artworkID}`, updatedData)
export const api_artworkViewed = (artworkID, viewerID) => apiClient.put(`/artworks/${artworkID}/viewed`, { viewer_id: viewerID });
export const api_editArtworkComment = (artworkID, newComment, commentID, userData) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}`, { content: newComment, user: userData })
export const api_likeArtwork = (artworkID, userID) => apiClient.put(`/artworks/${artworkID}/like`, { userID });
export const api_dislikeArtwork = (artworkID, userID) => apiClient.put(`/artworks/${artworkID}/dislike`, { userID });
export const api_likeComment = (artworkID, commentID, userID) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}/like`, { userID });
export const api_dislikeComment = (artworkID, commentID, userID) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}/dislike`, { userID });
export const api_giftToArtwork = (artworkID, userID, awardData) => apiClient.put(`/artworks/${artworkID}/award`, { userID: userID, ...awardData });
export const api_updateCart = (userID, cartID, cartData) => apiClient.put(`/users/${userID}/cart/${cartID}`, cartData);
export const api_deleteArtwork = (artworkID) => apiClient.delete(`/artworks/${artworkID}`, { headers: { 'Content-Type': 'application/json' } });
export const api_deleteArtworkComment = (artworkID, commentID) => apiClient.delete(`/artworks/${artworkID}/comments/${commentID}`);
export const api_deleteStoreListing = (storeID, userID) => apiClient.delete(`/store/${storeID}`, userID, { headers: { 'Content-Type': 'application/json' } });
export const api_deleteFromCart = (cartID, userID) => apiClient.delete(`/users/${userID}/cart/${cartID}`);

// export const api_likeArtwork = artworkID => apis.put(`/artworks/${artworkID}/like`, { user: getState().user })
// export const api_dislikeArtwork = artworkID => apis.put(`/artworks/${artworkID}/dislike`, { user: getState().user })
// export const api_getAllMovies = () => api.get(`/movies`)
// export const api_updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
// export const api_deleteMovieById = id => api.delete(`/movie/${id}`)
// export const api_getMovieById = id => api.get(`/movie/${id}`)