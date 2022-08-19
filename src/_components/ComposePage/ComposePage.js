import React, { useState, useEffect ,useRef} from 'react';
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

import Close from '../../images/icons/w-close.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import { Input, TextareaAutosize } from '@mui/material';

import iconleftright from '../../images/icon_left_right.svg';
import iconstar from '../../images/icon_star.svg';
import icontimer from '../../images/icon_timer.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';

import icondelete from '../../images/icons/icon_delete.svg';
import iconmenu from '../../images/icons/icon_menu.svg'; 


import attachment from '../../images/icons/attachment.svg'; 
import text_font from '../../images/icons/text_font.svg'; 
import image_light from '../../images/icons/image_light.svg'; 
import smiley_icons from '../../images/icons/smiley_icons.svg'; 
import signature from '../../images/icons/signature.svg'; 
import link_line from '../../images/icons/link_line.svg'; 
import template from '../../images/icons/template.svg'; 

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


export default function HomePage() {
    const [selected, setSelected] = React.useState(false);
    const [DraftTemplateToError, SetDraftTemplateToError] = useState("");
    const [DraftTemplateSubjectError, SetDraftTemplateSubjectError] = useState("");
    const [DraftTemplateBodyError, SetDraftTemplateBodyError] = useState("");
    const [ClientID, SetClientID] = React.useState(0);
    const [UserID, SetUserID] = React.useState(0);
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef); 

    const addShowCompose = () => {
      const element = document.getElementById("UserCompose")
      //null textbox
      var To = document.getElementById("To").value= "";
      var Subject = document.getElementById("Subject").value= "";
      var Body = document.getElementById("Body").value= "";

      if(element.classList.contains("show")){
        element.classList.remove("show");
      }
      else{
        element.classList.add("show");
      } 
    };

    
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

    // Add DraftTemplate
  const AddDraftTemplate = async () => {

    // const Valid = FromValidation();
    // if (Valid) {

      var To = document.getElementById("To").value;
      var Subject = document.getElementById("Subject").value;
      var Body = document.getElementById("Body").value;

      const Data = {
        MailTo: To,
        Subject: Subject,
        Body: Body,
        UserID: UserID,
        ClientID : ClientID,
        CreatedBy : 1
      }

    debugger
        Axios({
          url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateAdd",
          method: "POST",
          data: Data,
        }).then((Result) => {
          if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
            addShowCompose();
          }
        })
      
    // }

  }

   
  // FromValidation Start
  // const FromValidation = () => {
  //   var Isvalid = true;
  //   var ClientName = document.getElementById("name").value;

  //   if (ClientName === "") {
  //     SetDraftTemplateToError("Please Enter To")
  //     Isvalid = false
  //   }
    
  //   return Isvalid;
  // };

return (
    <>
     
         
      <div className='composebody'> 
        <Button variant="contained btn btn-primary largbtn" onClick={addShowCompose}> + Compose</Button>

        <div className="usercompose" id="UserCompose" ref={wrapperRef}>
            <div className='hcompose px-3'>
              <Row>
                <Col><h4>New Message</h4></Col>
                <Col className='col text-right'>
                  <ButtonGroup variant="text" aria-label="text button group"> 
                    <Button>
                      <img src={Minimize} />
                    </Button>
                    <Button>
                      <img src={Maximize} />
                    </Button>
                    <Button onClick={addShowCompose}>
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
                    <Input className='input-clend' id='To' />
                    
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
                    <Input className='input-clend'  id='Subject'/>
                  </Col> 
              </Row>
            </div>

            <div className='bodycompose'>
            <Row className='px-3 py-2'>
                <Col>
                  <TextareaAutosize className='w-100' id='Body'
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