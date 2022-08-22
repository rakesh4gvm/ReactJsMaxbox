import { history } from '../_helpers';
import { CommonConstants } from "../_constants/common.constants";
export function GetUserDetails() {
    let ObjLoginData = JSON.parse(localStorage.getItem('LoginData'));
    if (ObjLoginData && ObjLoginData != null) {
        return ObjLoginData;
    } else {
        return null;
    }
}

export function CheckLocalStorage() {
    debugger;
    let ObjLoginData = JSON.parse(localStorage.getItem('LoginData'));
    if (ObjLoginData && ObjLoginData != null) {
        return true;
    } else {
        return false;
    }
}
export function UpdateUserDetails(ClientID) {
    let ObjLoginData = JSON.parse(localStorage.getItem('LoginData'));

    if (ObjLoginData && ObjLoginData != null) {
        ObjLoginData.ClientID = ClientID;
        localStorage.setItem("LoginData", JSON.stringify(ObjLoginData));

        return ObjLoginData;
    } else {
        return null;
    }
}
export function Logout() {
    localStorage.removeItem("LoginData");
    window.location.href = CommonConstants.LoginPage;
    // history.push('/');
}


export function SaveClientDetails(ClientID) {
    const data = { _id: ClientID }
    return localStorage.setItem("ClientID", JSON.stringify(data));
}

export function EditorVariableNames() {
    const VariableName = {
        'First Name': 'First Name',
        'Last Name': 'Last Name',
        'Email': 'Email',
    }
    return VariableName
}


