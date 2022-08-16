import React, { useState } from 'react';
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

const validateEmail = (setEmailError, email) => {
  if (email === "") {
    setEmailError("email cannot be blank");
    return;
  }

  if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    setEmailError("email is invalid");
    return;
  }

  return true;
};

export default function LoginPage({ children }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const setEmailValue = (e) => {
    setEmail(e.target.value);
  };
  const Login = (e) => {
    const valid = validateEmail(setEmailError, email);

    var Email = document.getElementById("email").value;
    var Password = document.getElementById("password").value;

    if (valid) {
      setEmailError("");
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
            history.push('/OtherInboxPage');
          }
        }
      });
    }


  }

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
                  <input type='email' placeholder='Email' id='email' name="email" onChange={setEmailValue} />
                  {emailError && <p style={{ color: "red" }}>{emailError}</p>}

                </div>
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
                Not account At? <a href='/Register'>Register</a> here.
              </Col>
            </Row>
          </div>

        </div>
      </div>



    </>
  );
}