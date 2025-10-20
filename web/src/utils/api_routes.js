import axios from 'axios';
import store from "../store/index";
import { r_clearAuth, r_signIn } from '../store/reducers/users.reducer';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

let accessToken = null;
const api_baseURL = process.env.NODE_ENV === "development" ? 'http://localhost:5000/api/v1.01' : 'https://artportal.onrender.com/api/v1.01';

export const api_taggerURL = api_baseURL + '/agents/tagger/model.json';
export const api_googleRedirectURL = api_baseURL + `/auth/google`;

export const api_artworkImages = filename => api_baseURL + `/artworks/image/${filename}`;
export const api_postImages = filename => api_baseURL + `/posts/image/${filename}`;
export const api_productImages = filename => api_baseURL + `/products/image/${filename}`;
export const api_userImages = filename => api_baseURL + `/common/files/${filename}`;

const apiClient = axios.create({
    baseURL: api_baseURL,
    withCredentials: true
});

// Attach token before each request
apiClient.interceptors.request.use((config) => {
    const token = store.getState().user.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// refresh logic with queue to avoid duplicate refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

// Auto-refresh on 401
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        // If access token expired
        if (error.response?.status !== 401) return Promise.reject(error);

        // If we don't have a session flag, don't attempt refresh (user might be anonymous)
        const hasSession = !!Cookies.get('hasSession') || !!localStorage.getItem('hasSession');

        if (!hasSession) {
            // optionally clear auth state if any
            store.dispatch(r_clearAuth());
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            // already retried, give up
            store.dispatch(r_clearAuth());
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // queue the request
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return axios(originalRequest);
                })
                .catch((e) => Promise.reject(e));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Ask server for a new access token
            const res = await axios.post(api_baseURL + "/auth/refresh", {}, { withCredentials: true });
            const { token } = res.data; // save new access token
            const userData = jwt_decode(token);
            store.dispatch(r_signIn({ accessToken: token, user: userData }));
            processQueue(null, accessToken);

            // Retry the original request with new token
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
        } catch (err) {
            processQueue(err, null);
            Cookies.remove('hasSession');
            localStorage.removeItem('hasSession');
            store.dispatch(r_clearAuth());
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export const api_tags = () => apiClient.get(`/common/tags`);

export const api_signIn = userData => apiClient.post(`/auth/login`, userData, { headers: { 'Content-Type': 'application/json' } });
export const api_signUp = userData => apiClient.post(`/auth/signup`, userData, { headers: { 'Content-Type': 'application/json' } });
export const api_googleLogin = (payload) => apiClient.post(`/auth/google`, { token: payload });
export const api_verifyAuth = () => apiClient.post(`/auth/refresh`);
export const api_logout = () => apiClient.post(`/auth/logout`);

export const api_users = (type, value) => apiClient.get(`/users?type=${type}&value=${value}`);
export const api_userData = userID => apiClient.get(`/users/${userID}`);
export const api_profileData = userID => apiClient.get(`/users/${userID}/view`);
export const api_updateUserData = (userID, userData) => apiClient.put(`/users/${userID}`, userData);
export const api_deleteBookmark = (bookmarkID, userID) => apiClient.delete(`/users/${userID}/bookmark/${bookmarkID}`);

export const api_cart = userID => apiClient.get(`/users/${userID}/cart`);
export const api_addToCart = (userID, data) => apiClient.post(`/users/${userID}/cart/add`, data, { headers: { 'Content-Type': 'application/json' } });
export const api_removeFromCart = (userID, data) => apiClient.post(`/users/${userID}/cart/remove`, data, { headers: { 'Content-Type': 'application/json' } });

export const api_posts = () => apiClient.get(`/posts`);
export const api_post = (id, payload) => apiClient.get(`/posts/${id}`, payload);
export const api_postViewed = (postID, viewerID) => apiClient.put(`/posts/${postID}/viewed`, { viewer_id: viewerID });
export const api_postUpload = data => apiClient.post(`/posts/new`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const api_postEdit = (postID, updatedData) => apiClient.put(`/posts/${postID}`, updatedData);
export const api_postDelete = (postID) => apiClient.delete(`/posts/${postID}`, { headers: { 'Content-Type': 'application/json' } });
export const api_postComment = (isParent, userID, postID, parentID, commentText) => apiClient.post(`/posts/${postID}/comments/new`, { userID, text: commentText, isParent, parentID }, { headers: { 'Content-Type': 'application/json' } })
export const api_postCommentEdit = (postID, newComment, commentID, userData) => apiClient.put(`/posts/${postID}/comments/${commentID}`, { content: newComment, user: userData })
export const api_postLike = (postID, userID) => apiClient.put(`/posts/${postID}/like`, { userID });
export const api_postDislike = (postID, userID) => apiClient.put(`/posts/${postID}/dislike`, { userID });
export const api_postCommentLike = (postID, commentID, userID) => apiClient.put(`/posts/${postID}/comments/${commentID}/like`, { userID });
export const api_postCommentDislike = (postID, commentID, userID) => apiClient.put(`/posts/${postID}/comments/${commentID}/dislike`, { userID });
export const api_postCommentDelete = (postID, commentID) => apiClient.delete(`/posts/${postID}/comments/${commentID}`);

export const api_artworks = (type, value, filter, period) => apiClient.get(`/artworks?type=${type}&value=${value}&filter=${filter}&period=${period}`);
export const api_artwork = (id, payload) => apiClient.get(`/artworks/${id}`, payload);
export const api_artworkViewed = (artworkID, viewerID) => apiClient.put(`/artworks/${artworkID}/viewed`, { viewer_id: viewerID });
export const api_artworkUpload = data => apiClient.post(`/artworks/new`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const api_artworkEdit = (artworkID, updatedData) => apiClient.put(`/artworks/${artworkID}`, updatedData);
export const api_artworkDelete = (artworkID) => apiClient.delete(`/artworks/${artworkID}`, { headers: { 'Content-Type': 'application/json' } });
export const api_artworkComment = (isParent, userID, artworkID, parentID, commentText) => apiClient.post(`/artworks/${artworkID}/comments/new`, { userID, text: commentText, isParent, parentID }, { headers: { 'Content-Type': 'application/json' } })
export const api_artworkCommentEdit = (artworkID, newComment, commentID, userData) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}`, { content: newComment, user: userData })
export const api_artworkLike = (artworkID, userID) => apiClient.put(`/artworks/${artworkID}/like`, { userID });
export const api_artworkDislike = (artworkID, userID) => apiClient.put(`/artworks/${artworkID}/dislike`, { userID });
export const api_artworkCommentLike = (artworkID, commentID, userID) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}/like`, { userID });
export const api_artworkCommentDislike = (artworkID, commentID, userID) => apiClient.put(`/artworks/${artworkID}/comments/${commentID}/dislike`, { userID });
export const api_artworkCommentDelete = (artworkID, commentID) => apiClient.delete(`/artworks/${artworkID}/comments/${commentID}`);
export const api_artworkGift = (artworkID, userID, awardData) => apiClient.put(`/artworks/${artworkID}/award`, { userID: userID, ...awardData });

export const api_products = () => apiClient.get(`/products`);
export const api_productItem = productID => apiClient.get(`/products/${productID}`);
export const api_categorizedStoreListings = (category) => apiClient.get(`/products?category=${category}`);
export const api_userStoreListings = userID => apiClient.get(`/users/${userID}/products`);
export const api_avatars = () => apiClient.get(`/common/avatars`);
export const api_awards = () => apiClient.get(`/common/stickers`);
export const api_locations = () => apiClient.get(`/common/locations`);
export const api_productUpload = data => apiClient.post(`/products/new`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const api_bookmarkArtwork = (userID, artworkID) => apiClient.post(`/users/${userID}/bookmark`, { artworkID }, { headers: { 'Content-Type': 'application/json' } });
export const api_editAvatar = (userID, avatar) => apiClient.post(`/users/${userID}/avatar`, avatar);

export const api_deleteStoreListing = (productID, userID) => apiClient.delete(`/products/${productID}`, userID, { headers: { 'Content-Type': 'application/json' } });

// export const api_artworkLike = artworkID => apis.put(`/artworks/${artworkID}/like`, { user: getState().user })
// export const api_artworkDislike = artworkID => apis.put(`/artworks/${artworkID}/dislike`, { user: getState().user })
// export const api_getAllMovies = () => api.get(`/movies`)
// export const api_updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
// export const api_deleteMovieById = id => api.delete(`/movie/${id}`)
// export const api_getMovieById = id => api.get(`/movie/${id}`)