// const { HOST } = require("@/utiles/constants");
// const { default: axios } = require("axios");

// import { HOST } from "@/utiles/constants";
import axios from "axios";
import {HOST} from "@/utiles/constants.js";


 export const apiClient=axios.create({
    baseURL:"https://myporjectchatapp.onrender.com",
})

// export const apiClient=axios.create({
//     baseURL:HOST,
// })
// export default apiClient;