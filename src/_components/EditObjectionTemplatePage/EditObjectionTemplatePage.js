import React, { useState, useEffect } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, EditorVariableNames } from "../../_helpers/Utility";
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

toast.configure();

export default function EditObjectionTemplatePage(props) {

    const [ClientID, SetClientID] = React.useState(0);
    const [SubjectError, SetSubjectError] = useState("");
    const [ObjectionTemplateIDDetails, SetObjectionTemplateIDDetails] = useState([])
    const [UserID, SetUserID] = React.useState(0);
    const [Body, SetBody] = useState({
        Data: ""
    })

    useEffect(() => {
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
            }
        })
    }



    const config = {
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false,
        toolbarButtons: ['bold', 'italic', 'underline', 'insertLink', 'insertImage', 'html'],
    }
    const HandleModelChange = (Model) => {
        SetBody({
            Data: Model
        });
    }
    // Frola Editor Ends

    // Objection Template Update
    const UpdateObjectionTemplate = async () => {
        var Subject = document.getElementById("subject").value;
        const Valid = FromValidation();
        if (Valid) {
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
                    toast.success(<div>Object Template <br />Object template updated successfully.</div>);
                    history.push("/ObjectionTemplate");
                })
            }
            else {
                SetSubjectError("Subject Already Exists, Please Add Another Subject")
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
        return Isvalid;
    };

    return (
        <>

            <div className='bodymain'>
                <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
                    <Col className='py-4'>
                        <h5 className='my-0'><a href='/ObjectionTemplate' className='mr-2 iconwhite'><ArrowBackIcon /></a> Edit Objection Template</h5>
                    </Col>
                </Row>
                <div className='sm-container mt-5'>
                    <Row>
                        <Col>
                            <Row className='input-boxbg mt-5'>
                                <Col sm={2}>
                                    <label>Subject  :</label>
                                </Col>

                                <Col sm={8}>
                                    <input type='text' placeholder='Enter Subject' name='subject' id='subject' defaultValue={ObjectionTemplateIDDetails[0]?.Subject} />
                                    {SubjectError && <p style={{ color: "red" }}>{SubjectError}</p>}
                                </Col>
                            </Row>

                            <Row className='input-boxbg mt-5'>
                                <Col sm={2}>
                                    <label>Body  :</label>
                                </Col>

                                <Col sm={8}><FroalaEditor tag='textarea' id="body" config={config} onModelChange={HandleModelChange} model={Body.Data} /></Col>
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

        </>
    );
}