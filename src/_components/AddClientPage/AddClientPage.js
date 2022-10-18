import React, { useState, useEffect } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, EditorVariableNames, ValidateEmail } from "../../_helpers/Utility";
import { history } from "../../_helpers";
import BgProfile from '../../images/bg-profile.png';
import { Col, Row } from 'react-bootstrap';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const Style = {
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

export default function AddClientPage({ children }) {
  const [ClientNameError, SetClientNameError] = useState("");
  const [BCCEmailError, SetBCCEmailError] = useState("");
  const [SignatureError, SetSignatureError] = useState("");
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [Signature, SetSignature] = useState({
    Data: ""
  })

  useEffect(() => {
    document.title = 'Add Client | MAXBOX';
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
    toolbarButtons: ['bold', 'italic', 'underline', 'insertLink', 'insertImage', 'html', 'Variable'],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
    imageUploadRemoteUrls: false
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

    var Data = { Name: ClientName }

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
      SetClientNameError("Please Enter Client Name")
      Isvalid = false
    }

    if (Signature.Data === "") {
      SetSignatureError("Please Enter Signature Body")
      Isvalid = false
    }

    return Isvalid;
  };

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

  // Add Client
  const AddClient = async () => {

    const Valid = FromValidation();

    if (Valid) {

      var ClientName = document.getElementById("name").value;
      var BccEmail = document.getElementById("bccEmail").value;

      let ValidEmail

      if (BccEmail != "") {
        ValidEmail = validateEmail(BccEmail);
      }

      if (BccEmail === "" || ValidEmail) {

        const Data = {
          Name: ClientName,
          BccEmail: BccEmail,
          SignatureText: Signature.Data,
          UserID: UserID
        }

        var ExistsClient = await CheckExistClient(ClientName)

        if (ExistsClient === ResponseMessage.SUCCESS) {
          Axios({
            url: CommonConstants.MOL_APIURL + "/client/ClientAdd",
            method: "POST",
            data: Data,
          }).then((Result) => {
            if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
              toast.success(<div>Client <br />Client added successfully.</div>);
              history.push("/ClientList");
            } else {
              toast.error(Result?.data?.Message);
            }
          })
        }
        else {
          SetClientNameError("ClientName Already Exists, Please Add Another Name")
        }
      }
    }
  }

  // Cancel Add Client
  const CancelAddCLient = () => {
    history.push("/ClientList");
  }

  return (
    <>

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
                  <input type='text' placeholder='Enter Client Name' name='name' id='name' onChange={HandleChange} />
                  {ClientNameError && <p style={{ color: "red" }}>{ClientNameError}</p>}
                </Col>
              </Row>
              <Row className='input-boxbg mt-5'>
                <Col sm={2}>
                  <label>BCC Email  :</label>
                </Col>
                <Col sm={8}>
                </Col>
                <Col sm={8}>
                  <input type='text' placeholder='Enter BCC EMail' name='bccEmail' id='bccEmail' onChange={HandleChange} />
                  {BCCEmailError && <p style={{ color: "red" }}>{BCCEmailError}</p>}
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
                  {SignatureError && <p style={{ color: "red" }}>{SignatureError}</p>}
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
                  <Button variant="contained btn btn-orang smallbtn" onClick={CancelAddCLient}> Cancel</Button>
                </ButtonGroup>
              </div>
            </Col>
          </Row>
        </div>
      </div>

    </>
  );
}