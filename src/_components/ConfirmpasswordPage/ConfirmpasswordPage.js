import React, { useState, useEffect } from 'react';
import Axios from "axios"
import { Col, Row } from 'react-bootstrap';
import moment from "moment"

import MainHeader from '../MainHeader/MainHeader';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import BgSign from '../../images/sign-bg.png';

import { history } from '../../_helpers/history';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function ConfirmpasswordPage() {

  const [User, SetUser] = useState()
  const [URLToken, SetURLToken] = useState()
  const [ErrorMessage, SetErrorMessage] = useState("")

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const Code = queryParams.get("code");
    SetURLToken(Code)
    GetUserByToken()
  }, [URLToken])

  const GetUserByToken = async () => {

    const Data = { Token: URLToken }
    await Axios({
      url: CommonConstants.MOL_APIURL + "/user/UserGetByToken",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
        SetUser(Result.data.Data)
      } else {
        toast.error(Result?.data?.Message);
      }
    })
  }

  const Update = async () => {

    var Password = document.getElementById("password").value;
    var ConfirmPassword = document.getElementById("confirmpassword").value;

    const CurrentTime = moment().format("hh:mm:ss")
    const UserTime = moment(User.LastUpdatedDate).format("hh:mm:ss")
    const SubstractTime = moment(CurrentTime, "hh:mm:ss").subtract(10, 'minutes').format('hh:mm:ss');

    if (UserTime <= SubstractTime) {
      SetErrorMessage("Token Expired!")
    } else {
      if (Password == "" || ConfirmPassword == "") {
        SetErrorMessage("All Fields are Mandatory!")
      } else {
        if (Password === ConfirmPassword) {
          const Data = { Token: URLToken, Password: Password }
          await Axios({
            url: CommonConstants.MOL_APIURL + "/user/UpdatePassword",
            method: "POST",
            data: Data,
          }).then((Result) => {
            if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
              toast.success(<div>Confirm Password <br />Password updated successfully.</div>);
              const UpdatedData = { IsPasswordUpdated: false, UserID: "63159cf4957df035d054fe11" }
              Axios({
                url: CommonConstants.MOL_APIURL + "/user/UpdateIsDeletedPassword",
                method: "POST",
                data: UpdatedData,
              }).then((Result) => {
                if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                }
              })
              history.push("/")
            } else {
              toast.error(Result?.data?.Message);
            }
          })
        } else {
          SetErrorMessage("Password not match!")
        }
      }
    }
  }

  return (
    <>
      <MainHeader />
      {
        User?.IsPasswordUpdated
          ?
          <div className='bodymain my-0 px-0'>
            <div className='sign-main'>
              <img className='bgsigner' src={BgSign} />

              <div className='sm-container pt-5'>
                <h2 class="pt-5">Confirm Password</h2>
                <Row>
                  <Col sm={4}>
                    <div className='input-box'>
                      {ErrorMessage && <p style={{ color: "red" }}>{ErrorMessage}</p>}
                    </div>
                  </Col>
                </Row>

                {/* <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='Password' placeholder='Old Password' id='oldpassword' name="oldpassword" /> 
                </div>
              </Col>
              <Col>
              </Col>
            </Row> */}
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
                        <Button variant="contained btn btn-primary smallbtn" onClick={Update}>submit</Button>
                        <Button variant="contained btn smallbtn">Cancel</Button>
                      </ButtonGroup>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          :
          <div style={{ color: "black", fontSize: "20px", marginTop: "100px" }}>Already Updated</div>
      }
    </>
  );
}