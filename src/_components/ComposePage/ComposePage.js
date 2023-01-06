import React, { useState, useEffect, useRef } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails } from "../../_helpers/Utility";

import { Col, Row } from 'react-bootstrap';
import Close from '../../images/icons/w-close.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import { Input, TextareaAutosize } from '@mui/material';
import icondelete from '../../images/icons/icon_delete.svg';
import iconmenu from '../../images/icons/icon_menu.svg';
import attachment from '../../images/icons/attachment.svg';
import text_font from '../../images/icons/text_font.svg';
import image_light from '../../images/icons/image_light.svg';
import smiley_icons from '../../images/icons/smiley_icons.svg';
import signature from '../../images/icons/signature.svg';
import link_line from '../../images/icons/link_line.svg';
import template from '../../images/icons/template.svg';
import Plusion from '../../images/icons/composeion.svg';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function useOutsideAlerter(ref) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        const element = document.getElementById("UserCompose")
        element.classList.remove("show");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default function ComposePage({ GetDraftList }) {
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [State, SetState] = useState({
    To: "",
    Subject: "",
    Body: ""
  })

  useEffect(() => {
    GetClientID()
  }, [ClientID])

  // Open Compose
  const OpenCompose = () => {
    const element = document.getElementById("UserCompose")

    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }
  };

  // Close Compose
  const CloseCompose = () => {
    const element = document.getElementById("UserCompose")

    element.classList.remove("show");

  }

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
  }

  // Handle State Change
  const HandleChange = (e) => {
    SetState({ ...State, [e.target.name]: e.target.value })
  }

  // Add DraftTemplate
  const AddDraftTemplate = async () => {

    var To = document.getElementById("To").value;
    var Subject = document.getElementById("Subject").value;
    var Body = document.getElementById("Body").value;

    const Data = {
      MailTo: To,
      Subject: Subject,
      Body: Body,
      UserID: UserID,
      ClientID: ClientID,
      CreatedBy: 1
    }

    Axios({
      url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateAdd",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
        toast.success(<div>Draft <br />Draft template added successfully.</div>);
        OpenCompose();
        CloseCompose()
        GetDraftList()
        SetState({ To: "", Subject: "", Body: "" })
      }
    })
  }

   /* start navcode */ 
   const mincomposeon = () => {
    const element = document.getElementById("maxcompose")
    if (element.classList.contains("minmusbox")) {
    element.classList.remove("minmusbox");
    }
    else {
    element.classList.add("minmusbox");
    element.classList.remove("largebox");
    }
}

const maxcomposeon = () => {
    const element = document.getElementById("maxcompose")
    if (element.classList.contains("largebox")) {
    element.classList.remove("largebox");
    }
    else {
    element.classList.add("largebox");
    element.classList.remove("minmusbox");
    }
} 
/* end code*/
  const WrapperRef = useRef(null);
  useOutsideAlerter(WrapperRef);

  return (
    <>
      <div className='composebody' id='maxcompose'>
      <Button variant="contained btn btn-primary largbtn" onClick={OpenCompose}><img src={Plusion} /></Button>
        <div className="usercompose userdefual" id="UserCompose" ref={WrapperRef}>
          <div className='hcompose px-3'>
            <Row>
              <Col><h4>New Message</h4></Col>
              <Col className='col text-right'>
                <ButtonGroup className='composeion' variant="text" aria-label="text button group">
                  <Button onClick={mincomposeon} className="minicon">
                      <img src={Minimize} />
                  </Button>
                  <Button onClick={maxcomposeon} className="maxicon">
                      <img src={Maximize} />
                  </Button>
                  <Button onClick={OpenCompose}>
                    <img src={Close} />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
          <div className='subcompose px-3 py-2'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>To :</h6>
              </Col>
              <Col xs={9} className="px-0">
                <Input className='input-clend' id='To' name='To' value={State.To} onChange={HandleChange} />

              </Col>
              <Col xs={2} className='col text-right d-flex'>
                <Button className='lable-btn'>Cc</Button>
                <Button className='lable-btn'>Bcc</Button>
              </Col>
            </Row>
          </div>
          <div className='subcompose px-3 py-2'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>Subject :</h6>
              </Col>
              <Col xs={11} className="px-0">
                <Input className='input-clend' id='Subject' name='Subject' value={State.Subject} onChange={HandleChange} />
              </Col>
            </Row>
          </div>

          <div className='bodycompose'>
            <Row className='px-3 py-2'>
              <Col>
                <TextareaAutosize className='w-100' id='Body'
                  name='Body'
                  value={State.Body}
                  onChange={HandleChange}
                  aria-label="minimum height"
                  minRows={3}
                  placeholder=""
                />
              </Col>
            </Row>
          </div>

          <div className='ftcompose px-3'>
            <Row className='px-3'>
              <Col xs={10} className='px-0'>
                <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                  <Button variant="contained btn btn-primary smallbtn" onClick={AddDraftTemplate}> Save</Button>
                  <Button>
                    <img src={text_font} />
                  </Button>
                  <Button>
                    <img src={attachment} />
                  </Button>
                  <Button>
                    <img src={image_light} />
                  </Button>
                  <Button>
                    <img src={smiley_icons} />
                  </Button>
                  <Button>
                    <img src={signature} />
                  </Button>
                  <Button>
                    <img src={link_line} />
                  </Button>
                  <Button>
                    <img src={template} />
                  </Button>
                </ButtonGroup>
              </Col>

              <Col xs={2} className='px-0 text-right'>
                <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                  <Button>
                    <img src={icondelete} />
                  </Button>
                  <Button>
                    <img src={iconmenu} />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}