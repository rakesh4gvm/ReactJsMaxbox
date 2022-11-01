import React, { useState, useEffect, useRef } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, ValidateEmail, LoaderShow, LoaderHide } from "../../_helpers/Utility";
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
    const [SelectedEmailAccountUser, SetSelectedEmailAccountUser] = useState([])
    const [DraftSignature, SetDraftSignature] = useState({
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
    }

    // Open Compose
    const OpenDraftCompose = (e) => {

        const el = document.getElementById("UserCompose")
        el.classList.remove("show");

        SetSelectedEmailAccountUser(0);
        SetDraftSignature({ Data: "" });
        document.getElementById("ToEmail").value = ""
        document.getElementById("DraftSubject").value = ""

        const element = document.getElementById("DraftCompose")

        if (element.classList.contains("show")) {
            element.classList.remove("show");
        }
        else {
            element.classList.add("show");
        }
    };

    // Close Compose
    const CloseDraftCompose = () => {
        const element = document.getElementById("DraftCompose")
        element.classList.remove("show");

    }

    // Sent Mail Starts
    const AddDraftTemplate = async () => {

        var ToEmail = document.getElementById("ToEmail").value;
        var Subject = document.getElementById("DraftSubject").value;

        const ValidToEmail = ValidateEmail(ToEmail)

        if (ToEmail == "" || Subject == "" || DraftSignature.Data == "") {
            toast.error("All Fields are Mandatory!");
        } else if (!ValidToEmail) {
            toast.error("Please enter valid email");
        }
        else {
            LoaderShow()
            const Data = {
                MailTo: ToEmail,
                Subject: Subject,
                Body: DraftSignature.Data,
                UserID: UserID,
                ClientID: ClientID,
                CreatedBy: UserID
            }
            Axios({
                url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateAdd",
                method: "POST",
                data: Data,
            }).then((Result) => {
                if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                    toast.success(<div>Draft<br />Draft added successfully.</div>)
                    OpenDraftCompose();
                    CloseDraftCompose()
                    LoaderHide()
                    GetDraftList(ClientID, UserID, 1, "")
                    document.getElementById("ToEmail").value = ""
                    document.getElementById("DraftSubject").value = ""
                } else {
                    toast.error(Result?.data?.Message);
                    LoaderHide()
                }
            })
        }
    }
    // Sent Mail Ends

    // Frola Editor Starts
    Froalaeditor.RegisterCommand('Save', {
        colorsButtons: ["colorsBack", "|", "-"],
        callback: AddDraftTemplate
    });
    // Froalaeditor.RegisterCommand('DraftCompose Delete', {
    //     colorsButtons: ["colorsBack", "|", "-"],
    //     align: 'right',
    //     buttonsVisible: 2,
    //     title: 'Delete',
    //     callback: CloseDraftCompose
    // });
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
        quickInsertEnabled: false,
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false,
        toolbarButtons: [['Save', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink'], ['Delete', 'moreMisc']],
        imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
        fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
        imageUploadRemoteUrls: false,
    }
    const HandleModelChange = (Model) => {
        SetDraftSignature({
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
                <Button variant="contained btn btn-primary largbtn btn-draft" onClick={OpenDraftCompose} >  + Draft</Button>
                {/* <Button variant="contained btn btn-primary largbtn" onClick={OpenDraftCompose}> + Compose</Button> */}
                <div className="draftCompose" id="DraftCompose" ref={WrapperRef}>
                    <div className='hcompose px-3'>
                        <Row>
                            <Col><h4>Draft Message</h4></Col>
                            <Col className='col text-right'>
                                <ButtonGroup variant="text" aria-label="text button group">
                                    <Button>
                                        <img src={Minimize} />
                                    </Button>
                                    <Button>
                                        <img src={Maximize} />
                                    </Button>
                                    <Button onClick={OpenDraftCompose}>
                                        <img src={Close} />
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose px-3 py-2'>
                        <Row className='px-3'>
                            <Col xs={1} className="px-0">
                                <h6>To :</h6>
                            </Col>
                            <Col xs={9} className="px-0">
                                <Input className='input-clend' id='ToEmail' name='ToEmail' />

                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose px-3 py-2'>
                        <Row className='px-3'>
                            <Col xs={1} className="px-0">
                                <h6>Subject :</h6>
                            </Col>
                            <Col xs={11} className="px-0">
                                <Input className='input-clend' id='DraftSubject' name='DraftSubject' />
                            </Col>
                        </Row>
                    </div>
                    <div className='bodycompose'>
                        <Row className='pt-2'>
                            <Col>
                                <div className='FroalaEditor'>
                                    <FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={DraftSignature.Data} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );
}