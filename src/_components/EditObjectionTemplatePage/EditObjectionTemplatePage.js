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

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaxboxLoading from '../../images/Maxbox-Loading.svg';

import Navigation from '../Navigation/Navigation';
import Usericon from '../../images/icons/users.svg';
import { Link } from 'react-router-dom';

toast.configure();

export default function EditObjectionTemplatePage(props) {

    const [ClientID, SetClientID] = React.useState(0);
    const [SubjectError, SetSubjectError] = useState("");
    const [SignatureError, SetSignatureError] = useState("");
    const [ObjectionTemplateIDDetails, SetObjectionTemplateIDDetails] = useState([])
    const [UserID, SetUserID] = React.useState(0);
    const [Body, SetBody] = useState({
        Data: ""
    })

    useEffect(() => {
        document.title = 'Edit Objection Template | MAXBOX';
        const ID = props.location.state;
        if (ID != "" && ID != null && ID != "undefined") {
            GetObjectionTemplateByID(ID)
        }
        GetClientID()
    }, [])

    useEffect(() => {

    }, [ClientID, UserID]);

    // Get Client ID
    const GetClientID = () => {
        var UserDetails = GetUserDetails();
        if (UserDetails != null) {
            SetClientID(UserDetails.ClientID);
            SetUserID(UserDetails.UserID);
        }
    }

    const HandleChange = (e) => {
        const { name, value } = e.target;
        if (name == "subject") {
            if (value != "") {
                SetSubjectError("")
            }
        }
    };
    // Get Objection Template By ID
    const GetObjectionTemplateByID = (ID) => {
        const Data = {
            ID: ID
        }
        Axios({
            url: CommonConstants.MOL_APIURL + "/objection_template/ObjectionTemplateGetByID",
            method: "POST",
            data: Data,
        }).then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                SetObjectionTemplateIDDetails(Result?.data?.Data)
                SetBody({ Data: Result?.data?.Data[0]?.BodyText })
                LoaderHide()
            } else {
                toast.error(Result?.data?.Message);
            }
        })
    }



    const config = {
        quickInsertEnabled: false,
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false,
        toolbarButtons: ['bold', 'italic', 'underline', 'insertLink', 'insertImage', 'html'],
        imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
        key : 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4=='
    }
    const HandleModelChange = (Model) => {
        SetBody({
            Data: Model
        });
        if (Model != "") {
            SetSignatureError("")
        }
    }
    // Frola Editor Ends

    // Objection Template Update
    const UpdateObjectionTemplate = async () => {
        var Subject = document.getElementById("subject").value;
        const Valid = FromValidation();
        if (Valid) {
            LoaderShow()
            const Data = {
                ID: ObjectionTemplateIDDetails[0]._id,
                Subject: Subject,
                BodyText: Body.Data,
                LastUpdatedBy: 1
            }

            var ExistsTemplates = await CheckExistObjectionTemplate(Subject);

            if (ExistsTemplates === ResponseMessage.SUCCESS) {
                Axios({
                    url: CommonConstants.MOL_APIURL + "/objection_template/ObjectionTemplateUpdate",
                    method: "POST",
                    data: Data,
                }).then((Result) => {
                    if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                        toast.success(<div>Objection template updated successfully.</div>);
                        LoaderHide()
                        history.push("/ObjectionTemplate");
                    } else {
                        toast.error(Result?.data?.Message);
                        LoaderHide()
                    }
                })
            }
            else {
                SetSubjectError("Subject Already Exists, Please Add Another Subject")
                LoaderHide()
            }
        }
    }

    // Check Objection Template Exists
    const CheckExistObjectionTemplate = async (Subject) => {

        var Data = { Subject: Subject, ClientID: ClientID, ObjectionTemplateID: ObjectionTemplateIDDetails[0].ObjectionTemplateID }

        const ResponseApi = await Axios({
            url: CommonConstants.MOL_APIURL + "/objection_template/ObjectionTemplateExists",
            method: "POST",
            data: Data,
        })
        return ResponseApi?.data.StatusMessage
    }

    // Cancel Edit Objection Template
    const CancelEditObjectionTemplate = () => {
        history.push("/ObjectionTemplate");
    }

    // FromValidation Start
    const FromValidation = () => {
        var Isvalid = true;
        var Subject = document.getElementById("subject").value;

        if (Subject === "") {
            SetSubjectError("Please Enter Subject")
            Isvalid = false
        }

        if (Body.Data === "") {
            SetSignatureError("Please Enter Body")
            Isvalid = false
        }

        return Isvalid;
    };

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
                            <h5 onClick={CancelEditObjectionTemplate} className='my-0'><a className='mr-2 iconwhite'><ArrowBackIcon /></a> Edit Objection Template</h5>
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
                                    <Col sm={2}>
                                        <label>Subject  :</label>
                                    </Col>

                                    <Col sm={8}>
                                        <input type='text' placeholder='Enter Subject' name='subject' id='subject' onChange={HandleChange} defaultValue={ObjectionTemplateIDDetails[0]?.Subject} />
                                        {SubjectError && <p style={{ color: "red" }}>{SubjectError}</p>}
                                    </Col>
                                </Row>

                                <Row className='input-boxbg'>
                                    <Col sm={2}>
                                        <label>Body  :</label>
                                    </Col>

                                    <Col sm={8}>
                                        <FroalaEditor tag='textarea' id="body" config={config} onModelChange={HandleModelChange} model={Body.Data} /></Col>
                                    {SignatureError && <p style={{ color: "red" }}>{SignatureError}</p>}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                            </Col>
                            <Col>
                                <div className='btnprofile my-5 left'>
                                    <ButtonGroup variant="text" aria-label="text button group">
                                        <Button variant="contained btn btn-primary smallbtn mx-4 ml-0" onClick={UpdateObjectionTemplate} > Save</Button>
                                        <Button variant="contained btn btn-orang smallbtn" onClick={CancelEditObjectionTemplate}> Cancel</Button>
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