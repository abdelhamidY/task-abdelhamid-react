import { type PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import Loader from "../../../components/Loader/Loader";
import { persistor, store } from "../../store/store.config";

const ReduxProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader isLoading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
