export const HANDLE_UPLOAD_EXPLORE = 'HANDLE_UPLOAD_EXPLORE';

export const initialState = {
    file: '',
    title: '',
    description: '',
    uploadStatus: ''
}

export const uploadReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case HANDLE_UPLOAD_EXPLORE: {
            console.log('HANDLE_UPLOAD_EXPLORE', payload);
            return { ...state, file: payload.file, title: payload.title, description: payload.description, uploadStatus: 'success' }
        }
        default:
            return state;
    }
};