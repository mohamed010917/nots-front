import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Logout from "../app/pages/Logout";
interface UserState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}  

const initialState : UserState= {
    user:null ,
    token : null ,
    loading: false,
    error:  null 
}


export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (token: string) => {
    const response = await fetch("http://localhost:5000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(response.status === 401){
       cookieStore.delete("token") ;
       Logout() ;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  }
);

export const getToken = createAsyncThunk("user/getToken", async () => {
  const token = await cookieStore.get("token");
  return token?.value || null;
});

const UserSlice = createSlice({
    name: "user" ,
    initialState ,
    reducers : {
        setUser : (state , action) => {
            state.user = action.payload.user ;
            state.token = action.payload.token ? action.payload.token : state.token ;
        } ,
        clearUser : (state) => {
            state.user = null ;
            state.token = null ;
        } ,
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserData.pending, (state) => {
            console.log("fetching user data...");
            state.loading = true;
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            console.log("user data fetched successfully:", action.payload);
            state.loading = false;
            state.user = action.payload.date;
        })
        .addCase(fetchUserData.rejected, (state, action) => {
            console.error("Failed to fetch user data:", action.error.message);
            state.loading = false;
            state.error = action.error.message ?? null;
        })
        .addCase(getToken.fulfilled, (state, action) => {
            console.log("Token retrieved:", action.payload);
            state.token = action.payload;
        }).addCase(getToken.rejected, (state) => {
            console.error("Failed to retrieve token");
            state.token = null;
        });
    },

    

}) ;
export const selectUser = (state : any) => state.user.user;
export const selectToken = (state : any) => state.user.token;
export const { setUser , clearUser  } = UserSlice.actions ;

export default UserSlice.reducer ;