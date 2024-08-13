import { createSlice } from '@reduxjs/toolkit'
import { exploreItemViewedAPI, exploreItemAPI, artworkListAPI, exploreUploadAPI, exploreItemEditAPI, searchExploreListAPI, searchFilterExploreListAPI, filterExploreListAPI, likeExploreAPI, dislikeExploreAPI, awardExploreAPI, bookmarkArtworkAPI, deleteExploreItemAPI, addArtworkCommentAPI, exploreEditCommentAPI, exploreDeleteCommentAPI, exploreLikeCommentAPI, exploreDislikeCommentAPI } from '../../utils/api';

const initialState = {
    openExploreDialog: false,
    artworks: [],
    trending_artworks: [],
    new_artworks: [],
    highlight_artworks: [],
    artwork: {
        _id: '',
        title: '',
        description: '',
        files: [],
        categories: [],
        artist: {
            _id: '',
            name: '',
            username: '',
            avatar: {
                icon: '',
                category: ''
            }
        },
        likes: [],
        comments: [],
        tags: [],
        awards: [],
        views: []
    },
    uploadData: {
        file: '',
        title: '',
        description: '',
        uploadStatus: ''
    },
    activeDialog: false
}

const risingSort = (property) => {
    return (a, b) => {
        var result = (a[property].toLowerCase() < b[property].toLowerCase())
        return result;
    }
}

const dynamicSort = (property) => {
    return (a, b) => {
        var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
        return result;
    }
}

// function trendingCheck() {
//     var createdAt = new Date(state.explore.artworks[0].createdAt)
//     console.log('Trending', createdAt.getTime(), Date.now(), Date.now() - createdAt.getTime())
//     // return function (a, b) {

//     //     var result = 
//     // }
// }

// if createdAt-1 is less than createdAt-2 then check if 

