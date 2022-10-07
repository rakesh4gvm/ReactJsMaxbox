import React, { useState, useEffect } from 'react';
import Axios from "axios"
import { Col, Row } from 'react-bootstrap';

import MainHeader from '../MainHeader/MainHeader';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import BgSign from '../../images/sign-bg.png';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { history } from '../../_helpers';
var CryptoJS = require("crypto-js");

export default function ForgetpasswordPage() {

  const [EmailSuccess, SetEmailSuccess] = useState("");
  const [EmailError, SetEmailError] = useState("");

  const ValidateEmail = (Email) => {
    if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Email)) {
      SetEmailError("Invalid email")
      return false;
    }
    else {
      SetEmailError("")
    }
    return true;
  };

  function handleChange(e) {
    const { name, value } = e.target;

    if (name == "email") {
      if (value != "") {
        ValidateEmail(value)
      }
    }

  };

  const SubmitMail = async () => {

    var Email = document.getElementById("email").value;
    var Tmp_Token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var Token = CryptoJS.MD5(Tmp_Token).toString();

    if (Email == "") {
      SetEmailError("Please Enter Email!")
    } else {

      var Data = {
        Email: Email,
        Token: Token
      };

      Axios({
        url: CommonConstants.MOL_APIURL + "/user/ForgotPassword",
        method: "POST",
        data: Data,
      }).then((Result) => {
        if (Result.data.Data > 0) {
          SetEmailSuccess("Email Sent Successfully!")
        } else {
          SetEmailError("Email not found!")
        }
      })
    }
  }

  const CancelButton = () => {
    history.push("/")
  }


  return (
    <>

      <MainHeader />

      <div className='bodymain my-0 px-0'>
        <div className='sign-main'>
          <img className='bgsigner' src={BgSign} />

          <div className='sm-container pt-5'>
            <h2 class="pt-5">Forgot Password?</h2>
            <p>Enter your email to reset your password</p>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  {EmailError && <p style={{ color: "red" }}>{EmailError}</p>}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  {EmailSuccess && <p style={{ color: "green" }}>{EmailSuccess}</p>}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='email' placeholder='Email' id='email' name="email" onChange={handleChange} />
                </div>
              </Col>
            </Row>
          </div>

          <div className='sm-container my-4'>
            <Row>
              <Col sm={4}>
                <div className='btnprofile left'>
                  <ButtonGroup variant="text" aria-label="text button group">
                    <Button variant="contained btn btn-primary smallbtn mr-4" onClick={SubmitMail}>Request</Button>
                    <Button variant="contained btn smallbtn" onClick={CancelButton}>Cancel</Button>
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