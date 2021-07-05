// before: import { createStore } from 'redux;
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

// before: const store = createStore(rootReducer);

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
