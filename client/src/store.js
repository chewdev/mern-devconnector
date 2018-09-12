import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

const initialState = {};

const middleware = [thunk];

const shouldApplyDevTools =
  process.env.NODE_ENV === "production"
    ? null
    : window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    shouldApplyDevTools
  )
);

export default store;
