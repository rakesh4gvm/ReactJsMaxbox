import { history } from '../_helpers';
import { CommonConstants } from "../_constants/common.constants";
import Moment from "moment";
var CryptoJS = require("crypto-js");
// var FrontEndUrl = "https://frontend.maxbox.com";
// var FrontEndUrl = "http://localhost:3001";

//   npm i react - bootstrap - typeahead

export function GetUserDetails() {
    let ObjLoginData = JSON.parse(localStorage.getItem('LoginData'));
    if (ObjLoginData && ObjLoginData != null) {
        return ObjLoginData;
    } else {
        return null;
    }
}

export function encrypt(ID) {
    try {
        var UID = CryptoJS.AES.encrypt(
            JSON.stringify(ID),
            "my-secret-key@123"
        ).toString();
        return UID
    }
    catch {
        return "";
    }
}

export function decrypt(ID) {

    try {
        var bytes = CryptoJS.AES.decrypt(ID, 'my-secret-key@123');
        var UID = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return UID
    }
    catch {
        return "";
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
        return ObjLoginData;
    } else {
        return null;
    }
}


export function Locate(PageName, ID) {

    if (ID != "") {
        window.location.href = CommonConstants.FRONTENDURL + PageName + "?" + encrypt(ID)
    } else {
        window.location.href = CommonConstants.FRONTENDURL + PageName;
    }
}

export function ClientChnage(ClientDropdown) {
    if (ClientDropdown.length === 1) {
        window.location.href = CommonConstants.FRONTENDURL + "/AllInboxByID/" + ClientDropdown[0]?.AccountID;
    } else {
        window.location.href = CommonConstants.FRONTENDURL + "/AllInbox";
    }
    // window.location.reload(true)
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
    var element = document.getElementById('hideloding');

    if (element !== null) {
        element.style.display = "flex";
    }
    // return document.getElementById("hideloding").style.display = "flex";
}

export function LoaderHide() {
    var element = document.getElementById('hideloding');

    if (element !== null) {
        element.style.display = "none";
    }
    // return document.getElementById("hideloding").style.display = "none";
}

export function IsGreaterDate(Date) {
    return Moment(Date).isSameOrAfter(Moment(), 'day')
}

export function Plain2HTML(text) {
    return text = '<p>' + text.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
}

export function RemoveForwardPop() {
    const elementforward = document.getElementById("UserComposeForward")
    return elementforward.classList.remove("show");
}

export function RemoveCurrentEmailFromCC(OpenMessage) {
    return OpenMessage?.CcNameEmail?.map((e) => e?.Email)?.filter((e) => e != OpenMessage?.ToEmail)
}

export function RemoveCurrentEmailFromBCC(OpenMessage) {
    return OpenMessage?.BccNameEmail?.map((e) => e?.Email)?.toString()
}

export function SortEmailAccounts(EmailAccountUsers) {
    return EmailAccountUsers.map(function (item) {
        var emailSignatures = item.EmailSignature.slice();
        emailSignatures.sort(function (a, b) {
            // Sort by IsDefault in descending order
            return b.IsDefault - a.IsDefault;
        });
        item.EmailSignature = emailSignatures;
        return item;
    });
}

export function DrawPreviewStyle() {
    return {
        backgroundColor: "rgb(68, 67, 67)",
        borderColor: "#F96816",
        color: "white",
        fontSize: 15,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20
    };
}

export function FormatDrawMessage(Id) {
    return `Move ${Id} conversations`;
}
