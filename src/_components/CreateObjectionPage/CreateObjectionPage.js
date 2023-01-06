import React, { useState, useEffect } from 'react';
import Axios from "axios";
import ReactDOM from 'react-dom';
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import FooterBottom from '../Footer/footer';
import Select from 'react-select'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import BgProfile from '../../images/bg-profile.png';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, EditorVariableNames, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import { history } from "../../_helpers";

import inboximg2 from '../../images/inboximg2.jpg';
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaxboxLoading from '../../images/Maxbox-Loading.svg';

import Navigation from '../Navigation/Navigation';

toast.configure();



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

const options = [
  { value: 'v1', label: 'Country' },
  { value: 'v2', label: 'Country 1' },
  { value: 'v3', label: 'Country 2' }
]


export default function CreateObjectionTemplatePage({ children }) {
  const [selected, setSelected] = React.useState(false);
  const [SubjectError, SetSubjectError] = useState("");
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [SignatureError, SetSignatureError] = useState("");
  const addShowCompose = () => {
    const element = document.getElementById("UserCompose")
    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }
  };
  const [open, setOpen] = React.useState(false);
  const [openone, setOpenone] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenOne = () => setOpenone(true);
  const handleCloseOne = () => setOpenone(false);

  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const [Body, SetBody] = useState({
    Data: ""
  })

  const HandleModelChange = (Model) => {
    SetBody({
      Data: Model
    });
    if (Model != "") {
      SetSignatureError("")
    }
  }

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    document.title = 'Create Objection Template | MAXBOX';
    GetClientID()
    LoaderHide()
  }, [ClientID])

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
  }


  //set editor buttons (config)
  const config = {
    quickInsertEnabled: false,
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: ['bold', 'italic', 'underline', 'insertLink', 'insertImage', 'html', 'Variable'],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
    key : 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4=='
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

  const HandleChange = (e) => {
    const { name, value } = e.target;
    if (name == "subject") {
      if (value != "") {
        SetSubjectError("")
      }
    }
  };
  // FromValidation End

  // Add Client
  const AddObjectionTemplate = async () => {

    const Valid = FromValidation();
    if (Valid) {

      var Subject = document.getElementById("subject").value;
      LoaderShow()
      const Data = {
        Subject: Subject,
        BodyText: Body.Data,
        UserID: UserID,
        ClientID: ClientID,
        CreatedBy: 1
      }

      var ExistsObjectionTemplate = await CheckExistObjectionTemplate(Subject)

      if (ExistsObjectionTemplate === ResponseMessage.SUCCESS) {
        Axios({
          url: CommonConstants.MOL_APIURL + "/objection_template/ObjectionTemplateAdd",
          method: "POST",
          data: Data,
        }).then((Result) => {
          if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
            toast.success(<div>Objection template added successfully.</div>);
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

  // Cancel Add Objection Template
  const CancelAddObjectionTemplate = () => {
    history.push("/ObjectionTemplate");
  }

  // Check Template Exists
  const CheckExistObjectionTemplate = async (Subject) => {
    var Data = { Subject: Subject, ClientID: ClientID }

    const ResponseApi = await Axios({
      url: CommonConstants.MOL_APIURL + "/objection_template/ObjectionTemplateExists",
      method: "POST",
      data: Data,
    })
    return ResponseApi?.data.StatusMessage
  }

  return (
    <>

      <div className='lefter'>
        <Navigation />
      </div>
      <div className='righter'>


        <div id="hideloding" className="loding-display">
          <img src={MaxboxLoading} />
        </div>

        <div className='px-3'>
          <Row className='bodsetting px-4'>
            <Col className='py-3'>
              <h5 onClick={CancelAddObjectionTemplate} className='my-0'><a className='mr-2 iconwhite'><ArrowBackIcon /></a> Create Objection Template</h5>
            </Col>
          </Row>
        </div>

        <div className='container'>

          <div className='sm-container mt-5'>
            <Row>
              <Col>
                <Row className='input-boxbg'>
                  <Col sm={2}>
                    <label>Subject  :</label>
                  </Col>
                  <Col sm={8}>
                    <input type='text' placeholder='Subject ' name='subject' id='subject' onChange={HandleChange} />
                    {SubjectError && <p style={{ color: "red" }}>{SubjectError}</p>}
                  </Col>
                </Row>
                <Row className='input-boxbg'>
                  <Col sm={2}>
                    <label>Body  :</label>
                  </Col>
                  <Col sm={8}>
                    <FroalaEditor tag='textarea' id="body" config={config} onModelChange={HandleModelChange} model={Body.Data} />
                    {SignatureError && <p style={{ color: "red" }}>{SignatureError}</p>}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col sm={2}>
              </Col>
              <Col>
                <div className='btnprofile my-5 left'>
                  <ButtonGroup variant="text" aria-label="text button group">
                    {/* <Button variant="contained btn btn-primary smallbtn"> Edit</Button> */}
                    <Button variant="contained btn btn-primary smallbtn mx-4 ml-0" onClick={AddObjectionTemplate}> Save</Button>
                    <Button variant="contained btn btn-orang smallbtn" onClick={CancelAddObjectionTemplate}> Cancel</Button>
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