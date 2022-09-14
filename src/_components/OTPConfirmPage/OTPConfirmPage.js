import React, { useState } from 'react';
import Axios from "axios"
import { Col, Row } from 'react-bootstrap';

import MainHeader from '../MainHeader/MainHeader';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import BgSign from '../../images/sign-bg.png';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";

export default function OTPConfirmPage(props) {

  const [OTPErrorMessage, SetOTPErrorMessage] = useState("")
  const [User, SetUser] = useState()

  const GetUser = () => {
    const Data = { Email: props.location.state.Email }
    Axios({
      url: CommonConstants.MOL_APIURL + "/user/UserGetByEmail",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
        SetUser(Result?.data?.Data)
      }
    })
  }

  const VerifyUser = () => {
    GetUser()

    var one = document.getElementById("one").value;
    var two = document.getElementById("two").value;
    var three = document.getElementById("three").value;
    var four = document.getElementById("four").value;
    var five = document.getElementById("five").value;
    var six = document.getElementById("six").value;

    const Result = one + two + three + four + five + six

    if (one == "" || two == "" || three == "" || four == "" || five == "" || six == "") {
      SetOTPErrorMessage("All Fields are Mandatory!")
    } else {
      if (User?.OneTimePassword === parseInt(Result)) {
        const Data = { Email: props.location.state.Email, Password: props.location.state.Password }
        const ResponseApi = Axios({
          url: CommonConstants.MOL_APIURL + "/user_login/userlogin",
          method: "POST",
          data: Data,
        });
        ResponseApi.then((Result) => {

          if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
            SetOTPErrorMessage("")
            if (Result.data.Data.length > 0) {
              var LoginDetails = Result.data.Data[0];
              var ObjLoginData = {
                "UserID": LoginDetails._id,
                "Token": LoginDetails.Token,
                "StaticToken": Result.data.StaticToken,
                "UserImage": LoginDetails.UserImage
              }
              localStorage.setItem("LoginData", JSON.stringify(ObjLoginData));
            }
          }
        });
      } else {
        SetOTPErrorMessage("Invalid OTP")
      }
    }
  }

  return (
    <>

      <MainHeader />

      <div className='bodymain my-0 px-0'>
        <div className='sign-main'>
          <img className='bgsigner' src={BgSign} />

          <div className='sm-container pt-5'>
            <h2 class="pt-5">Verification Code</h2>
            <p>Enter your Verification Code sent to</p>
            <p>91**********</p>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  {OTPErrorMessage && <p style={{ color: "red" }}>{OTPErrorMessage}</p>}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <div className='code-inputbox'>
                  <input type='text' name='one' id='one' />
                  <input type='text' name='two' id='two' />
                  <input type='text' name='three' id='three' />
                  <input type='text' name='four' id='four' />
                  <input type='text' name='five' id='five' />
                  <input type='text' name='six' id='six' />
                </div>
              </Col>
            </Row>
          </div>

          <div className='sm-container my-4'>
            <Row>
              <Col sm={4}>
                <div className='btnprofile left'>
                  <ButtonGroup variant="text" aria-label="text button group">
                    <Button variant="contained btn btn-primary smallbtn" onClick={VerifyUser}>Verify</Button>
                    {/* <Button variant="contained btn smallbtn">Cancel</Button>  */}
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