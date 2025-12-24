// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import PersistSpinner from "@/components/shared/PersistSpinner";
// import { AppStore, makeStore } from "@/redux/store";
// import React, { ReactNode, useEffect, useRef, useState } from "react";
// import { Provider } from "react-redux";
// import { persistStore } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";

// const StoreProvider = ({ children }: { children: ReactNode }) => {
//   const storeRef = useRef<AppStore>(undefined);
//   const [persistor, setPersistor] = useState<any>(null);
//   if (!storeRef.current) {
//     storeRef.current = makeStore();
//   }

//   // ✅ Move persistStore() into useEffect to avoid calling during render
//   useEffect(() => {
//     const _persistor = persistStore(storeRef.current!);
//     setPersistor(_persistor);
//   }, []);

//   if (!persistor) {
//     // prevent rendering before PersistGate is ready
//     // return (
//     //   <div className="flex flex-col items-center gap-4">
//     //     <Button size="sm">
//     //       <Spinner />
//     //       Loading...
//     //     </Button>
//     //   </div>
//     // );

//     return <PersistSpinner />;
//   }

//   return (
//     <Provider store={storeRef.current}>
//       <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
//         {children}
//       </PersistGate>
//       {/* {children} */}
//     </Provider>
//   );
// };

// export default StoreProvider;

"use client";
import { AppStore, makeStore } from "@/redux/store";
import React, { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import PersistSpinner from "@/components/shared/PersistSpinner";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);
  const persistorRef = useRef<ReturnType<typeof persistStore>>(undefined);

  // Initialize store and persistor only once
  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={<PersistSpinner />}
        persistor={persistorRef.current!}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
