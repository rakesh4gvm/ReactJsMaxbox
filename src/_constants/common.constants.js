
const database = 'http://localhost:3000';

//Google API email Authantication Start
const CLIENT_ID = '70271022962-vclajnhvde7gr2ssj9tn2sv0oi6anu0k.apps.googleusercontent.com'
const CLIENT_KEY = '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'
//Google API Ends

//Google Scope Start
const SCOPE="https://mail.google.com https://www.googleapis.com/auth/userinfo.profile"
//Google Scope End

// redirect url start
const REDIRECT_URL="http://localhost:3000/email_account/AuthCallback"
// redirect url end


export const CommonConstants = {
    MOL_APIURL: database,
    CLIENT_ID:CLIENT_ID,
    CLIENT_KEY:CLIENT_KEY,
    SCOPE:SCOPE,
    REDIRECT_URL:REDIRECT_URL,
    Title:' | MaxBox', //Title of page
    show_rows:[10,20,50,100],  //For rows show in table

};