const exploreSlice = createSlice({
    name: 'explore',
    initialState,
    reducers: {
        viewExploreItem: (state, action) => {
            exploreItemViewedAPI(action.payload, state.common.viewer_id);
        },
        fetchExploreItem: (state, action) => {
            const userID = state.common.user.id;
            exploreItemAPI(action.payload, { _id: userID }).then(res => {
                state.artwork = res.data
            }).catch(err => {
                console.log('---error fetchExploreItem', err);
            })
        },
        deleteExploreItem: (state, action) => {
            deleteExploreItemAPI(action.payload).then(res => {
                console.log('deleted Explore');
            }).catch(err => {
                console.log('---error deleteExploreItem', err);
            })
        },
        populateExploreList: (state, action) => {
            const artworks = [...action.payload];
            state.artworks = artworks;
        },
        fetchExploreList: (state, action) => {
            artworkListAPI().then(res => {
                console.log('---success fetchExploreList', res.data);
                const artworks = [...res.data];
                state.artworks = artworks;
            }).catch(err => {
                console.log('---error fetchExploreList', err);
            })
        },
        filterExploreList: (state, action) => {
            const { filter, period } = action.payload;
            filterExploreListAPI(filter, period).then(res => {
                const artworks = [...res.data];
                state.artworks = artworks;
            }).catch(err => {
                console.log('---error filterExploreList', err);
            })
        },
        fetchTrendingList: (state, action) => {
            artworkListAPI().then(res => {
                const list = [...res.data.sort(() => 0.4 - Math.random()).slice(0, 12)];
                state.trending_artworks = list;
            }).catch(err => {
                console.log('---error fetchTrendingList', err);
            })

        },
        fetchNewlyAddedList: (state, action) => {
            artworkListAPI().then(res => {
                const list = [...res.data.sort(() => 0.4 - Math.random()).slice(0, 12)];
                state.new_artworks = list;
            }).catch(err => {
                console.log('---error fetchNewlyAddedList', err);
            })
        },
        fetchMonthHighlightsList: (state, action) => {
            artworkListAPI().then(res => {
                const list = [...res.data.sort(() => 0.4 - Math.random()).slice(0, 12)];
                state.highlight_artworks = list;
            }).catch(err => {
                console.log('---error fetchMonthHighlightsList', err);
            })
        },
        handleExploreUpload: (state, action) => {
            exploreUploadAPI(action.payload).then(res => {
                state.uploadData = {
                    file: res.data.file,
                    title: res.data.title,
                    description: res.data.description,
                    uploadStatus: 'success'
                }
            }).catch(err => {
                console.log('---error handleExploreUpload', err);
            })
        },
        handleExploreEdit: (state, action) => {
            const { id, updatedData } = action.payload;
            exploreItemEditAPI(id, updatedData).then(res => {
                state.artwork = res.data
            }).catch(err => {
                console.log('---error handleExploreEdit', err);
            })
        },
        handleDialogOpen: (state, action) => {
            const selectedData = action.payload;
            state.activeDialog = true;
            state.selectedExplore = selectedData
        },
        handleDialogClose: (state, action) => {
            state.activeDialog = false
        },
        handleAddComment: (state, action) => {
            const { exploreID, commentText } = action.payload;
            addArtworkCommentAPI(exploreID, commentText, state.common.user).then(res => {
                console.log('commentData', res.data);
            }).catch(err => {
                console.log('---error handleAddComment', err);
            })
        },
        handleLikeExplore: (state, action) => {
            likeExploreAPI(action.payload, state.common.user).then(res => {
                console.log('likeCount', res.status);
            }).catch(err => {
                console.log('---error handleLikesCount', err);
            })
        },
        handleDislikeExplore: (state, action) => {
            dislikeExploreAPI(action.payload, state.common.user).then(res => {
                console.log('likeCount', res.status);
            }).catch(err => {
                console.log('---error handleDislikeExplore', err);
            })
        },
        handleAwardExplore: (state, action) => {
            const { exploreID, userID, award } = action.payload;
            awardExploreAPI(exploreID, userID, award).then(res => {
                console.log('award', res.status);
            }).catch(err => {
                console.log('---error handleAwardExplore', err);
            })
        },
        handleEditComment: (state, action) => {
            const { exploreID, newComment, commentID } = action.payload;
            exploreEditCommentAPI(exploreID, newComment, commentID, state.common.user).then(res => {
                console.log('editStatus', res.data);
            }).catch(err => {
                console.log('---error handleEditComment', err);
            })
        },
        handleDeleteComment: (state, action) => {
            const { exploreID, commentID } = action.payload;
            exploreDeleteCommentAPI(exploreID, commentID).then(res => {
                console.log('deleteStatus', res.data);
            }).catch(err => {
                console.log('---error handleDeleteComement', err);
            })
        },
        handleLikeComment: (state, action) => {
            const { exploreID, commentID } = action.payload;
            exploreLikeCommentAPI(exploreID, commentID, state.common.user).then(res => {
                console.log('likeCommentCount', res.data);
            }).catch(err => {
                console.log('---error handleLikeComment', err);
            })
        },
        handleDislikeComment: (state, action) => {
            const { exploreID, commentID } = action.payload;
            exploreDislikeCommentAPI(exploreID, commentID, state.common.user).then(res => {
                console.log('dislikeCommentCount', res.data);
            }).catch(err => {
                console.log('---error handleDislikeComment', err);
            })
        },
        // handleTabChange: (state, action) => {
        //     switch (action.payload) {
        //         case 'Latest': {
        //             let artworks = state.explore.artworks;
        //             dispatch(populateExploreList(artworks.sort(dynamicSort('createdAt'))))
        //             break;
        //         }
        //         case 'Trending': {
        //             let artworks = state.explore.artworks;
        //             dispatch(populateExploreList(artworks.sort(dynamicSort('title'))))
        //             break;
        //         }
        //         case 'Rising': {
        //             let artworks = state.explore.artworks;
        //             dispatch(populateExploreList(artworks.sort(dynamicSort('title'))))
        //             break;
        //         }
        //         default: break;
        //     }
        // },
        handleBookmark: (state, action) => {
            const { userID, bookmarkData } = action.payload;
            bookmarkArtworkAPI(userID, bookmarkData).then(res => {
                console.log('success bookmarkExploreItem', res.data);
            }).catch(err => {
                console.log('---error bookmarkExploreItem', err);
            })
        }
    }
});

export const {
    viewExploreItem,
    fetchExploreItem,
    deleteExploreItem,
    populateExploreList,
    fetchExploreList,
    filterExploreList,
    fetchTrendingList,
    fetchNewlyAddedList,
    fetchMonthHighlightsList,
    handleExploreUpload,
    handleExploreEdit,
    handleDialogOpen,
    handleDialogClose,
    handleAddComment,
    handleLikeExplore,
    handleDislikeExplore,
    handleAwardExplore,
    handleEditComment,
    handleDeleteComment,
    handleLikeComment,
    handleDislikeComment,
    handleTabChange,
    handleBookmark
} = exploreSlice.actions
export default exploreSlice.reducer