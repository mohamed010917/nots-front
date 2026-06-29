import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice.tsx";
import userReducer from "./slices/UserSlice.tsx";


const store = configureStore({
  reducer: {
    counter : counterReducer,
    user : userReducer ,
  },
});

export default store