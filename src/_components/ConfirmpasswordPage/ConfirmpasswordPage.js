import React, { useState, useEffect } from 'react';
import Axios from "axios"
import { Col, Row } from 'react-bootstrap';

import MainHeader from '../MainHeader/MainHeader';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import BgSign from '../../images/sign-bg.png';

import { history } from '../../_helpers/history';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { UpdateUserDetails} from '../../_helpers/Utility'



export default function ConfirmpasswordPage({ children }) {
  const [EmailError, setEmail] = useState("");
  const [PasswordError, setPassword] = useState("");
  const [UserPasswordError,setUserPassword]=useState("")
  // FromValidation start
  const FromValidation = () => {
    var Isvalid = true;
    var Email = document.getElementById("email").value;
    var Password = document.getElementById("password").value;

    if (Email === "") {
      setEmail("Please enter email")
      Isvalid = false
    }
    if (Password === "") {
      setPassword("Please enter password")
      Isvalid = false
    }
    return Isvalid;
  }
 
  
  return (
    <>

      <MainHeader />

      <div className='bodymain my-0 px-0'>
        <div className='sign-main'>
          <img className='bgsigner' src={BgSign} />

          <div className='sm-container pt-5'>
            <h2 class="pt-5">Confirm Password</h2> 
            
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='Password' placeholder='Old Password' id='oldpassword' name="oldpassword" /> 
                </div>
              </Col>
              <Col>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='Password' placeholder='Password' id='password' name="password" /> 
                </div>
              </Col>
              <Col>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='Password' placeholder='Confirm Password' id='confirmpassword' name="confirmpassword" /> 
                </div>
              </Col>
              <Col>
              </Col>
            </Row>  
          </div>

          <div className='sm-container my-4'>
            <Row>
              <Col sm={4}>
                <div className='btnprofile left'>
                  <ButtonGroup variant="text" aria-label="text button group">
                    <Button variant="contained btn btn-primary smallbtn">submit</Button>
                    <Button variant="contained btn smallbtn">Cancel</Button> 
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