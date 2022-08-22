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



export default function LoginPage({ children }) {
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

  const validateEmail = (email) => {
    if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmail("Invalid email")
      return false;
    }
    else {
      setEmail("")
    }
    return true;
  };

  function handleChange(e) {
    const { name, value } = e.target;
    if (name == "email") {
      if (value != "") {
        validateEmail(value)
      }
    }
    else if (name == "password") {
      if (value != "") {
        setPassword("")
      }
    }
    setUserPassword('')
  };

  // FromValidation end

  // Login method start
  const Login = () => {
    const valid = FromValidation();
    var Email = document.getElementById("email").value;
    var Password = document.getElementById("password").value;

    if (valid) {
      const Data = { Email: Email, Password: Password }
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/user_login/userlogin",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            var LoginDetails = Result.data.Data[0];
            var ObjLoginData = {
              "UserID": LoginDetails._id,
              "Token": LoginDetails.Token,
              "StaticToken": Result.data.StaticToken,
              "UserImage": LoginDetails.UserImage
            }
            localStorage.setItem("LoginData", JSON.stringify(ObjLoginData));
            SetClientID(LoginDetails._id,LoginDetails.UserImage);
            window.location.href=CommonConstants.HomePage;
          //  history.push('/OtherInboxPage');
          }
          else
          {
            setUserPassword("Please email and password does not match")
          }
        }
      });
    }

  }


  const SetClientID = (UserID,UserImage) => {
    var Data = {
        UserID: UserID
    }
    const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/client/GetClientListForTopDropDown",
        method: "POST",
        data: Data,
    });
    ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
            if (Result.data.Data.length > 0) {
                    UpdateUserDetails((Result.data.Data[0].ClientID))
                }
            }
          
        
    });
}

  const Register=()=>{
    history.push('/Register');
  }
// Login method start
  return (
    <>

      <MainHeader />

      <div className='bodymain my-0 px-0'>
        <div className='sign-main'>
          <img className='bgsigner' src={BgSign} />

          <div className='sm-container pt-5'>
            <h2>Login</h2>
            <Row>
            <Col sm={4}>
                <div className='input-box'>
                {UserPasswordError && <p style={{ color: "red" }}>{UserPasswordError}</p>}
                </div>
              </Col>
            </Row>
            <Row>
            <Col sm={4}>
                <div className='input-box'>
                  <input type='email' placeholder='Email' id='email' name="email" onChange={handleChange} />

                  {EmailError && <p style={{ color: "red" }}>{EmailError}</p>}

                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='Password' placeholder='Password' id='password' name="password" onChange={handleChange} />
                  {PasswordError && <p style={{ color: "red" }}>{PasswordError}</p>}
                </div>
              </Col>
              <Col>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="Remember me" />
                </FormGroup>
              </Col>
              <Col sm={4}>
                <a href=''>Forgot Password?</a>
              </Col>
            </Row>
          </div>

          <div className='sm-container my-4'>
            <Row>
              <Col sm={4}>
                <div className='btnprofile left'>
                  <ButtonGroup variant="text" aria-label="text button group">
                    <Button variant="contained btn btn-primary smallbtn" onClick={Login}>Login</Button>

                  </ButtonGroup>
                </div>
              </Col>
            </Row>
          </div>

          <div className='sm-container'>
            <Row>
              <Col sm={4}>
                Not account At? <a href='#'onClick={Register}>Register</a> here.
              </Col>
            </Row>
          </div>

        </div>
      </div>



    </>
  );
}