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

export default function EditTemplatesPage(props) {

    const [ClientID, SetClientID] = React.useState(0);
    const [TemplateIDDetails, SetTemplateIDDetails] = useState([])
    const [UserID, SetUserID] = React.useState(0);
    const [Body, SetBody] = useState({
        Data: ""
    })

    useEffect(() => {
        const ID = props.location.state;
        if (ID != "" && ID != null && ID != "undefined") {
            GetTemplateByID(ID)
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

    // Get Template By ID
    const GetTemplateByID = (ID) => {
        const Data = {
            ID: ID
        }
        Axios({
            url: CommonConstants.MOL_APIURL + "/templates/TemplateGetByID",
            method: "POST",
            data: Data,
        }).then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                SetTemplateIDDetails(Result?.data?.Data)
                SetBody({ Data: Result?.data?.Data[0]?.BodyText })
            }
        })
    }

    // Frola Editor Starts
    // Froalaeditor.RegisterCommand('Variable', {
    //     title: 'Variable',
    //     type: 'dropdown',
    //     focus: false,
    //     undo: false,
    //     refreshAfterCallback: true,
    //     // options: EditorVariableNames(),
    //     callback: function (cmd, val) {
    //         var editorInstance = this;
    //         editorInstance.html.insert("{" + val + "}");
    //     },
    //     // Callback on refresh.
    //     refresh: function ($btn) {
    //         console.log('do refresh');
    //     },
    //     // Callback on dropdown show.
    //     refreshOnShow: function ($btn, $dropdown) {
    //         console.log('do refresh when show');
    //     }

    // });

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

    // Template Update
    const UpdateTemplate = () => {
        var Subject = document.getElementById("subject").value;
        const Data = {
            ID: TemplateIDDetails[0]._id,
            Subject: Subject,
            BodyText: Body.Data,
            LastUpdatedBy: 1
        }

        Axios({
            url: CommonConstants.MOL_APIURL + "/templates/TemplateUpdate",
            method: "POST",
            data: Data,
        }).then((Result) => {
            history.push("/Templates");
        })
    }

    // Cancel Edit Template
    const CancelEditTemplate = () => {
        history.push("/Templates");
    }

    return (
        <>
           
            <div className='bodymain'>
                <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
                    <Col className='py-4'>
                        <h5 className='my-0'><a href='' className='mr-2 iconwhite'><ArrowBackIcon /></a> Edit Template</h5>
                    </Col>
                </Row>
                <div className='sm-container mt-5'>
                    <Row>
                        <Col>
                            <Row className='input-boxbg mt-5'>
                                <Col sm={4}>
                                    <label>Subject  :</label>
                                </Col>
                                <Col sm={8}>
                                </Col>
                                <Col sm={8}>
                                    <input type='text' placeholder='Enter Subject' name='subject' id='subject' defaultValue={TemplateIDDetails[0]?.Subject} />
                                </Col>
                            </Row>
                           
                            <Row className='input-boxbg mt-5'>
                                <Col sm={4}>
                                    <label>Body  :</label>
                                </Col>
                                <Col sm={8}>
                                </Col>
                                <Col sm={12}><FroalaEditor tag='textarea' id="body" config={config} onModelChange={HandleModelChange} model={Body.Data} /></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className='btnprofile my-5 left'>
                                <ButtonGroup variant="text" aria-label="text button group">
                                    <Button variant="contained btn btn-primary smallbtn mx-4 ml-0" onClick={UpdateTemplate} > Save</Button>
                                    <Button variant="contained btn btn-orang smallbtn" onClick={CancelEditTemplate}> Cancel</Button>
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
           
        </>
    );
}