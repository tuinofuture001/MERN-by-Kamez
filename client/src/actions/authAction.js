import axios from 'axios';
import { GET_ERRORS } from './types';

// Register User
export const registerUser = (newUser, history) => (dispatch) => {
    axios
      .post('/api/users/register', newUser)
      .then(res => history.push('/login'))
      .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

// Login - Get User Token
export const loginUser = userData => dispatch => {
    axios
      .post('/api/users/login', userData)
      .then(res => {
        // Save to localStorage
        const { token } = res.data;
        // console.log(res.data);
        // Set token to localStorage
        localStorage.setItem('jwtToken', token);
        // Set token to Auth header
        setAuthToken(token);

      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };