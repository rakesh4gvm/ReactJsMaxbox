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
import Plusion from '../../images/icons/composeion.svg';

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
import { Edit } from '@material-ui/icons';

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

export default function UnansweredRepliesComposePage({ GetAllUnansweredRepliesList }) {
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
    const [TemplateID, SetTemplateID] = React.useState("");
    const [ObjectIDTemplateID, SetObjectIDTemplateID] = React.useState("");
    const [ClientSignatureData, SetClientSignatureData] = React.useState("");
    const [Signature, SetSignature] = useState({
        Data: ""
    })
    const [ToEmailValue, SetToEmailValue] = React.useState([]);
    const [CCEmailValue, SetCCEmailValue] = React.useState([]);
    const [BCCEmailValue, SetBCCEmailValue] = React.useState([]);
    const [NewTemplateID, SetNewTemplateID] = useState([])
    const [NewObjectionID, SetNewObjectionID] = useState([])

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
            SetNewTemplateID([...NewTemplateID, document.getElementsByClassName('active')[0].id])
            var TemplateID = document.getElementsByClassName('active')[0].id;
            var DivData = TemplateData.find(data => data.TemplatesID === TemplateID);
            var BodyData = Signature.Data;
            document.getElementById("Subject").value = DivData.Subject;
            var NewData = DivData.BodyText + BodyData
            SetTemplateID(TemplateID);
            // var body = "";
            // BodyData.split(ClientData).map(function (address, index) {
            //     if (index == 0) {
            //         body = address
            //         SetTemplateID("");
            //     }
            // });
            // var chckEmptyBody = body.replace(/<[\/]{0,1}(p)[^><]*>/ig, '').replace(/<\/?[^>]+(>|$)/g, "").trim()
            // document.getElementById("Subject").value = DivData.Subject;
            // var NewData = "";
            // if (body != "" && chckEmptyBody != "") {
            //     NewData = body + DivData.BodyText + ClientData;
            //     SetTemplateID(TemplateID);
            // } else {
            //     NewData = DivData.BodyText + BodyData;
            //     SetTemplateID(TemplateID);
            // }
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
            SetNewObjectionID([...NewObjectionID, document.getElementsByClassName('active')[0].id])
            var ObjectionTemplateID = document.getElementsByClassName('active')[0].id;
            var DivData = ObjectData.find(data => data.ObjectionTemplateID === ObjectionTemplateID);
            var BodyData = Signature.Data;
            var NewData = DivData.BodyText + BodyData
            document.getElementById("Subject").value = DivData.Subject;
            SetObjectIDTemplateID(ObjectionTemplateID)
            SetSignature({ Data: NewData });
            // var body = "";
            // BodyData.split(ClientData).map(function (address, index) {
            //     if (index == 0) {
            //         body = address
            //         SetObjectIDTemplateID("")
            //     }
            // });
            // var chckEmptyBody = body.replace(/<[\/]{0,1}(p)[^><]*>/ig, '').replace(/<\/?[^>]+(>|$)/g, "").trim()
            // document.getElementById("Subject").value = DivData.Subject;
            // var NewData = "";
            // if (body != "" && chckEmptyBody != "") {
            //     NewData = body + DivData.BodyText + ClientData;
            //     SetObjectIDTemplateID(ObjectionTemplateID);
            // } else {
            //     NewData = DivData.BodyText + BodyData;
            //     SetObjectIDTemplateID(ObjectionTemplateID)
            // }
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
    const OpenCompose = (e) => {
        if (ClientID == "" || ClientID == undefined || ClientID == null) {
            toast.error("Please add client.");
        }
        else {
            if (EmailAccountUsers.length > 0) {
                SetSelectedEmailAccountUser(EmailAccountUsers[0]?._id);
                SetSignature({ Data: "<br/>" + "<br/>" + EmailAccountUsers[0]?.EmailSignature })
                SetClientSignatureData(ClientData)
            } else {
                SetSelectedEmailAccountUser(0);
            }
            // SetClientSignatureData("")
            // SetSelectedEmailAccountUser(0);
            // SetSignature({ Data: "" });
            SetNewObjectionID([])
            SetNewTemplateID([])
            SetToEmailValue([])
            SetCCEmailValue([])
            SetBCCEmailValue([])
            document.getElementById("ToEmail").value = ""
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
            document.getElementById("ComposeCC").style.display = 'block'
            SetCcflag(true);
        }
        else {
            document.getElementById("ComposeCC").style.display = 'none'
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
        var EventValue = e.target.value
        var SelectedEmailValue = EmailAccountUsers.find((e) => e.AccountID == EventValue)
        SetSelectedEmailAccountUser(e.target.value)
        const str = "<br>"
        SetSignature({ Data: str + str + SelectedEmailValue.EmailSignature })

        // if (ClientSignatureData == "") {
        //     SetClientSignatureData(ClientData)
        //     SetSignature({ Data: Signature.Data + str + ClientData })
        // } else {
        //     Signature.Data = Signature.Data.replace(ClientSignatureData, ClientData)
        //     SetSignature({ Data: Signature.Data })
        // }
    }

    // Selected User
    const SelectedUser = EmailAccountUsers.find(o => o.AccountID === SelectedEmailAccountUser)

    // Sent Mail Starts
    const SentMail = async () => {

        let EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var EmailResponse = ToEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));
        var CCResponse = CCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));
        var BCCResponse = BCCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));

        var Subject = document.getElementById("Subject").value;

        var CCEmail = true
        var BCCEmail = true

        if (EmailResponse == "" || Subject == "" || Signature.Data == "" || SelectedUser == undefined) {
            toast.error("All fields are mandatory!");
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
                ToEmail: EmailResponse.toString(),
                Subject: Subject,
                SignatureText: Signature.Data,
                CC: CCResponse.toString(),
                BCC: BCCResponse.toString(),
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
                IsDraftMail: false,
                IsAllSentEmails: false,
                CreatedBy: 1,
                TemplateID: NewTemplateID,
                ObjectIDTemplateID: NewObjectionID
            }
            Axios({
                url: CommonConstants.MOL_APIURL + "/receive_email_history/SentMail",
                method: "POST",
                data: Data,
            }).then((Result) => {
                if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                    toast.success(<div>Mail sent successfully.</div>)
                    OpenCompose();
                    CloseCompose()
                    LoaderHide()
                    GetAllUnansweredRepliesList(ClientID, UserID, 1, [-1])
                    document.getElementById("ToEmail").value = ""
                    document.getElementById("Subject").value = ""
                    document.getElementById("CC").value = ""
                    document.getElementById("BCC").value = ""
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
            CloseCompose()
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
            SetSignature({
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
        placeholderText: 'Edit your content here!',
        charCounterCount: false,
        toolbarButtons: [['Send', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOption'], ['Delete']],
        imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
        fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
        imageUploadRemoteUrls: false,
        imageEditButtons: false,
        key: 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4=='
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
            <div id="hideloding" className="loding-display">
                <img src={MaxboxLoading} />
            </div>

            <Modal className="modal-lister"
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='m-head'>
                        <Typography id="modal-modal-title" variant="h4" component="h4">
                            Select Objection
                        </Typography>
                    </div>
                    <div className='m-body'>
                        <div className='listcardman'>
                            {ObjectData?.length > 0 && ObjectData?.map((row, index) => (
                                <div className='cardtemplate' onClick={ActiveClass(row.ObjectionTemplateID)} id={row.ObjectionTemplateID} >
                                    <Typography className='upperlable' sx={{ width: '33%', flexShrink: 0 }}>{row.Subject}</Typography>
                                    <Accordion className='activetemplate' expanded={expanded === row.ObjectionTemplateID} onChange={handleChange(row.ObjectionTemplateID)}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2bh-content"
                                            id="panel2bh-header"
                                        >
                                        </AccordionSummary>
                                        <AccordionDetails >
                                            <Typography >
                                                {parse(row.BodyText)}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>

                            ))}


                        </div>

                    </div>
                    <div className='m-fotter' align="right">
                        <ButtonGroup variant="text" aria-label="text button group">
                            <Button variant="contained btn btn-orang smallbtn mr-3" onClick={handleClose}> Cancel</Button>
                            <Button variant="contained btn btn-primary smallbtn" onClick={SelectObjectTemplate}> Select</Button>
                        </ButtonGroup>
                    </div>
                </Box>
            </Modal>

            <Modal className="modal-lister"
                open={temopen}
                onClose={handleTemClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='m-head'>
                        <Typography id="modal-modal-title" variant="h4" component="h4">
                            Select Template
                        </Typography>
                    </div>
                    <div className='m-body'>
                        <div className='listcardman'>

                            {TemplateData?.length > 0 && TemplateData?.map((row, index) => (
                                <div className='cardtemplate' onClick={ActiveClass(row.TemplatesID)} id={row.TemplatesID} >
                                    <Typography className='upperlable' sx={{ width: '33%', flexShrink: 0 }}>{row.Subject}</Typography>
                                    <Accordion className='activetemplate' expanded={expanded === row.TemplatesID} onChange={handleChange(row.TemplatesID)}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2bh-content"
                                            id="panel2bh-header"
                                        >
                                        </AccordionSummary>
                                        <AccordionDetails >
                                            <Typography >
                                                {parse(row.BodyText)}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className='m-fotter' align="right">
                        <ButtonGroup variant="text" aria-label="text button group">
                            <Button variant="contained btn btn-orang smallbtn mr-3" onClick={handleTemClose}> Cancel</Button>
                            <Button variant="contained btn btn-primary smallbtn" onClick={SelectTemplate}> Select</Button>
                        </ButtonGroup>
                    </div>
                </Box>
            </Modal>

            <div className='composebody' id='maxcompose'>
                <Button variant="contained btn btn-primary largbtn" onClick={OpenCompose}><img src={Plusion} /></Button>
                <div className="usercompose userdefual" id="UserCompose" ref={WrapperRef}>
                    <div className='hcompose px-3'>
                        <Row>
                            <Col><h4>New Message</h4></Col>
                            <Col className='col text-right'>
                                <ButtonGroup className='composeion' variant="text" aria-label="text button group">
                                    <Button onClick={mincomposeon} className="minicon">
                                        <img src={Minimize} />
                                    </Button>
                                    <Button onClick={maxcomposeon} className="maxicon">
                                        <img src={Maximize} />
                                    </Button>
                                    <Button onClick={OpenCompose}>
                                        <img src={Close} />
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose px-3 py-1'>
                        <Row className='px-3'>
                            <Col xs={2} className="px-0">
                                <h6>Email Account :</h6>
                            </Col>
                            <Col xs={8} className="px-1">
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
                            <Col xs={1} className="px-0">
                                <h6>To :</h6>
                            </Col>
                            <Col xs={8} className="px-0">
                                {/* <Input className='input-clend' id='ToEmail' name='ToEmail' /> */}
                                <div className='multibox-filter'>
                                    {/* <Autocomplete
                                        multiple
                                        id="ToEmail"
                                        value={ToEmailValue}
                                        options={top100Films.map((option) => option.title)}
                                        onChange={(event, newValue) => {
                                            SetToEmailValue(newValue);
                                        }}
                                        freeSolo
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
                                    /> */}
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        clearOnBlur
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
                                            // if (event.key === 'Tab') {
                                            //     const newInputValue = event.target.value;
                                            //     SetToEmailValue([...ToEmailValue, newInputValue]);
                                            // }
                                            if (event.keyCode === 188) {
                                                event.preventDefault();
                                                const newInputValue = event.target.value;
                                                SetToEmailValue([...ToEmailValue, newInputValue]);
                                                event.target.value = '';
                                            }
                                        }}
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
                            <Col xs={3} className='col text-right d-flex px-0'>
                                <Button className='lable-btn' onClick={OpenCc}>Cc</Button>
                                <Button className='lable-btn' onClick={OpenBcc}>Bcc</Button>
                            </Col>
                        </Row>
                    </div>
                    <div className='subcompose cc px-3' id='ComposeCC'>
                        <Row className='px-3'>
                            <Col xs={1} className="px-0">
                                <h6>Cc :</h6>
                            </Col>
                            <Col xs={11} className="px-0">
                                {/* <Input className='input-clend' id='CC' name='Cc' /> */}
                                <div className='multibox-filter'>
                                    <Autocomplete
                                        multiple
                                        id="CC"
                                        value={CCEmailValue}
                                        options={top100Films.map((option) => option.title)}
                                        onChange={(event, newValue) => {
                                            SetCCEmailValue(newValue);
                                        }}
                                        freeSolo
                                        clearOnBlur
                                        onClose={(event, newValue) => {
                                            const newInputValue = event.target.value;
                                            SetCCEmailValue([...CCEmailValue, newInputValue]);
                                        }}
                                        onKeyDown={(event, newValue) => {
                                            // if (event.key === 'Tab') {
                                            //     const newInputValue = event.target.value;
                                            //     SetCCEmailValue([...CCEmailValue, newInputValue]);
                                            // }
                                            if (event.keyCode === 188) {
                                                event.preventDefault();
                                                const newInputValue = event.target.value;
                                                SetCCEmailValue([...CCEmailValue, newInputValue]);
                                                event.target.value = '';
                                            }
                                        }}
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
                    <div className='subcompose bcc px-3' id='Bcc'>
                        <Row className='px-3'>
                            <Col xs={1} className="px-0">
                                <h6>Bcc :</h6>
                            </Col>
                            <Col xs={11} className="px-0">
                                {/* <Input className='input-clend' id='BCC' name='Bcc' /> */}
                                <div className='multibox-filter'>
                                    <Autocomplete
                                        multiple
                                        id="BCC"
                                        value={BCCEmailValue}
                                        options={top100Films.map((option) => option.title)}
                                        onChange={(event, newValue) => {
                                            SetBCCEmailValue(newValue);
                                        }}
                                        freeSolo
                                        clearOnBlur
                                        onClose={(event, newValue) => {
                                            const newInputValue = event.target.value;
                                            SetBCCEmailValue([...BCCEmailValue, newInputValue]);
                                        }}
                                        onKeyDown={(event, newValue) => {
                                            // if (event.key === 'Tab') {
                                            //     const newInputValue = event.target.value;
                                            //     SetBCCEmailValue([...BCCEmailValue, newInputValue]);
                                            // }
                                            if (event.keyCode === 188) {
                                                event.preventDefault();
                                                const newInputValue = event.target.value;
                                                SetBCCEmailValue([...BCCEmailValue, newInputValue]);
                                                event.target.value = '';
                                            }
                                        }}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => {
                                                var ValidEmail = ValidateEmail(option)
                                                if (ValidEmail) {
                                                    return (
                                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                                    )
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
                </div>
            </div>
        </>
    );
}