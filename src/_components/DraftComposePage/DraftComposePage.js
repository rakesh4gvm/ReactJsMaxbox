import React, { useState, useEffect, useRef } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, ValidateEmail } from "../../_helpers/Utility";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Col, Row } from 'react-bootstrap';
import Close from '../../images/icons/w-close.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import { Input } from '@mui/material';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { EditorVariableNames } from "../../_helpers/Utility";

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

toast.configure();

function useOutsideAlerter(ref) {
}

export default function DraftComposePage({ GetDraftList }) {
    const [ClientID, SetClientID] = React.useState(0);
    const [UserID, SetUserID] = React.useState(0);
    const [EmailAccountUsers, SetEmailAccountUsers] = useState([])
    const [SelectedEmailAccountUser, SetSelectedEmailAccountUser] = useState([])
    const [Ccflag, SetCcflag] = useState(false);
    const [Bccflag, SetBccflag] = useState(false);
    const [Signature, SetSignature] = useState({
        Data: ""
    })

    useEffect(() => {
        GetClientID()
    }, [])

    // Get Client ID
    const GetClientID = () => {
        var UserDetails = GetUserDetails();
        if (UserDetails != null) {
            SetClientID(UserDetails.ClientID);
            SetUserID(UserDetails.UserID);
        }
        GetEmailAccountUsers(UserDetails.ClientID, UserDetails.UserID)
    }

    // Get All Email Account Users
    const GetEmailAccountUsers = (CID, UID) => {
        const Data = {
            ClientID: CID,
            UserID: UID,
        }
        Axios({
            url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountGetUsers",
            method: "POST",
            data: Data,
        }).then((Result) => {
            if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                SetEmailAccountUsers(Result.data.PageData)
            }
        })
    }

    // Open Compose
    const OpenCompose = (e) => {

        SetSelectedEmailAccountUser(0);
        SetSignature({ Data: "" });
        document.getElementById("To").value = ""
        document.getElementById("Subject").value = ""
        document.getElementById("CC").value = ""
        document.getElementById("BCC").value = ""


        const element = document.getElementById("UserCompose")

        if (element.classList.contains("show")) {
            element.classList.remove("show");
        }
        else {
            element.classList.add("show");
        }
    };

    // Close Compose
    const CloseCompose = () => {
        const element = document.getElementById("UserCompose")
        element.classList.remove("show");
    }

    // Open CC
    const OpenCc = () => {
        if (Ccflag == false) {
            document.getElementById("Cc").style.display = 'block'
            SetCcflag(true);
        }
        else {
            document.getElementById("Cc").style.display = 'none'
            SetCcflag(false);
        }
    };

    // Open BCC
    const OpenBcc = () => {
        if (Bccflag == false) {
            document.getElementById("Bcc").style.display = 'block'
            SetBccflag(true);
        }
        else {
            document.getElementById("Bcc").style.display = 'none'
            SetBccflag(false);
        }
    };

    // Selected Email Account User
    const SelectEmailAccountUser = (e) => {
        SetSelectedEmailAccountUser(e.target.value)
    }

    // Selected User
    const SelectedUser = EmailAccountUsers.find(o => o.AccountID === SelectedEmailAccountUser)

    // Sent Mail Starts
    const SentMail = async () => {

        var ToEmail = document.getElementById("To").value;
        var Subject = document.getElementById("Subject").value;
        var CC = document.getElementById("CC").value;
        var BCC = document.getElementById("BCC").value;


        const ValidToEmail = ValidateEmail(ToEmail)

        var CCEmail = true
        var BCCEmail = true

        if (CC != "") {
            CCEmail = ValidateEmail(CC)
        }
        if (BCC != "") {
            BCCEmail = ValidateEmail(BCC)
        }

        if (ToEmail == "" || Subject == "" || Signature.Data == "" || SelectedUser == undefined) {
            toast.error("All Fields are Mandatory!");
        } else if (!ValidToEmail) {
            toast.error("Please enter valid email");
        } else if (!CCEmail) {
            toast.error("Please enter valid CC email");
        }
        else if (!BCCEmail) {
            toast.error("Please enter valid BCC email");
        }
        else {
            const Data = {
                AccountID: SelectedUser?.AccountID,
                ToEmail: ToEmail,
                Subject: Subject,
                SignatureText: Signature.Data,
                CC: CC,
                BCC: BCC,
                FromEmail: SelectedUser.Email,
                RefreshToken: SelectedUser.RefreshToken,
                FirstName: SelectedUser.FirstName,
                LastName: SelectedUser.LastName,
                UserID: UserID,
                ClientID: ClientID,
                IsUnansweredResponsesMail: false,
                IsStarredMail: false,
                IsFollowUpLaterMail: false,
                IsSpamMail: false,
                IsDraftMail: true,
                IsAllSentEmails: false,
                IsUansweredReplies: false,
                CreatedBy: 1
            }
            Axios({
                url: CommonConstants.MOL_APIURL + "/receive_email_history/SentMail",
                method: "POST",
                data: Data,
            }).then((Result) => {
                if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                    toast.success(<div>Draft<br />Mail send successfully.</div>)
                    OpenCompose();
                    CloseCompose()
                    // GetDraftList()
                    document.getElementById("To").value = ""
                    document.getElementById("Subject").value = ""
                    document.getElementById("CC").value = ""
                    document.getElementById("BCC").value = ""
                } else {
                    toast.error(Result?.data?.Message);
                }
            })
        }
    }
    // Sent Mail Ends

    // Frola Editor Starts
    Froalaeditor.RegisterCommand('Send', {
        colorsButtons: ["colorsBack", "|", "-"],
        callback: SentMail
    });
    Froalaeditor.RegisterCommand('Delete', {
        colorsButtons: ["colorsBack", "|", "-"],
        align: 'right',
        buttonsVisible: 2,
        title: 'Delete',
        callback:  function (cmd, val) {
            CloseCompose();
            const element = document.getElementById("DraftCompose")
            element.classList.remove("show");
        }
    });
    Froalaeditor.RegisterCommand('Sendoption', {
        colorsButtons: ["colorsBack", "|", "-"],
        title: '',
        type: 'dropdown',
        focus: false,
        undo: false,
        refreshAfterCallback: true,
        options: EditorVariableNames(),
        callback: function (cmd, val) {
            var editorInstance = this;
            editorInstance.html.insert("{" + val + "}");
        },
        // Callback on refresh.
        refresh: function ($btn) {
        },
        // Callback on dropdown show.
        refreshOnShow: function ($btn, $dropdown) {
        }
    });
    Froalaeditor.RegisterCommand('moreMisc', {
        title: '',
        type: 'dropdown',
        focus: false,
        undo: false,
        refreshAfterCallback: true,
        options: EditorVariableNames(),
        callback: function (cmd, val) {
            var editorInstance = this;
            editorInstance.html.insert("{" + val + "}");
        },
        // Callback on refresh.
        refresh: function ($btn) {
        },
        // Callback on dropdown show.
        refreshOnShow: function ($btn, $dropdown) {
        }
    });
    const config = {
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false,
        toolbarButtons: [['Send', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'emoticons', 'insertLink'], ['Delete', 'moreMisc']],
        imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
        fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
        imageUploadRemoteUrls: false,
    }
    const HandleModelChange = (Model) => {
        SetSignature({
            Data: Model
        });
    }
    var editor = new FroalaEditor('.send', {}, function () {
        editor.button.buildList();
    })
    // Frola Editor Ends

    const WrapperRef = useRef(null);
    useOutsideAlerter(WrapperRef);

    return (
        <>
            <div className='composebody'>
            {/* <Button variant="contained btn btn-primary largbtn mr-2" onClick={OpenCompose}> + Draft</Button> */}
            <Button variant="contained btn btn-primary largbtn mr-4" onClick={OpenCompose}> + Compose</Button>
                <div className="usercompose" id="UserCompose" ref={WrapperRef}>
                    <div className='hcompose px-3'>
                        <Row>
                            <Col><h4>New Message</h4></Col>
                            <Col className='col text-right'>
                                <ButtonGroup variant="text" aria-label="text button group">
                                    <Button>
                                        <img src={Minimize} />
                                    </Button>
                                    <Button>
                                        <img src={Maximize} />
                                    </Button>
                                    <Button onClick={OpenCompose}>
                                        <img src={Close} />
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose px-3 py-2'>
                        <Row className='px-3'>
                            <Col xs={2} className="px-0 pt-1">
                                <h6>Email Account :</h6>
                            </Col>
                            <Col xs={10} className="px-1">
                                <div className='comse-select'>
                                    <Select
                                        value={SelectedEmailAccountUser}
                                        onChange={SelectEmailAccountUser}
                                    >
                                        {
                                            EmailAccountUsers.map((row) => (
                                                <MenuItem value={row?.AccountID}>{row?.Email}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose px-3 py-2'>
                        <Row className='px-3'>
                            <Col xs={1} className="px-0">
                                <h6>To :</h6>
                            </Col>
                            <Col xs={9} className="px-0">
                                <Input className='input-clend' id='To' name='To' />

                            </Col>
                            <Col xs={2} className='col text-right d-flex'>
                                <Button className='lable-btn' onClick={OpenCc}>Cc</Button>
                                <Button className='lable-btn' onClick={OpenBcc}>Bcc</Button>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose cc px-3 py-2' id='Cc'>
                        <Row className='px-3'>
                            <Col xs={1} className="px-0">
                                <h6>Cc :</h6>
                            </Col>
                            <Col xs={11} className="px-0">
                                <Input className='input-clend' id='CC' name='Cc' />
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose bcc px-3 py-2' id='Bcc'>
                        <Row className='px-3'>
                            <Col xs={1} className="px-0">
                                <h6>Bcc :</h6>
                            </Col>
                            <Col xs={11} className="px-0">
                                <Input className='input-clend' id='BCC' name='Bcc' />
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose px-3 py-2'>
                        <Row className='px-3'>
                            <Col xs={1} className="px-0">
                                <h6>Subject :</h6>
                            </Col>
                            <Col xs={11} className="px-0">
                                <Input className='input-clend' id='Subject' name='Subject' />
                            </Col>
                        </Row>
                    </div>
                    <div className='bodycompose'>
                        <Row className='pt-2'>
                            <Col>
                                <div className='FroalaEditor'>
                                    <FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={Signature.Data} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );
}