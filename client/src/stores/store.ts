import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice, { AuthState } from './auth.slice';
import globalSlice, { GlobalState } from './global.slice';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import postSlice, { PostState } from './post.slice';
import userSlice, { UserState } from './user.slice';
import friendSlice, { FriendState } from './friend.slice';
import notificationSlice, { NotificationState } from './notification.slice';

// Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['global', 'auth'],
};
const combined = combineReducers({
  global: globalSlice.reducer,
  auth: authSlice.reducer,
  post: postSlice.reducer,
  user: userSlice.reducer,
  friend: friendSlice.reducer,
  notification: notificationSlice.reducer,
});
const persistedReducer = persistReducer(persistConfig, combined);

export interface StateType {
  global: GlobalState;
  auth: AuthState;
  post: PostState;
  user: UserState;
  friend: FriendState;
  notification: NotificationState;
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
