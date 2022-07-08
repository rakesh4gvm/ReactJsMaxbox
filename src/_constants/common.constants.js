const home = 'http://localhost:8080/';
const database = 'http://localhost:9000';
const imgdatabase='http://localhost:9000/';
export const commonConstants = {
    MOL_APIURL: database,
    enckey:'secret key 123',
    home:home,
    resetpass: home +'resetpassword',
    Token_timer:3,  //minitues
    RememberMe_timer:3,  //minites
    Title:' | SalesHive', //Title of page
    responder_Invitation:home + 'addresponder',
    coldcallers_Invitation:home + 'addcoldcallers',
    salesstrategists_invitation:home + 'addsalesstrategists',
    Image_url:imgdatabase + 'UserProfilePic/', // image path of server
    change_Email_responder:home + 'updateemailresponder',
    change_Email_coldcallers:home + 'updateemailcoldcallers',
    change_Email_admin:home + 'updateemailadmin',
    change_Email_salesstrategists:home + 'updateemailstrategists',
    change_Email_timer:3, //minites
    new_admin_url:home + 'addadmin',
    new_responder_url:home + 'addresponder',
    new_coldercaller_url:home + 'addcoldcallers',
    show_rows:[10,20,50,100],  //For rows show in table
    new_sales_strategists_url:home + 'addsalesstrategists',
};