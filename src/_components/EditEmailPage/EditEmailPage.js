import React, { useRef, useEffect } from 'react';
import Axios from "axios";

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Col, Row } from 'react-bootstrap';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import BgProfile from '../../images/bg-profile.png';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';
import MaxboxLoading from '../../images/Maxbox-Loading.svg';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

import { history } from "../../_helpers";
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, EditorVariableNames } from "../../_helpers/Utility";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navigation from '../Navigation/Navigation';
import Usericon from '../../images/icons/users.svg';
import { Link } from 'react-router-dom';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

toast.configure();
var atob = require('atob');


export default function EditEmailPage(props) {
  const [EditEmailConfigurationDetails, SetEditEmailConfigurationDetails] = React.useState([]);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [Refreshtoken, SetRefreshtoken] = React.useState();
  const [IsEmailAuthSucess, SetIsEmailAuthSucess] = React.useState(0);
  const [IsEmailAuthFail, SetIsEmailAuthFail] = React.useState(0);
  const [SignatureError, SetSignatureError] = React.useState("");
  const [Signature, SetSignature] = React.useState("")
  const [TabValue, setTabValue] = React.useState('1');
  const [IsGmail, setIsGmail] = React.useState(true);
  const [DefaultGmailSignature, setDefaultGmailSignature] = React.useState(false);
  const [DefaultMaxboxSignature, setDefaultMaxboxSignature] = React.useState(false);
  const [GmailSignatureUpdate, setGmailSignatureUpdate] = React.useState(false);
  const [MaxboxSignatureUpdate, setMaxboxSignatureUpdate] = React.useState(false);

  var Isworking = false;
  useEffect(() => {
    const ID = props.location.state;
    CheckAccountAuthonicate()
    if (ID != "" && ID != null && ID != "undefined") {
      EditEmailConfiguration(ID)
    }

    GetClientID()
  }, []);

  useEffect(() => {
  }, [ClientID, UserID, Isworking, Refreshtoken, EditEmailConfigurationDetails, Signature, DefaultGmailSignature, DefaultMaxboxSignature, GmailSignatureUpdate, MaxboxSignatureUpdate]);

  const handleChangeTabValue = (event, newValue, data) => {
    setTabValue(newValue);
    if(EditEmailConfigurationDetails?.length > 0){
      data = EditEmailConfigurationDetails;
    }
    else{
      if((EditEmailConfigurationDetails.AccountID != undefined)){
        data = EditEmailConfigurationDetails;
      }
    }

    if(newValue == '1'){
      SetSignature(data.EmailSignature?.length > 0 ?
        data.EmailSignature.find(option => option.IsGmail === true)?.EmailSignature || '' : "")
      setDefaultGmailSignature(data?.EmailSignature?.some(
          option => option.IsGmail === true && option.IsDefault === true) || false)
      setGmailSignatureUpdate(true);
      setMaxboxSignatureUpdate(false);
      setIsGmail(true);
    }
    else{
      SetSignature(data.EmailSignature?.length > 0 ?
        data.EmailSignature.find(option => option.IsGmail === false)?.EmailSignature || '' : "")
      setDefaultMaxboxSignature(data?.EmailSignature?.some(
        option => option.IsGmail === false && option.IsDefault === true) || false)
      setGmailSignatureUpdate(false);
      setMaxboxSignatureUpdate(true);
      setIsGmail(false);
    }
  };

  const HandleGmailChecked = () => {
    var igc = document.getElementById("isgmailchecked").checked ? true : false;
    if(igc){
      setDefaultGmailSignature(true);
      setDefaultMaxboxSignature(false);
    }
    else{
      setDefaultGmailSignature(false);
      setDefaultMaxboxSignature(true);
    }
  };

  const HandleMaxboxChecked = () => {
    var imc = document.getElementById("ismaxboxchecked").checked ? true : false;
    if(imc){
      setDefaultGmailSignature(false);
      setDefaultMaxboxSignature(true);
    }
    else{
      setDefaultGmailSignature(true);
      setDefaultMaxboxSignature(false);
    }
  };

  const CheckAccountAuthonicate = () => {
    var queryparamter = window.location.search.substring(1);
    if (queryparamter != "") {
      var ResultRefreshtoken = atob(queryparamter.split('data=')[1]);
      var Refreshtoken = (ResultRefreshtoken.split("=editpageupdate_")[0])
      var AccountID = (ResultRefreshtoken.split("=editpageupdate_")[1])
      SetRefreshtoken(Refreshtoken);
      Isworking = true;
      if (Refreshtoken != '') {
        SetIsEmailAuthSucess(true)
      }
      else {
        SetIsEmailAuthFail(true)
      }

      EditEmailConfiguration(AccountID)
    }
    LoaderHide()
  }

  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
  }

  // // Get Email List ID
  const EditEmailConfiguration = (ID) => {
    const Data = { ID: ID }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountGetByID",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.Data.IsWorking == false) {
          Result.data.Data.IsWorking = Isworking;
        }
        SetEditEmailConfigurationDetails(Result.data.Data)
        // SetSignature(Result?.data?.Data?.EmailSignature)
        setTimeout(() => {
          handleChangeTabValue('', '1', Result.data.Data);
        }, 1000);
      }
    });
  }

  const Cancle = () => {
    history.push("/EmailConfiguration");
  }

  // // Update Email
  const UpdateEmailConfiguration = () => {
    var FirstName = document.getElementById("firstName").value;
    var LastName = document.getElementById("lastName").value;
    var Email = document.getElementById("email").value;
    let Data = {
      ID: EditEmailConfigurationDetails._id,
      UserID: UserID,
      ClientID: ClientID,
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      NewRefereshToken: Refreshtoken,
      IsWorking: true,
      EmailSignature: Signature,
      IsGmail: IsGmail,
      DefaultGmailSignature: DefaultGmailSignature,
      DefaultMaxboxSignature: DefaultMaxboxSignature,
      IsGmailSignatureUpdate: GmailSignatureUpdate,
      IsMaxboxSignatureUpdate: MaxboxSignatureUpdate
    }
    LoaderShow()
    Axios({
      url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountUpdate",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        LoaderHide()
        toast.success(<div>Email configuration updated successfully.</div>);
        history.push("/EmailConfiguration");
      } else {
        toast.error(Result?.data?.Message);
        LoaderHide()
      }
    })
  }


  // start ReAuthenticate email
  const ReAuthenticate = (data) => {
    var AccountID = data._id;
    var loginHint = data.Email;
    var scope = encodeURIComponent(CommonConstants.SCOPE);
    var redirect_uri_encode = encodeURIComponent(CommonConstants.REDIRECT_URL);
    var client_id = encodeURIComponent(CommonConstants.CLIENT_ID);
    var response_type = "code";
    var access_type = "offline";
    var state = 'editpageupdate_' + AccountID;

    var Url = "https://accounts.google.com/o/oauth2/auth?scope=" + scope + "&redirect_uri=" + redirect_uri_encode + "&response_type=" + response_type + "&client_id=" + client_id + "&state=" + state + "&access_type=" + access_type + "&approval_prompt=force&login_hint=" + loginHint + ""
    window.location.href = Url;
  }
  // end ReAuthenticate email

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
    // SetSignature({
    //   Data: Model
    // });
    SetSignature(Model);
    if (Model != "") {
      SetSignatureError("")
    }
  }
  // Frola Editor Ends

  return (
    <>


      <div className='lefter'>
        {/* <Navigation /> */}
      </div>
      <div id="hideloding" className="loding-display">
        <img src={MaxboxLoading} />
      </div>

      <div className='righter'>

        <div className='px-3'>
          <Row className='bodsetting px-4'>
            <Col className='py-3'>
              <h5 onClick={() => { Cancle() }} className='my-0'><a className='mr-2 iconwhite' ><ArrowBackIcon /></a> Edit email account</h5>
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
          <div className='sm-container mt-5'>

            <Stack sx={{ width: '100%' }} spacing={2}>
              {IsEmailAuthSucess == true ? <Alert severity="success" onClose={() => { SetIsEmailAuthSucess(false) }}>   <strong> Well done!</strong> Authentication of your account is done.</Alert> : ""}
              {IsEmailAuthFail == true ? <Alert severity="error" onClose={() => { SetIsEmailAuthFail(false); }}> <strong>Oops!</strong> Something went wrong while authentication, please try again!</Alert> : ""}
            </Stack>

            <Row>
              <Col>
                <Row>
                  <Col sm={4}>
                    <div className='input-box'>
                      <input type='text' placeholder='First Name' id='firstName' name="firstName" defaultValue={EditEmailConfigurationDetails.FirstName} />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className='input-box'>
                      <input type='text' placeholder='Last Name' id='lastName' name="lastName" defaultValue={EditEmailConfigurationDetails.LastName} />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={8}>
                    <div className='input-box'>
                      <input type='email' placeholder='Email' id='email' defaultValue={EditEmailConfigurationDetails.Email} readonly="readonly" />
                    </div>
                  </Col>
                  <Col sm={4}>
                    {EditEmailConfigurationDetails.IsWorking == false ?
                      <Button className='btnauthenticate mt-4' onClick={() => { ReAuthenticate(EditEmailConfigurationDetails); }} ><img src={LoaderCircle} className="mr-1" ></img> Re Authenticate</Button> : ''}
                  </Col>
                </Row>
                <Row className='input-boxbg mt-5'>
                  <Col sm={4}>
                    <label>Email signature text  :</label>
                  </Col>
                  <Col sm={8}>
                  </Col>
                  {/* <Col sm={12} className="vardroper"><FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={Signature.Data} /></Col> */}
                  <Col sm={12} className="vardroper">
                  <TabContext value={TabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChangeTabValue}>
                        <Tab label="Gmail Signature" value="1" />
                        <Tab label="Maxbox Signature" value="2" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id="isgmailchecked"
                              checked={DefaultGmailSignature}
                              onChange={(event) => HandleGmailChecked(event, '1')}
                            />
                          }
                          label="Use as Default Signature"
                        />
                      </FormGroup>
                      <FroalaEditor
                        tag='textarea'
                        id="signature1"
                        config={config}
                        onModelChange={HandleModelChange}
                        model={
                          Signature || ""
                        }
                      />
                    </TabPanel>
                    <TabPanel value="2">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                            id="ismaxboxchecked"
                              checked={DefaultMaxboxSignature}
                              onChange={(event) => HandleMaxboxChecked(event, '2')}
                            />
                          }
                          label="Use as Default Signature"
                        />
                      </FormGroup>
                      <FroalaEditor 
                        tag='textarea' 
                        id="signature2" 
                        config={config} 
                        onModelChange={HandleModelChange} 
                        model={
                          Signature || ""
                        }
                      />
                    </TabPanel>
                  </TabContext>
                  </Col>
                  {SignatureError && <p style={{ color: "red" }}>{SignatureError}</p>}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='btnprofile my-5 left'>
                  <ButtonGroup variant="text" aria-label="text button group">
                    <Button variant="contained btn btn-primary smallbtn mx-4 ml-0" onClick={() => { UpdateEmailConfiguration() }}> Save</Button>
                    <Button variant="contained btn btn-orang smallbtn" onClick={() => { Cancle() }}> Cancel</Button>
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