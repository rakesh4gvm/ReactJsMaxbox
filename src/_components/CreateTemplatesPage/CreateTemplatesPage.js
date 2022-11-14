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
import MaxboxLoading from '../../images/Maxbox-Loading.gif';


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


export default function CreateTemplatesPage({ children }) {
  const [selected, setSelected] = React.useState(false);
  const [SubjectError, SetSubjectError] = useState("");
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
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
  }

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    document.title = 'Create Template | MAXBOX';
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

  const HandleChange = (e) => {
    const { subject, value } = e.target;
    if (subject == "subject") {
      if (value != "") {
        SetSubjectError("")
      }
    }
  };
  // FromValidation End

  // Add Client
  const AddTemplate = async () => {

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
      var ExistsTemplates = await CheckExistTemplates(Subject)

      if (ExistsTemplates === ResponseMessage.SUCCESS) {
        Axios({
          url: CommonConstants.MOL_APIURL + "/templates/TemplateAdd",
          method: "POST",
          data: Data,
        }).then((Result) => {
          if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
            toast.success(<div>Template <br />Template added successfully.</div>);
            LoaderHide()
            history.push("/Templates");
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

  // Cancel Add Client
  const CancelAddTemplate = () => {
    history.push("/Templates");
  }

  // Check Template Exists
  const CheckExistTemplates = async (Subject) => {

    var Data = { Subject: Subject, ClientID: ClientID }

    const ResponseApi = await Axios({
      url: CommonConstants.MOL_APIURL + "/templates/TemplateExists",
      method: "POST",
      data: Data,
    })
    return ResponseApi?.data.StatusMessage
  }

  return (
    <>
      <HeaderTop />

      <div id="hideloding" className="loding-display">
        <img src={MaxboxLoading} />
      </div>

      <div className='bodymain min-100vh'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='py-4'>
            <h5 onClick={CancelAddTemplate} className='my-0'><a className='mr-2 iconwhite'><ArrowBackIcon /></a> Create Templates</h5>
          </Col>
        </Row>


        <div className='sm-container mt-5'>
          <Row>
            <Col>
              <Row className='input-boxbg'>
                <Col sm={2}>
                  <label>Subject  :</label>
                </Col>
                <Col sm={8}>
                  <input type='text' placeholder='Subject ' name='subject' id='subject' />
                  {SubjectError && <p style={{ color: "red" }}>{SubjectError}</p>}
                </Col>
              </Row>
              <Row className='input-boxbg'>
                <Col sm={2}>
                  <label>Body  :</label>
                </Col>
                <Col sm={8}>
                  {/* <FroalaEditor tag='textarea'/> */}
                  <FroalaEditor tag='textarea' id="body" config={config} onModelChange={HandleModelChange} model={Body.Data} />
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
                  <Button variant="contained btn btn-primary smallbtn mx-4 ml-0" onClick={AddTemplate}> Save</Button>
                  <Button variant="contained btn btn-orang smallbtn" onClick={CancelAddTemplate}> Cancel</Button>
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