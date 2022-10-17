import React, { useState, useEffect, useRef } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, ValidateEmail } from "../../_helpers/Utility";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { EditorVariableNames } from "../../_helpers/Utility";

import { Col, Row } from 'react-bootstrap';
import Close from '../../images/icons/w-close.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import { Input } from '@mui/material';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

 
import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@material-ui/icons/Delete';
import { display } from '@mui/system';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary'; 
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

export default function UnansweredResponsesComposePage({ GetUnansweredResponsesList }) {
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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


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
            } else {
                toast.error(Result?.data?.Message);
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

    // Select Email Account User
    const SelectEmailAccountUser = (e) => {
        SetSelectedEmailAccountUser(e.target.value)
    }

    // Selected User
    const SelectedUser = EmailAccountUsers.find(o => o.AccountID === SelectedEmailAccountUser)

    // Sent Mail
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

        if (ToEmail == "" || Subject == "" || Signature?.Data == "" || SelectedUser == undefined) {
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
                IsUnansweredResponsesMail: true,
                IsStarredMail: false,
                IsFollowUpLaterMail: false,
                IsSpamMail: false,
                IsDraftMail: false,
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
                    toast.success(<div>Unanswered Responses <br />Mail send successfully.</div>);
                    OpenCompose();
                    CloseCompose()
                    // GetUnansweredResponsesList()
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
        },
        // Callback on refresh.
        refresh: function ($btn) {

        },
        // Callback on dropdown show.
        refreshOnShow: function ($btn, $dropdown) {
        }
    });
    /* template option */
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
            if(val == "opt1"){
                setOpen(true);
                // editorInstance.html.insert("{" + val + "}");
            }
            if(val == "opt2"){
                setTemOpen(true);
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
    /* end template option */
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
        toolbarButtons: [['Send', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'emoticons', 'insertLink', 'TemplatesOption'], ['Delete', 'moreMisc']],
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
 

    // // Frola Editor Ends    
    // function openModal(e) {
    //     setIsOpen(true);
    // }
    // function closeModal(e) {
    //     setIsOpen(false);
    // }  

    const WrapperRef = useRef(null);
    useOutsideAlerter(WrapperRef);

    return (
        <> 
        
            <Modal  className="modal-lister"
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
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        General settings
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                                        Aliquam eget maximus est, id dignissim quam.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='activetemplate' expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2bh-content"
                                    id="panel2bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                                        varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                                        laoreet.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3bh-content"
                                    id="panel3bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Advanced settings
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                        amet egestas eros, vitae egestas augue. Duis vel est augue.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion> 
                     </div> 

                </div>
                <div className='m-fotter' align="right">  
                    <ButtonGroup variant="text" aria-label="text button group">
                        <Button variant="contained btn btn-orang smallbtn mr-3"> Cancel</Button>
                        <Button variant="contained btn btn-primary smallbtn" > Select</Button>
                    </ButtonGroup>
                </div> 
                </Box>
            </Modal>  

            <Modal  className="modal-lister"
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
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        General settings
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                                        Aliquam eget maximus est, id dignissim quam.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='activetemplate' expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2bh-content"
                                    id="panel2bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                                        varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                                        laoreet.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3bh-content"
                                    id="panel3bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Advanced settings
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                        amet egestas eros, vitae egestas augue. Duis vel est augue.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion> 
                     </div> 

                </div>
                <div className='m-fotter' align="right">  
                    <ButtonGroup variant="text" aria-label="text button group">
                        <Button variant="contained btn btn-orang smallbtn mr-3"> Cancel</Button>
                        <Button variant="contained btn btn-primary smallbtn" > Select</Button>
                    </ButtonGroup>
                </div> 
                </Box>
            </Modal>  
           
        

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