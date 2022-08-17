import React, { useState, useEffect } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails } from "../../_helpers/Utility";
import { history } from "../../_helpers";
import BgProfile from '../../images/bg-profile.png';
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import FooterBottom from '../Footer/footer';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.css'; 
import 'froala-editor/js/plugins.pkgd.min.js';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg'; 

export default function AddClientPage({ children }) {

  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [Signature, SetSignature] = useState({
    Data: ""
  })

  useEffect(() => {
    GetClientID()
  }, [ClientID])

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
  }

   // Frola Editor Starts
   Froalaeditor.RegisterCommand('Variable', {
    title: 'Variable',
    type: 'dropdown',
    focus: false,
    undo: false,
    refreshAfterCallback: true,
    options: {
      'v1': 'Option 1',
      'v2': 'Option 2'
    },
    callback: function (cmd, val) {
      console.log (val);
    },
    // Callback on refresh.
    refresh: function ($btn) {
      console.log ('do refresh');
    },
    // Callback on dropdown show.
    refreshOnShow: function ($btn, $dropdown) {
      console.log ('do refresh when show');
    }
  });

  // Frola Editor Starts
  // let Config = {
  //   placeholderText: 'Edit Your Content Here!',
  //   charCounterCount: false,
  //   toolbarButtons: ['bold', 'italic', 'underline', 'insertLink', 'insertImage', 'html', 'Variable'],
  //   shortcutsEnabled: ["insertTemplateButton"],
  // }
  const config={
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false, 
    toolbarButtons: ['bold', 'italic', 'underline', 'insertLink', 'insertImage', 'html' ,'Variable'],
}
  const HandleModelChange = (Model) => {
    SetSignature({
      Data: Model
    });
  }
  // Frola Editor Ends

  // Check Client Exists
  const CheckExistClient = async (ClientName) => {

    var Data = { Name: ClientName }

    const ResponseApi = await Axios({
      url: CommonConstants.MOL_APIURL + "/client/ClientExists",
      method: "POST",
      data: Data,
    })
    return ResponseApi?.data.StatusMessage
  }

  // Add Client
  const AddClient = async () => {
    var ClientName = document.getElementById("name").value;
    var BccEmail = document.getElementById("bccEmail").value;

    const Data = {
      Name: ClientName,
      BccEmail: BccEmail,
      SignatureText: Signature.Data,
      UserID: UserID
    }

    var ExistsClient = await CheckExistClient(ClientName)

    if (ClientName != "" && ClientName != null && ClientName != "undefined") {
      if (ExistsClient === ResponseMessage.SUCCESS) {
        Axios({
          url: CommonConstants.MOL_APIURL + "/client/ClientAdd",
          method: "POST",
          data: Data,
        }).then((Result) => {
          if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
            history.push("/ClientList");
          }
        })
      } else {
        console.log("ClientName Already Exists, Please Add Another Name")
      }
    } else {
      console.log("Client Name should not be blank!")
    }

  }

  return (
    <>
      <HeaderTop />
      <div className='bodymain'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='py-4'>
            <h5 className='my-0'><a href='' className='mr-2 iconwhite'><ArrowBackIcon /></a> Add Client</h5>
          </Col>
        </Row>

        <div className='sm-container mt-5'>
          <Row>
            <Col>
              <Row className='input-boxbg mt-5'>
                <Col sm={4}>
                  <label>Name  :</label>
                </Col>
                <Col sm={8}>
                </Col>
                <Col sm={8}>
                  <input type='text' placeholder='Enter Client Name' name='name' id='name' />
                </Col>
              </Row>
              <Row className='input-boxbg mt-5'>
                <Col sm={2}>
                  <label>BCC Email  :</label>
                </Col>
                <Col sm={8}>
                </Col>
                <Col sm={8}>
                  <input type='text' placeholder='Enter BCC EMail' name='bccEmail' id='bccEmail' />
                </Col>
              </Row>
              <Row className='input-boxbg mt-5'>
                <Col sm={4}>
                  <label>Email Signature Text  :</label>
                </Col>
                <Col sm={8}>
                </Col>
                <Col sm={12}>
                  <FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={Signature.Data} />
                  {/* <FroalaEditor config={config} /> */}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className='btnprofile my-5 left'>
                <ButtonGroup variant="text" aria-label="text button group">
                  <Button variant="contained btn btn-primary smallbtn mx-4 ml-0" onClick={AddClient} > Save</Button>
                  <Button variant="contained btn btn-orang smallbtn"> Cancel</Button>
                </ButtonGroup>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <FooterBottom />
    </>
  );
}