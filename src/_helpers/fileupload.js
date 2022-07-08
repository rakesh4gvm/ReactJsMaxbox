import { ToastContainer, toast } from 'react-toastify';

// Check type of file
export function checkMimeType(event){
    let files = event;
    let err = [];
    const types = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (types.every(type => files.type !== type)) {
        err = this.state.supportedformat;
    }
    if (err != '') {
        event = null;
        toast.error(err);
        return false;
    } else {
        return true;
    }
}

//Check size of file 2 MB
export function checkFileSize(event){
    let files = event;
    let size = 2000000;
    let err = [];
    if (files.size > size) {
        err = "Your file is too large.";
    }
    if (err != '') {
        event = null;
        toast.error(err);
        return false;
    } else {
        return true;
    }
}

// Uploaded image converted in Base64 string
export function getBase64(file, cb) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}