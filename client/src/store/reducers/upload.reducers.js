export const HANDLE_UPLOAD_ARTWORK = 'HANDLE_UPLOAD_ARTWORK';

export const initialState = {
    file: '',
    title: '',
    description: '',
    uploadStatus: ''
}

export const uploadReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case HANDLE_UPLOAD_ARTWORK: {
            console.log('HANDLE_UPLOAD_ARTWORK', payload);
            return { ...state, file: payload.file, title: payload.title, description: payload.description, uploadStatus: 'success' }
        }
        default:
            return state;
    }
};