// export const HOST=import.meta.env.VITE_SERVER_URL;

// export const AUTH_ROUTES="/api/auth";

// export const REGISTOR_ROUTES=`${AUTH_ROUTES}/registor`;


export const HOST=import.meta.env.SERVER_URL;

export const AUTH_ROUTES='/api/auth';

export const SIGNUP_ROUTES=`${AUTH_ROUTES}/signup`;

//contact routes 
export  const CONATCT_ROUTES = '/api/contacts'
// export const GET_DM_CONATCT_ROUTES = `${CONATCT_ROUTES}/getContactForDm`;
export const GET_ALL_CONTACTS_ROUTES = `${CONATCT_ROUTES}/getallcontacts`;

//messages routes

export const MESSAGES_ROUTES ="api/getMessages";
export const UPLOAD_FILE_ROUTES =`${MESSAGES_ROUTES}/uploadfile`;


//channel routes

export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/createchannel`;


export const GET_USER_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/getuserchannels`;

