import React, { useEffect, useState } from 'react';
import Axios from "axios"
import { Col, Row } from 'react-bootstrap';

import MainHeader from '../MainHeader/MainHeader';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import BgSign from '../../images/sign-bg.png';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { UpdateUserDetails } from '../../_helpers/Utility'

export default function OTPConfirmPage(props) {

  const [OTPErrorMessage, SetOTPErrorMessage] = useState("")
  const [User, SetUser] = useState()

  useEffect(() => {
    GetUser()
  }, [])

  // Get User
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

  // Verify User
  const VerifyUser = () => {
    // GetUser()

    var One = document.getElementById("one").value;
    var Two = document.getElementById("two").value;
    var Three = document.getElementById("three").value;
    var Four = document.getElementById("four").value;
    var Five = document.getElementById("five").value;
    var Six = document.getElementById("six").value;

    const Result = One + Two + Three + Four + Five + Six

    if (One == "" || Two == "" || Three == "" || Four == "" || Five == "" || Six == "") {
      SetOTPErrorMessage("Please Enter Your Verification Code!")
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
              SetClientID(LoginDetails._id, LoginDetails.UserImage);
            }
          }
        });
      } else {
        SetOTPErrorMessage("Invalid OTP")
      }
    }
  }

  // Set Client ID
  const SetClientID = (UserID) => {
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
          window.location.href = CommonConstants.HomePage;
        }
        else {
          window.location.href = CommonConstants.HomePage;
        }
      }
      else {
        window.location.href = CommonConstants.HomePage;
      }
    });
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