import React, { useState, useEffect, useRef } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails } from "../../_helpers/Utility";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Col, Row } from 'react-bootstrap';
import Close from '../../images/icons/w-close.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import { Input, TextareaAutosize } from '@mui/material';
import icondelete from '../../images/icons/icon_delete.svg';
import iconmenu from '../../images/icons/icon_menu.svg';
import attachment from '../../images/icons/attachment.svg';
import text_font from '../../images/icons/text_font.svg';
import image_light from '../../images/icons/image_light.svg';
import smiley_icons from '../../images/icons/smiley_icons.svg';
import signature from '../../images/icons/signature.svg';
import link_line from '../../images/icons/link_line.svg';
import template from '../../images/icons/template.svg';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { EditorVariableNames } from "../../_helpers/Utility";

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

toast.configure();
const Style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function useOutsideAlerter(ref) {
    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (ref.current && !ref.current.contains(event.target)) {
    //             const element = document.getElementById("UserCompose")
    //             element.classList.remove("show");
    //         }
    //     }
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [ref]);
}

export default function StarredComposePage({ GetStarredList }) {
    const [ClientID, SetClientID] = React.useState(0);
    const [UserID, SetUserID] = React.useState(0);
    const [EmailAccountUsers, SetEmailAccountUsers] = useState([])
    const [SelectedEmailAccountUser, SetSelectedEmailAccountUser] = useState([])
    const [State, SetState] = useState({
        To: "",
        Subject: "",
        Body: "",
        CC: "",
        BCC: ""
    })
    const [Ccflag, SetCcflag] = useState(false);
    const [Bccflag, SetBccflag] = useState(false);
    const [Signature, SetSignature] = useState({
        Data: ""
    })
    const [Value, SetValue] = useState({
        FirstName: "",
        LastName: "",
        Email: ""
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
    const OpenCompose = () => {
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

    // Open cc
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
    // Open bcc
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

    // Handle State Change
    const HandleChange = (e) => {
        SetState({ ...State, [e.target.name]: e.target.value })
    }

    // Validate Email
    const ValidateEmail = (Email) => {
        if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Email)
        ) {
            return false;
        }
        else {
            return true;
        }
    };

    // Valicate CC Email
    const ValidateCC = (CC) => {
        if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(CC)) {
            return false;
        }
        else {
            return true;
        }
    };

    // Validate BCC Email
    const ValidateBCC = (BCC) => {
        if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(BCC)) {
            return false;
        }
        else {
            return true;
        }
    };

    const SelectEmailAccountUser = (e) => {
        SetSelectedEmailAccountUser(e.target.value)
    }

    const SelectedUser = EmailAccountUsers.find(o => o.AccountID === SelectedEmailAccountUser)

    // Sent Mail Starts
    const SentMail = async () => {
        var ToEmail = document.getElementById("To").value;
        var Subject = document.getElementById("Subject").value;
        // var Body = document.getElementById("Body").value;
        var CC = document.getElementById("CC").value;
        var BCC = document.getElementById("BCC").value;

        const ValidToEmail = ValidateEmail(ToEmail)
        const ValidCCEmail = ValidateCC(CC)
        const ValidBCCEmail = ValidateBCC(BCC)

        if (ToEmail === "" || Subject === "" || Signature?.Data === "" || SelectedUser === undefined) {
            toast.error("All Fields are Mandatory!");
        } else if (!ValidToEmail || (!ValidCCEmail && CC) || (!ValidBCCEmail && BCC)) {
            toast.error("Please enter valid email");
        } else {
            const Data = {
                ToEmail: ToEmail,
                // Body: Body,
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
                IsStarredMail: true,
                IsFollowUpLaterMail: false,
                CreatedBy: 1
            }
            Axios({
                url: CommonConstants.MOL_APIURL + "/receive_email_history/SentMail",
                method: "POST",
                data: Data,
            }).then((Result) => {
                if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                    toast.success("Mail Send Successfully!");
                    OpenCompose();
                    CloseCompose()
                    GetStarredList()
                    SetState({ To: "", Subject: "", Body: "", CC: "", BCC: "" })
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
            SetValue(val)
            var editorInstance = this;
            editorInstance.html.insert("{" + val + "}");
        },
        // Callback on refresh.
        refresh: function ($btn) {
            console.log('do refresh');
        },
        // Callback on dropdown show.
        refreshOnShow: function ($btn, $dropdown) {
            console.log('do refresh when show');
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
            console.log('do refresh');
        },
        // Callback on dropdown show.
        refreshOnShow: function ($btn, $dropdown) {
            console.log('do refresh when show');
        }
    });
    // Check Client Exists
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
                <Button variant="contained btn btn-primary largbtn" onClick={OpenCompose}> + Compose</Button>
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
                                <Input className='input-clend' id='To' name='To' value={State.To} onChange={HandleChange} />

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
                                <Input className='input-clend' id='Subject' name='Subject' value={State.Subject} onChange={HandleChange} />
                            </Col>
                            {/* <Col xs={11} className="px-0">
                                <Input className='input-clend' id='Body' name='Body' value={State.Subject} onChange={HandleChange} />
                            </Col> */}
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

                    {/* <div className='bodycompose'>
                        <Row className='px-3 py-2'>
                            <Col>
                                <TextareaAutosize className='w-100' id='Body'
                                    name='Body'
                                    value={State.Body}
                                    onChange={HandleChange}
                                    aria-label="minimum height"
                                    minRows={3}
                                    placeholder=""
                                />
                            </Col>
                        </Row>
                    </div> */}

                    {/* <div className='ftcompose px-3'>
                        <Row className='px-3'>
                            <Col xs={10} className='px-0'>
                                <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                                    <Button variant="contained btn btn-primary smallbtn" onClick={SentMail}> Save</Button>
                                    <Button>
                                        <img src={text_font} />
                                    </Button>
                                    <Button>
                                        <img src={attachment} />
                                    </Button>
                                    <Button>
                                        <img src={image_light} />
                                    </Button>
                                    <Button>
                                        <img src={smiley_icons} />
                                    </Button>
                                    <Button>
                                        <img src={signature} />
                                    </Button>
                                    <Button>
                                        <img src={link_line} />
                                    </Button>
                                    <Button>
                                        <img src={template} />
                                    </Button>
                                </ButtonGroup>
                            </Col>

                            <Col xs={2} className='px-0 text-right'>
                                <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                                    <Button>
                                        <img src={icondelete} />
                                    </Button>
                                    <Button>
                                        <img src={iconmenu} />
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div> */}
                </div>
            </div>
        </>
    );
}