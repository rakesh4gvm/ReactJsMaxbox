import { commonConstants } from '../_constants/common.constants';

// Email for Forgot password
export function userForgotpassword(forgot_token){
    return (
        "<p style='align:center;'><b>Here we are to help you</P>\n<p style='align:center;'>Please click the following URL to reset your password:</p>\n"+commonConstants.resetpass + "?code="+forgot_token+"<p style='align:center;'>If clicking the URL above does not work, copy and past the URL into a browser window</p>\n<p style='align:center;'>This is system generated email and reply is not required.</p>"
    );
}

// Email For password Updated
export function userPasswordUpdate(){
    return (
        "<p style='align:center;'><b>Here we are conforming that</P>\n<p style='align:center;'>Your password is updated in SalesHive</p>\n<p style='align:center;'>This is system generated email and reply is not required.</p>"
    );
}

//Email for Responder invite
export function responderInvitation(invite_code){
    return (
        "<p style='align:center;'><b>Please click the following URL to set your credentials:</P>\n"+commonConstants.responder_Invitation + "?code="+invite_code+"<p style='align:center;'>If clicking the URL above does not work, copy and past the URL into a browser window</p>\n<p style='align:center;'>This is system generated email and reply is not required.</p>"
    );
}
//Email for coldcallers invite
export function coldcallersInvitation(invite_code){
    return (
        "<p style='align:center;'><b>Please click the following URL to set your credentials:</P>\n"+commonConstants.coldcallers_Invitation + "?code="+invite_code+"<p style='align:center;'>If clicking the URL above does not work, copy and past the URL into a browser window</p>\n<p style='align:center;'>This is system generated email and reply is not required.</p>"
    );
}
//Email for salesStrategists invite
export function salesStrategistsInvitation(invite_code){
    return (
        "<p style='align:center;'><b>Please click the following URL to set your credentials:</P>\n"+commonConstants.salesstrategists_invitation + "?code="+invite_code+"<p style='align:center;'>If clicking the URL above does not work, copy and past the URL into a browser window</p>\n<p style='align:center;'>This is system generated email and reply is not required.</p>"
    );
}

// Email for Email change
export function userEmailChange(email_token,email,url){
    return (
        "<p style='align:center;'><p style='align:center;'><b>Please click the following URL to update your Email:</b></p>\n"+url+ "?code="+email_token+"&email="+email+"<p style='align:center;'>If clicking the URL above does not work, copy and past the URL into a browser window</p>\n<p style='align:center;'>This is system generated email and reply is not required.</p>"
    );
}

//Email for responder invitation for create new responder profile
export function userEmailInvite(email,url){
    return (
        "<p style='align:center;'><p style='align:center;'><b>Please click the following URL to set your credentials:</b></p>\n"+ url + "?email="+email+"<p style='align:center;'>If clicking the URL above does not work, copy and past the URL into a browser window</p>\n<p style='align:center;'>This is system generated email and reply is not required.</p>"
   );
} 

//Email for potential meeting details
export function userEmail(){
    return (
        "<p style='align:center;'><p style='align:center;'><b>Please click the following URL to set your credentials:</b></p>\n"+ url + "?email="+email+"<p style='align:center;'>If clicking the URL above does not work, copy and past the URL into a browser window</p>\n<p style='align:center;'>This is system generated email and reply is not required.</p>"
   );
} 