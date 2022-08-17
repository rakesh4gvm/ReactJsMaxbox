import React, { useState, useEffect } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { CommonConstants } from "../../_constants/common.constants";
import { GetUserDetails } from "../../_helpers/Utility";
import BgProfile from '../../images/bg-profile.png';
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import FooterBottom from '../Footer/footer';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

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
  let Config = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: ['bold', 'italic', 'underline', 'insertLink', 'insertImage', 'html', 'Variable'],
    shortcutsEnabled: ["insertTemplateButton"],
  }
  const HandleModelChange = (Model) => {
    SetSignature({
      Data: Model
    });
  }
  // Frola Editor Ends

  // Add Client
  const AddClient = () => {
    var ClientName = document.getElementById("name").value;
    var BccEmail = document.getElementById("bccEmail").value;

    const Data = {
      Name: ClientName,
      BccEmail: BccEmail,
      SignatureText: Signature.Data,
      UserID: UserID
    }

    Axios({
      url: CommonConstants.MOL_APIURL + "/client/ClientAdd",
      method: "POST",
      data: Data,
    }).then((Result) => {
    })
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
                <Col sm={12}><FroalaEditor tag='textarea' id="signature" config={Config} onModelChange={HandleModelChange} model={Signature.Data} /></Col>
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