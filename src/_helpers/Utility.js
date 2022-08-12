import { history } from '../_helpers';

export function GetUserDetails() {
    let ObjLoginData = JSON.parse(localStorage.getItem('LoginData'));
    if (ObjLoginData && ObjLoginData != null) {
        return ObjLoginData;
    } else {
        return null;
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
    history.push('/');
}


export function SaveClientDetails(ClientID) {
    const data = { _id: ClientID }
    return localStorage.setItem("ClientID", JSON.stringify(data));
}


