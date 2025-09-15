import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./states/authSlice";
import workspaceReducer from "./states/workspaceSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
});

export const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return configureStore({ reducer: rootReducer });
  } else {
    // require redux-persist here to avoid accessing localStorage during SSR/build
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { persistReducer, persistStore } = require("redux-persist");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const storage = require("redux-persist/lib/storage").default;

    const persistConfig = {
      key: "root",
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [
              "persist/PERSIST",
              "persist/REHYDRATE",
              "persist/FLUSH",
              "persist/PAUSE",
              "persist/PURGE",
              "persist/REGISTER",
            ],
          },
        }),
    });
    (store as any).__persistor = persistStore(store);
    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
