/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { AppStore, makeStore } from "@/redux/store";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);
  const [persistor, setPersistor] = useState<any>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // ✅ Move persistStore() into useEffect to avoid calling during render
  useEffect(() => {
    const _persistor = persistStore(storeRef.current!);
    setPersistor(_persistor);
  }, []);

  if (!persistor) {
    // prevent rendering before PersistGate is ready
    return <p>Loading...</p>;
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={<p>Loading... </p>} persistor={persistor}>
        {children}
      </PersistGate>
      {/* {children} */}
    </Provider>
  );
};

export default StoreProvider;
