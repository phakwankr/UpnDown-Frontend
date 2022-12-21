import React, { useReducer, useContext, useEffect } from 'react';

import reducer from './reducer';
import axios from 'axios';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_ACTIVITY_BEGIN,
  CREATE_ACTIVITY_SUCCESS,
  CREATE_ACTIVITY_ERROR,
  GET_ACTIVITIES_BEGIN,
  GET_ACTIVITIES_SUCCESS,
  SET_EDIT_ACTIVITY,
  DELETE_ACTIVITY_BEGIN,
  DELETE_ACTIVITY_ERROR,
  EDIT_ACTIVITY_BEGIN,
  EDIT_ACTIVITY_SUCCESS,
  EDIT_ACTIVITY_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from './actions';

const initialState = {
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  showSidebar: false,
  isEditing: false,
  editActivityId: '',
  activityTypeOptions: ['Running', 'Bicycling', 'Hiking', 'Swimming'],
  activities: [],
  totalActivities: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyActivity: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });
  // request

  // response

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log(error.response)
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, location } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    dispatch({ type: LOGOUT_USER });
  };
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };
  const createActivity = async () => {
    dispatch({ type: CREATE_ACTIVITY_BEGIN });
    try {
      const { Activityname, ActivityType, Description, Duration, CreatedAt } = state;
      await authFetch.post('/activities', {
        Activityname,
        Description,
        ActivityType,
        Duration,
        CreatedAt,
      });
      dispatch({ type: CREATE_ACTIVITY_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_ACTIVITY_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getActivities = async () => {
    const { page, search, searchStatus, searchType, sort } = state;

    let url = `/activities?page=${page}&status=${searchStatus}&activityType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_ACTIVITIES_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { activities, totalActivities, numOfPages } = data;
      dispatch({
        type: GET_ACTIVITIES_SUCCESS,
        payload: {
          activities,
          totalActivities,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditActivity = (id) => {
    dispatch({ type: SET_EDIT_ACTIVITY, payload: { id } });
  };
  const editActivity = async () => {
    dispatch({ type: EDIT_ACTIVITY_BEGIN });

    try {
      const { ActivityName, ActivityType, Description, Duration, Date, CreatedBy } = state;
      await authFetch.patch(`/activities/${state.editActivityId}`, {
        ActivityName,
        ActivityType,
        Description,
        Duration,
        Date,
        CreatedBy,
      });
      dispatch({ type: EDIT_ACTIVITY_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_ACTIVITY_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const deleteActivity = async (activityId) => {
    dispatch({ type: DELETE_ACTIVITY_BEGIN });
    try {
      await authFetch.delete(`/activities/${activityId}`);
      getActivities();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_ACTIVITY_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/activities/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyActivity: data.monthlyActivity,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      logoutUser();
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createActivity,
        getActivities,
        setEditActivity,
        deleteActivity,
        editActivity,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
