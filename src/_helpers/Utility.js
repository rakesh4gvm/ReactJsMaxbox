import { history } from '../_helpers';
import { CommonConstants } from "../_constants/common.constants";
import Moment from "moment";

export function GetUserDetails() {
    let ObjLoginData = JSON.parse(localStorage.getItem('LoginData'));
    if (ObjLoginData && ObjLoginData != null) {
        return ObjLoginData;
    } else {
        return null;
    }
}

export function CheckLocalStorage() {
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
        localStorage.setItem("NavigationID", "")
        window.location.reload();
        return ObjLoginData;
    } else {
        return null;
    }
}
export function Logout() {

    localStorage.removeItem("LoginData");
    localStorage.setItem("NavigationID", "")
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

export function ValidateEmail(Email) {
    if (
        !/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Email)
        // || (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(CC) && CC)
        // || (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(BCC) && BCC)
    ) {
        return false;
    }
    else {
        return true;
    }
};


export function LoaderShow() {
    return document.getElementById("hideloding").style.display = "flex";
}

export function LoaderHide() {
    return document.getElementById("hideloding").style.display = "none";
}

export function IsGreaterDate(Date) {
    return Moment(Date).isSameOrAfter(Moment(), 'day')
}