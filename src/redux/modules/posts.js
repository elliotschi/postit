import { savePost, fetchPost } from 'helpers/api';
import { closeModal } from './modal';
import { addSingleUsersPost } from './usersPosts';
import { Map, fromJS } from 'immutable';

export const FETCHING_POST = 'FETCHING_POST';
export const FETCHING_POST_ERROR = 'FETCHING_POST_ERROR';
export const FETCHING_POST_SUCCESS = 'FETCHING_POST_SUCCESS';
export const REMOVE_FETCHING = 'REMOVE_FETCHING';
export const ADD_POST = 'ADD_POST';
export const ADD_MULTIPLE_POSTS = 'ADD_MULTIPLE_POSTS';

// Post actions
export const fetchingPost = () => {
  return {
    type: FETCHING_POST
  };
};

// error fetching post
export const fetchingPostError = error => {
  return {
    type: FETCHING_POST_ERROR,
    error
  };
};
// successfully fetch posts
export const fetchingPostSuccess = post => {
  return {
    type: FETCHING_POST_SUCCESS,
    post
  };
};
// remove the fetching status => true
export const removeFetching = () => {
  return {
    type: REMOVE_FETCHING
  }
};
// add post
export const addPost = post => {
  return {
    type: ADD_POST,
    post
  }
};

export const postFanOut = post => {
  return (dispatch, getState) => {
    const userID = getState().users.authedID;
    savePost(post)
      .then(newPost => {
        dispatch(addPost(newPost));
        dispatch(closeModal());
        dispatch(addSingleUsersPost(userID, newPost.postID));
      })
      .catch(err => {
        console.warn('error: ', err);
      });
  }
};
// add multiple posts
export const addMultiplePosts = posts => {
  return {
    type: ADD_MULTIPLE_POSTS,
    posts
  };
};

export const fetchAndHandlePost = postID => dispatch => {
  dispatch(fetchingPost());
  fetchPost(postID)
    .then(post => dispatch(fetchingPostSuccess(post)))
    .catch(error => dispatch(fetchingPostError(error)));
}

// posts reducer

const initialState = Map({
  isFetching: true,
  error: ''
});

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_POST:
      return state.merge({
        isFetching: true
      });
      
    case ADD_POST:
    case FETCHING_POST_SUCCESS:
      return state.merge({
        error: '',
        isFetching: false,
        [action.post.postID]: action.post
      });
    
    case FETCHING_POST_ERROR:
      return state.merge({
        error: action.error,
        isFetching: false
      });
    
    case REMOVE_FETCHING:
      return state.merge({
        error: '',
        isFetching: false
      });
      
    case ADD_MULTIPLE_POSTS:
      return state.merge(action.posts)
      
    default:
      return state;
  }
};
