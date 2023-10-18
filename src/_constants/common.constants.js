
const database = 'http://localhost:3000';

const FRONTENDURL = "http://localhost:3001";
// const FRONTENDURL = "https://frontend.maxbox.com";

//Google API email Authantication Start
const CLIENT_ID = '70271022962-vclajnhvde7gr2ssj9tn2sv0oi6anu0k.apps.googleusercontent.com'
const CLIENT_KEY = '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'
//Google API Ends

//Google Scope Start
const SCOPE = "https://mail.google.com https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/contacts.other.readonly https://www.googleapis.com/auth/pubsub https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.settings.sharing"
//Google Scope End

// redirect url start
const REDIRECT_URL = "http://localhost:3000/email_account/AuthCallback"
// redirect url end

// redirect url start
const HomePage = "http://localhost:3001/AllInbox"
const LoginPage = "http://localhost:3001"
// redirect url end

// socket url
// const SocketIP = "http://localhost:"
// const SocketPort = "3006"

// socket url
const SSEIP = "http://localhost:3007"

const PROMPT ="You are an email response writer. Please use the following 'Tone Of Voice' and 'Email Response Summary' to craft a response to the following Email Chain. NOTE: Only respond with the email response. Do not add a email signature or subject line.\n------- Sender Name -------\n{Sender Name}\n------- To Name --------\n{Receiver Name}\n------- Tone of Voice -------\n{Tone Of Voice}\n------- Email Response Summary -------\n{Email Response Summary}\n------- Email Chain -------\n{Full Email Chain}"

const DEFAULTLABELCOLOR = "#ddd"

export const CommonConstants = {
    MOL_APIURL: database,
    CLIENT_ID: CLIENT_ID,
    CLIENT_KEY: CLIENT_KEY,
    SCOPE: SCOPE,
    REDIRECT_URL: REDIRECT_URL,
    HomePage: HomePage,
    LoginPage: LoginPage,
    Title: ' | MaxBox', //Title of page
    show_rows: [10, 20, 50, 100],  //For rows show in table
    FRONTENDURL: FRONTENDURL,
    SSEIP: SSEIP,
    PROMPT:PROMPT,
    DEFAULTLABELCOLOR: DEFAULTLABELCOLOR
    // SocketIP: SocketIP,
    // SocketPort: SocketPort,
};