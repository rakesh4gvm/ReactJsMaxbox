import React, { useState, useEffect, useRef } from 'react';
import Axios from "axios"
import parse from "html-react-parser";
import { Col, Row } from 'react-bootstrap';
import { toast } from "react-toastify";

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Input } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, ValidateEmail, LoaderHide, LoaderShow, EditorVariableNames } from "../../_helpers/Utility";

import Close from '../../images/icons/w-close.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import MaxboxLoading from '../../images/Maxbox-Loading.svg';

import "react-toastify/dist/ReactToastify.css";
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
 
const top100Films = [ 
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 }, 
];

const style = {
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

toast.configure();

function useOutsideAlerter(ref) {
}

export default function UnansweredResponsesComposePage({ GetUnansweredResponcesList }) {
    const [ClientID, SetClientID] = React.useState(0);
    const [UserID, SetUserID] = React.useState(0);
    const [EmailAccountUsers, SetEmailAccountUsers] = useState([])
    const [SelectedEmailAccountUser, SetSelectedEmailAccountUser] = useState([])
    const [Ccflag, SetCcflag] = useState(false);
    const [Bccflag, SetBccflag] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [temopen, setTemOpen] = React.useState(false);
    const handleTemOpen = () => setTemOpen(true);
    const handleTemClose = () => setTemOpen(false);
    const [expanded, setExpanded] = React.useState(false);
    const [ObjectData, SetAllObjectData] = useState([])
    const [TemplateData, SetAllTemplateData] = useState([])
    const [ClientData, SetClientData] = useState()
    const [Signature, SetSignature] = useState({
        Data: ""
    })

    useEffect(() => {
        GetClientID()
    }, [])

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const SelectTemplate = () => {
        var GetByClass = document.getElementsByClassName('active');
        LoaderShow()
        if (GetByClass.length > 0) {
            var TemplateID = document.getElementsByClassName('active')[0].id;
            var DivData = TemplateData.find(data => data.TemplatesID === TemplateID);
            var BodyData = Signature.Data;
            var body = "";
            BodyData.split(ClientData).map(function (address, index) {
                if (index == 0) {
                    body = address
                }
            });
            var chckEmptyBody = body.replace(/<[\/]{0,1}(p)[^><]*>/ig, '').replace(/<\/?[^>]+(>|$)/g, "").trim()
            document.getElementById("Subject").value = DivData.Subject;
            var NewData = "";
            if (body != "" && chckEmptyBody != "") {
                NewData = body + DivData.BodyText + ClientData;
            } else {
                NewData = DivData.BodyText + BodyData
            }
            SetSignature({ Data: NewData });
            LoaderHide()
            handleTemClose()
        } else {
            toast.error("Please select template");
            LoaderHide()
        }
    }

    const SelectObjectTemplate = () => {
        var GetByClass = document.getElementsByClassName('active');
        LoaderShow()
        if (GetByClass.length > 0) {
            var ObjectionTemplateID = document.getElementsByClassName('active')[0].id;
            var DivData = ObjectData.find(data => data.ObjectionTemplateID === ObjectionTemplateID);
            var BodyData = Signature.Data;
            var body = "";
            BodyData.split(ClientData).map(function (address, index) {
                if (index == 0) {
                    body = address
                }
            });
            var chckEmptyBody = body.replace(/<[\/]{0,1}(p)[^><]*>/ig, '').replace(/<\/?[^>]+(>|$)/g, "").trim()
            document.getElementById("Subject").value = DivData.Subject;
            var NewData = "";
            if (body != "" && chckEmptyBody != "") {
                NewData = body + DivData.BodyText + ClientData;
            } else {
                NewData = DivData.BodyText + BodyData
            }
            SetSignature({ Data: NewData });
            LoaderHide()
            handleClose()
        } else {
            toast.error("Please select object template");
            LoaderHide()
        }
    }

    const ActiveClass = (panel) => () => {
        const element = document.getElementById(panel)
        const elementcs = document.getElementsByClassName("active")
        if (elementcs.length > 0) {
            for (var i = elementcs.length - 1; i >= 0; i--) {
                elementcs[i].classList.remove("active");
            }
        }
        element.classList.add("active");
    }

    // Get Client ID
    const GetClientID = () => {
        var UserDetails = GetUserDetails();
        if (UserDetails != null) {
            SetClientID(UserDetails.ClientID);
            SetUserID(UserDetails.UserID);
        }
        GetEmailAccountUsers(UserDetails.ClientID, UserDetails.UserID)
        GetClientList(UserDetails.ClientID)
    }

    const GetClientList = (ID) => {
        let Data
        Data = {
            ID: ID
        };

        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/client/ClientGetByID",
            method: "POST",
            data: Data,
        });
        ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                SetClientData(Result?.data?.Data[0]?.SignatureText)
            }
        });
    };

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
            } else {
                toast.error(Result?.data?.Message);
            }
        })
    }

    // Open Compose
    const OpenComposeForward = (e) => {

        SetSelectedEmailAccountUser(0);
        SetSignature({ Data: "" });
        document.getElementById("To").value = ""
        document.getElementById("Subject").value = ""
        document.getElementById("CCForward").value = ""
        document.getElementById("BCCForward").value = ""


        const element = document.getElementById("UserComposeForward")

        if (element.classList.contains("show")) {
            element.classList.remove("show");
        }
        else {
            element.classList.add("show");
        }
    };

    // Close Compose
    const CloseComposeForward = () => {
        const element = document.getElementById("UserComposeForward")
        element.classList.remove("show");
    }

    // Open CC
    const OpenCcForward = () => {
        if (Ccflag == false) {
            document.getElementById("CcForward").style.display = 'block'
            SetCcflag(true);
        }
        else {
            document.getElementById("CcForward").style.display = 'none'
            SetCcflag(false);
        }
    };

    // Open BCC
    const OpenBccForward = () => {
        if (Bccflag == false) {
            document.getElementById("BccForward").style.display = 'block'
            SetBccflag(true);
        }
        else {
            document.getElementById("BccForward").style.display = 'none'
            SetBccflag(false);
        }
    };

    // Selected Email Account User
    const SelectEmailAccountUser = (e) => {
        SetSelectedEmailAccountUser(e.target.value)
        const str = "<br>"
        SetSignature({ Data: Signature.Data + str + ClientData })
        // editor.events.focus();
    }

    // Selected User
    const SelectedUser = EmailAccountUsers.find(o => o.AccountID === SelectedEmailAccountUser)

    // Sent Mail Starts
    const SentMail = async () => {

        var ToEmail = document.getElementById("To").value;
        var Subject = document.getElementById("Subject").value;
        var CC = document.getElementById("CCForward").value;
        var BCC = document.getElementById("BCCForward").value;

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
            LoaderShow()
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
                IsUnansweredResponsesMail: true,
                IsStarredMail: false,
                IsFollowUpLaterMail: false,
                IsSpamMail: false,
                IsDraftMail: false,
                IsAllSentEmails: false,
                CreatedBy: 1
            }
            Axios({
                url: CommonConstants.MOL_APIURL + "/receive_email_history/SentMail",
                method: "POST",
                data: Data,
            }).then((Result) => {
                if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                    toast.success(<div>Unanswered Responses <br />Mail send successfully.</div>);
                    OpenComposeForward();
                    CloseComposeForward()
                    LoaderHide()
                    // GetUnansweredResponsesList()
                    document.getElementById("To").value = ""
                    document.getElementById("Subject").value = ""
                    document.getElementById("CCForward").value = ""
                    document.getElementById("BCCForward").value = ""
                } else {
                    toast.error(Result?.data?.Message);
                    LoaderHide()
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
        callback: function (cmd, val) {
            CloseComposeForward()
            const element = document.getElementsByClassName("user_editor")
            element[0].classList.add("d-none");
            const elementfr = document.getElementsByClassName("user_editor_frwd")
            elementfr[0].classList.add("d-none");
        },
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
    Froalaeditor.RegisterCommand('TemplatesOption', {
        title: 'Templates Option',
        type: 'dropdown',
        focus: false,
        undo: false,
        className: 'tam',
        refreshAfterCallback: true,
        // options: EditorVariableNames(),
        options: {
            'opt1': 'Objections',
            'opt2': 'Templates'
        },
        callback: function (cmd, val) {
            var editorInstance = this;
            if (val == "opt1") {
                LoaderShow()
                var Data = {
                    ClientID: ClientID,
                    UserID: UserID,
                };
                const ResponseApi = Axios({
                    url: CommonConstants.MOL_APIURL + "/objection_template/ObjectionTemplateGetAll",
                    method: "POST",
                    data: Data,
                });
                ResponseApi.then((Result) => {
                    if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                        if (Result.data.PageData.length > 0) {
                            setExpanded(false)
                            SetAllObjectData(Result.data.PageData)
                            setOpen(true);
                            LoaderHide()
                        } else {
                            toast.error(Result?.data?.Message);
                            LoaderHide()
                        }
                    } else {
                        SetAllObjectData('');
                        toast.error(Result?.data?.Message);
                    }
                });
                // editorInstance.html.insert("{" + val + "}");
            }
            if (val == "opt2") {
                LoaderShow()
                var Data = {
                    ClientID: ClientID,
                    UserID: UserID,
                };
                const ResponseApi = Axios({
                    url: CommonConstants.MOL_APIURL + "/templates/TemplateGetAll",
                    method: "POST",
                    data: Data,
                });
                ResponseApi.then((Result) => {
                    if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                        if (Result.data.PageData.length > 0) {
                            setExpanded(false);
                            SetAllTemplateData(Result.data.PageData)
                            setTemOpen(true);
                            LoaderHide()
                        } else {
                            toast.error(Result?.data?.Message);
                            LoaderHide()
                        }
                    } else {
                        SetAllTemplateData('');
                        toast.error(Result?.data?.Message);
                    }
                });

                // editorInstance.html.insert("{" + val + "}");
            }
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
        toolbarButtons: [['Send', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOption'], ['Delete']],
        imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
        fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
        imageUploadRemoteUrls: false,
        key : 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4=='
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

    /* start navcode */
    const mincomposeonForward = () => {
        const element = document.getElementById("maxcomposeForward")
        if (element.classList.contains("minmusbox")) {
            element.classList.remove("minmusbox");
        }
        else {
            element.classList.add("minmusbox");
            element.classList.remove("largebox");
        }
    }

    const maxcomposeonForward = () => {
        const element = document.getElementById("maxcomposeForward")
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
             
              
                    <div className='hcompose px-3'>
                        <Row>
                            <Col><h4>Forward Message</h4></Col>
                            <Col className='col text-right'>
                                <ButtonGroup className='composeion' variant="text" aria-label="text button group">
                                    <Button onClick={mincomposeonForward} className="minicon">
                                        <img src={Minimize} />
                                    </Button>
                                    <Button onClick={maxcomposeonForward} className="maxicon">
                                        <img src={Maximize} />
                                    </Button>
                                    <Button onClick={CloseComposeForward}>
                                        <img src={Close} />
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose px-3 py-1'>
                        <Row className='px-3'>
                            <Col xs={3} className="px-0">
                                <h6>Email Account :</h6>
                            </Col>
                            <Col xs={9} className="px-1">
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
                    <div className='subcompose px-3'>
                        <Row className='px-3'>
                            <Col xs={2} className="px-0">
                                <h6>To :</h6>
                            </Col>
                            <Col xs={7} className="px-0">
                                {/* <Input className='input-clend' id='To' name='To' /> */}
                                <div className='multibox-filter'>
                                    <Autocomplete
                                        multiple
                                        id="ToForward"
                                        options={top100Films.map((option) => option.title)}
                                        defaultValue={[top100Films[0].title]}
                                        freeSolo
                                        renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
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
                            <Col xs={3} className='col text-right d-flex px-0'>
                                <Button className='lable-btn' onClick={OpenCcForward}>Cc</Button>
                                <Button className='lable-btn' onClick={OpenBccForward}>Bcc</Button>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose cc px-3' id='CcForward'>
                        <Row className='px-3'>
                            <Col xs={2} className="px-0">
                                <h6>Cc :</h6>
                            </Col>
                            <Col xs={10} className="px-0">
                                {/* <Input className='input-clend' id='CC' name='Cc' /> */}
                                <div className='multibox-filter'>
                                    <Autocomplete
                                        multiple
                                        id="CC"
                                        options={top100Films.map((option) => option.title)}
                                        defaultValue={[top100Films[0].title]}
                                        freeSolo
                                        renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
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
                    <div className='subcompose bcc px-3' id='BccForward'>
                        <Row className='px-3'>
                            <Col xs={2} className="px-0">
                                <h6>Bcc :</h6>
                            </Col>
                            <Col xs={10} className="px-0">
                                {/* <Input className='input-clend' id='BCC' name='Bcc' /> */}
                                <div className='multibox-filter'>
                                    <Autocomplete
                                        multiple
                                        id="BCC"
                                        options={top100Films.map((option) => option.title)}
                                        defaultValue={[top100Films[0].title]}
                                        freeSolo
                                        renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
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
                    <div className='subcompose px-3'>
                        <Row className='px-3'>
                            <Col xs={2} className="px-0">
                                <h6>Subject :</h6>
                            </Col>
                            <Col xs={10} className="px-0">
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
            
        </>
    );
}
 