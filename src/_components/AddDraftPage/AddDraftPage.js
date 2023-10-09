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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useParams } from 'react-router-dom';

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
];

toast.configure();

function useOutsideAlerter(ref) {
}

export default function DraftComposePage({ GetDraftList }) {
    const [ClientID, SetClientID] = React.useState(0);
    const [UserID, SetUserID] = React.useState(0);
    const [AccountID, SetAccountID] = React.useState(0);
    const [SelectedEmailAccountUser, SetSelectedEmailAccountUser] = useState([])
    const [DraftSignature, SetDraftSignature] = useState({
        Data: ""
    })
    const [ToEmailValue, SetToEmailValue] = React.useState([]);
    const { id } = useParams();

    useEffect(() => {
        GetClientID()
    }, [id])

    // Get Client ID
    const GetClientID = (ID) => {
        var ID = id;
        var UserDetails = GetUserDetails();
        if (UserDetails != null) {
            SetClientID(UserDetails.ClientID);
            SetUserID(UserDetails.UserID);
            SetAccountID(ID);
        }
    }

    // Open Compose
    const OpenDraftCompose = (e) => {

        const el = document.getElementById("UserCompose")
        el.classList.remove("show");

        SetSelectedEmailAccountUser(0);
        SetDraftSignature({ Data: "" });
        SetToEmailValue([])
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
        let EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var EmailResponse = ToEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));

        var ToEmail = document.getElementById("ToEmail").value;
        var Subject = document.getElementById("DraftSubject").value;

        const ValidToEmail = ValidateEmail(ToEmail)

        if (EmailResponse == "" || Subject == "" || DraftSignature.Data == "") {
            toast.error("All fields are mandatory!");
        }
        else {
            LoaderShow()
            const Data = {
                MailTo: EmailResponse.toString(),
                Subject: Subject,
                Body: DraftSignature.Data,
                UserID: UserID,
                ClientID: ClientID,
                AccountID: AccountID,
                CreatedBy: UserID
            }
            Axios({
                url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateAdd",
                method: "POST",
                data: Data,
            }).then((Result) => {
                if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                    toast.success(<div>Draft added successfully.</div>)
                    CloseDraftCompose()
                    LoaderHide()
                    GetDraftList(AccountID,ClientID, UserID, 1, "")
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
    Froalaeditor.RegisterCommand('DeleteDraft', {
        colorsButtons: ["colorsBack", "|", "-"],
        align: 'right',
        buttonsVisible: 2,
        title: 'Delete',
        callback: CloseDraftCompose
    });
    Froalaeditor.RegisterCommand('AddDrfatSendoption', {
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
            SetDraftSignature({
                Data: editorInstance.html.get()
            });
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
        placeholderText: 'Edit your content here!',
        charCounterCount: false,
        toolbarButtons: [['Save', 'AddDrfatSendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink'], ['DeleteDraft']],
        imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
        fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
        imageUploadRemoteUrls: false,
        imageEditButtons: false,
        key: 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4=='
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

    /* start navcode */
    const mincomposeon = () => {
        const element = document.getElementById("maxcompose")
        if (element.classList.contains("minmusbox")) {
            element.classList.remove("minmusbox");
        }
        else {
            element.classList.add("minmusbox");
            element.classList.remove("largebox");
        }
    }

    const maxcomposeon = () => {
        const element = document.getElementById("maxcompose")
        if (element.classList.contains("largebox")) {
            element.classList.remove("largebox");
        }
        else {
            element.classList.add("largebox");
            element.classList.remove("minmusbox");
        }
    }
    /* end code*/

    const WrapperRef = useRef(null);
    useOutsideAlerter(WrapperRef);

    return (
        <>
            <div className='composebody draftinx' id='maxcompose'>
                <Button className='small-font-size' variant="contained btn btn-primary largbtn btn-draft" onClick={OpenDraftCompose}  >  Draft</Button>
                {/* <Button variant="contained btn btn-primary largbtn" onClick={OpenDraftCompose}> + Compose</Button> */}
                <div className="draftCompose userdefual" id="DraftCompose" ref={WrapperRef}>
                    <div className='hcompose px-3'>
                        <Row>
                            <Col><h4>Draft Message</h4></Col>
                            <Col className='col text-right'>
                                <ButtonGroup className='composeion' variant="text" aria-label="text button group">
                                    <Button onClick={mincomposeon} className="minicon">
                                        <img src={Minimize} />
                                    </Button>
                                    <Button onClick={maxcomposeon} className="maxicon">
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
                            <Col xs={10} className="px-0">
                                {/* <Input className='input-clend' id='ToEmail' name='ToEmail' /> */}
                                <div className='multibox-filter'>
                                    <Autocomplete
                                        multiple
                                        id="ToEmail"
                                        value={ToEmailValue}
                                        options={top100Films.map((option) => option.title)}
                                        onChange={(event, newValue) => {
                                            SetToEmailValue(newValue);
                                        }}
                                        onClose={(event, newValue) => {
                                            const newInputValue = event.target.value;
                                            SetToEmailValue([...ToEmailValue, newInputValue]);
                                        }}
                                        onKeyDown={(event, newValue) => {
                                            if (event.keyCode === 188) {
                                                event.preventDefault();
                                                const newInputValue = event.target.value;
                                                SetToEmailValue([...ToEmailValue, newInputValue]);
                                                event.target.value = '';
                                            }
                                        }}
                                        freeSolo
                                        clearOnBlur
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => {
                                                var ValidEmail = ValidateEmail(option)
                                                if (ValidEmail) {
                                                    return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                                                }
                                            }
                                            )
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="filled"
                                                label=" "
                                                placeholder=" "
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose px-3 py-2'>
                        <Row className='px-3'>
                            <Col xs={2} className="px-0">
                                <h6>Subject :</h6>
                            </Col>
                            <Col xs={10} className="px-0">
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