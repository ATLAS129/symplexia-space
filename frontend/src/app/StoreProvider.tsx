"use client";

import { Provider } from "react-redux";
import { useRef } from "react";
import { makeStore, AppStore } from "../lib/store";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  const store = storeRef.current;
  const persistor = (store as any).__persistor;

  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={null /* CHANGE TO LOADING ANIMATION */}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
