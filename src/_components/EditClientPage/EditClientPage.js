import React, { useState, useEffect } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, EditorVariableNames, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import { history } from "../../_helpers";
import BgProfile from '../../images/bg-profile.png';
import { Col, Row } from 'react-bootstrap';

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';
import { toast } from 'react-toastify';
import MaxboxLoading from '../../images/Maxbox-Loading.svg';

import Navigation from '../Navigation/Navigation';
import Usericon from '../../images/icons/users.svg';
import { Link } from 'react-router-dom';

export default function EditClientPage(props) {
    const [ClientNameError, SetClientNameError] = useState("");
    const [SignatureError, SetSignatureError] = useState("");
    const [BCCEmailError, SetBCCEmailError] = useState("");
    const [ClientID, SetClientID] = React.useState(0);
    const [ClientIDDetails, SetClientIDDetails] = useState([])
    const [UserID, SetUserID] = React.useState(0);
    const [Signature, SetSignature] = useState({
        Data: ""
    })

    useEffect(() => {
        const ID = props.location.state;
        if (ID != "" && ID != null && ID != "undefined") {
            GetClientByID(ID)
        }
        GetClientID()
    }, [])

    useEffect(() => {
        document.title = 'Edit Client | MAXBOX';
    }, [ClientID, UserID]);

    // Get Client ID
    const GetClientID = () => {
        var UserDetails = GetUserDetails();
        if (UserDetails != null) {
            SetClientID(UserDetails.ClientID);
            SetUserID(UserDetails.UserID);
        }
    }

    // Get CLient By ID
    const GetClientByID = (ID) => {
        const Data = {
            ID: ID
        }
        Axios({
            url: CommonConstants.MOL_APIURL + "/client/ClientGetByID",
            method: "POST",
            data: Data,
        }).then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                SetClientIDDetails(Result?.data?.Data)
                SetSignature({ Data: Result?.data?.Data[0]?.SignatureText })
                LoaderHide()
            } else {
                toast.error(Result?.data?.Message);
            }
        })
    }

    // Frola Editor Starts
    Froalaeditor.RegisterCommand('Variable', {
        title: 'Variable',
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
        toolbarButtons: ['bold', 'italic', 'underline', 'insertLink', 'insertImage', 'html', 'Variable'],
        imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
        imageUploadRemoteUrls: false,
        key: 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4=='
    }
    const HandleModelChange = (Model) => {
        SetSignature({
            Data: Model
        });
        if (Model != "") {
            SetSignatureError("")
        }
    }
    // Frola Editor Ends

    // Check Client Exists
    const CheckExistClient = async (ClientName) => {

        var Data = { Name: ClientName, ClientID: ClientIDDetails[0].ClientID, UserID: UserID }

        const ResponseApi = await Axios({
            url: CommonConstants.MOL_APIURL + "/client/ClientExists",
            method: "POST",
            data: Data,
        })
        return ResponseApi?.data.StatusMessage
    }

    // FromValidation Start
    const FromValidation = () => {
        var Isvalid = true;
        var ClientName = document.getElementById("name").value;

        if (ClientName === "") {
            SetClientNameError("Please enter client name")
            Isvalid = false
        }

        if (Signature.Data === "") {
            SetSignatureError("Please enter signature body")
            Isvalid = false
        }
        return Isvalid;
    };

    const HandleChange = (e) => {
        const { name, value } = e.target;
        if (name == "bccEmail") {
            if (value != "") {
                validateEmail(value)
            }
        }
        if (name == "name") {
            if (value != "") {
                SetClientNameError("")
            }
        }
    };
    // FromValidation End

    const validateEmail = (email) => {
        if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            SetBCCEmailError("Invalid email")
            return false;
        }
        else {
            SetBCCEmailError("")
        }
        return true;
    };

    // Client Update
    const UpdateClient = async () => {
        const Valid = FromValidation();
        if (Valid) {

            var ClientName = document.getElementById("name").value;
            var BccEmail = document.getElementById("bccEmail").value;

            let ValidEmail

            if (BccEmail != "") {
                ValidEmail = validateEmail(BccEmail);
            }

            if (BccEmail === "" || ValidEmail) {
                LoaderShow()
                const Data = {
                    ID: ClientIDDetails[0]._id,
                    Name: ClientName,
                    BccEmail: BccEmail,
                    SignatureText: Signature.Data,
                }

                var ExistsClient = await CheckExistClient(ClientName)

                if (ExistsClient === ResponseMessage.SUCCESS) {
                    Axios({
                        url: CommonConstants.MOL_APIURL + "/client/ClientUpdate",
                        method: "POST",
                        data: Data,
                    }).then((Result) => {
                        if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                            toast.success(<div>Client updated successfully.</div>);
                            LoaderHide()
                            history.push("/ClientList");
                        } else {
                            toast.error(Result?.data?.Message);
                            LoaderHide()
                        }
                    })
                } else {
                    SetClientNameError("Client name already exists, please add another name")
                    LoaderHide()
                }
            }
        }

    }

    // Cancel Edit Client
    const CancelEditCLient = () => {
        history.push("/ClientList");
    }

    return (
        <>

            <div id="hideloding" className="loding-display">
                <img src={MaxboxLoading} />
            </div>


            <div className='lefter'>
                {/* <Navigation /> */}
            </div>
            <div className='righter'>
                <div className='px-3'>
                    <Row className='bodsetting px-4'>
                        <Col className='py-3'>
                            <h5 onClick={CancelEditCLient} className='my-0'><a className='mr-2 iconwhite'><ArrowBackIcon /></a> Edit Client</h5>
                        </Col>
                        <Col>
                            <Link to="/ProfileSetting">
                                <div className='profilebox'>
                                    <img src={Usericon} />
                                </div>
                            </Link>
                        </Col>
                    </Row>
                </div>


                <div className='container'>
                    <div className='sm-container'>
                        <Row>
                            <Col>
                                <Row className='input-boxbg mt-5'>
                                    <Col sm={4}>
                                        <label>Name  :</label>
                                    </Col>
                                    <Col sm={8}>
                                    </Col>
                                    <Col sm={8}>
                                        <input type='text' placeholder='Enter Client Name' name='name' id='name' onChange={HandleChange} defaultValue={ClientIDDetails[0]?.Name} />
                                        {ClientNameError && <p style={{ color: "red" }}>{ClientNameError}</p>}
                                    </Col>
                                </Row>
                                <Row className='input-boxbg mt-5'>
                                    <Col sm={2}>
                                        <label>BCC email  :</label>
                                    </Col>
                                    <Col sm={8}>
                                    </Col>
                                    <Col sm={8}>
                                        <input type='text' placeholder='Enter BCC email' name='bccEmail' id='bccEmail' onChange={HandleChange} defaultValue={ClientIDDetails[0]?.BccEmail} />
                                        {BCCEmailError && <p style={{ color: "red" }}>{BCCEmailError}</p>}
                                    </Col>
                                </Row>
                                <Row className='input-boxbg mt-5'>
                                    <Col sm={4}>
                                        <label>Email signature text  :</label>
                                    </Col>
                                    <Col sm={8}>
                                    </Col>
                                    <Col sm={12} className="vardroper"><FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={Signature.Data} /></Col>
                                    {SignatureError && <p style={{ color: "red" }}>{SignatureError}</p>}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='btnprofile my-5 left'>
                                    <ButtonGroup variant="text" aria-label="text button group">
                                        <Button variant="contained btn btn-primary smallbtn mx-4 ml-0" onClick={UpdateClient} > Save</Button>
                                        <Button variant="contained btn btn-orang smallbtn" onClick={CancelEditCLient}> Cancel</Button>
                                    </ButtonGroup>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

        </>
    );
}