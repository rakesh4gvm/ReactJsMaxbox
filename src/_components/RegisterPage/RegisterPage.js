import React, { useState, useEffect } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import { Col, Row } from 'react-bootstrap';
import MainHeader from '../MainHeader/MainHeader';
import BgSign from '../../images/sign-bg.png';

import { history } from '../../_helpers/history';
import { ResponseMessage } from "../../_constants/response.message";
import { CommonConstants } from "../../_constants/common.constants";

export default function RegisterPage() {
  const [FirstNameError, SetFirstNameError] = useState("");
  const [LastNameError, SetLastNameError] = useState("");
  const [EmailError, SetEmailError] = useState("");
  const [PasswordError, SetPasswordError] = useState("");
  const [ConfirmPasswordError, SetConfirmPasswordError] = useState("");
  const [AgreeError, SetAgreeError] = useState("");
  const [Agree, SetAgree] = useState(true)
  const [Checked, SetChecked] = React.useState(false);

  useEffect(() => {
    document.title = 'Register | MAXBOX';
  });

  // FromValidation start
  const FromValidation = () => {
    var Isvalid = true;
    var FirstName = document.getElementById("firstName").value;
    var LastName = document.getElementById("lastName").value;
    var Email = document.getElementById("email").value;
    var Password = document.getElementById("password").value;
    var ConfirmPassword = document.getElementById("confirmPassword").value;


    if (FirstName === "") {
      SetFirstNameError("Please enter first name")
      Isvalid = false
    }
    if (LastName === "") {
      SetLastNameError("Please enter last name")
      Isvalid = false
    }
    if (Email === "") {
      SetEmailError("Please enter email");
      Isvalid = false
    }
    if (Password === "") {
      SetPasswordError("Please enter password");
      Isvalid = false
    }
    if (ConfirmPassword === "") {
      SetConfirmPasswordError("Please enter confirm password")
      Isvalid = false
    }
    if (!Agree) {
      SetAgreeError("Please change terms & privacy policy")
      Isvalid = false
    }

    var IsValiEmail = validateEmail(Email)
    var IsValidPassword = validatePassword(Password);
    var IsValidCPassword = validateConfirmPassword();

    if (IsValiEmail == false) {
      Isvalid = false
    }

    if (IsValidPassword == false) {
      Isvalid = false
    }
    if (IsValidCPassword == false) {
      Isvalid = false
    }

    return Isvalid;
  };

  const validateEmail = (email) => {
    if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      SetEmailError("Invalid email")
      return false;
    }
    else {
      CheckEmailExist();
      //SetEmailError("")
    }
    return true;
  };

  const validatePassword = (Pwd) => {
    if (!/^.{6,20}$/i.test(Pwd)) {
      SetPasswordError("Password must be 6 to 20 chars long")
      return false;
    } else {
      SetPasswordError("")
    }

    return true;
  };

  const validateConfirmPassword = () => {
    var Password = document.getElementById("password").value;
    var ConfirmPassword = document.getElementById("confirmPassword").value;
    if (Password !== ConfirmPassword) {
      SetConfirmPasswordError("Confirmed password is not matching with password");
      return false
    }
    else {
      SetConfirmPasswordError('');
    }
    return true
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name == "firstname") {
      if (value != "") {
        SetFirstNameError("")
      }
    }
    else if (name == "lastname") {
      if (value != "") {
        SetLastNameError("")
      }
    }
    else if (name == "email") {
      if (value != "") {
        validateEmail(value)
      }
    }
    else if (name == "password") {
      if (value != "") {
        validatePassword(value);
      }
    }

    else if (name == "confirmPassword") {
      if (value != "") {

        validateConfirmPassword()
      }
    }
    else if (Agree) {
      SetAgreeError("")
    }

  };
  // FromValidation end

  const CheckEmailExist = async () => {
    var Email = document.getElementById("email").value;
    const Data = {
      Email: Email
    }

    Axios({
      url: CommonConstants.MOL_APIURL + "/user/UserEmailExist",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.Data > 0) {
          SetEmailError("Email is already exists")
        }
        else {
          SetEmailError("")
        }

      }
      else {
        SetEmailError("")
      }
    })

  }

  // Handle Two Way Factor
  const HandleTwoWayFactor = (event) => {
    SetChecked(event.target.checked);
  };

  function CancelButton() {
    history.push("/Login")
  }

  // Handle Terms and Conditions
  const HandleChecked = (e) => {
    if (e.target.checked) {
      SetAgree(true)
      SetAgreeError("")
    } else {
      SetAgree(false)
    }
  }

  // Register User
  const RegisterUser = async () => {

    const Valid = FromValidation();
    if (Valid) {
      var FirstName = document.getElementById("firstName").value;
      var LastName = document.getElementById("lastName").value;
      var Email = document.getElementById("email").value;
      var Password = document.getElementById("password").value;
      var ConfirmPassword = document.getElementById("confirmPassword").value;

      if (Password === ConfirmPassword) {
        if (Agree) {

          const Data = {
            FirstName: FirstName,
            LastName: LastName,
            Email: Email,
            Password: Password,
            TwoWayFactor: Checked
          }

          Axios({
            url: CommonConstants.MOL_APIURL + "/user/UserAdd",
            method: "POST",
            data: Data,
          }).then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
              history.push('/');
            }
          })

        }
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
            <h2>Register</h2>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='text' placeholder='First Name' id='firstName' name="firstname" onChange={handleChange} />
                  {FirstNameError && <p style={{ color: "red" }}>{FirstNameError}</p>}
                </div>
              </Col>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='text' placeholder='Last Name' id='lastName' name="lastname" onChange={handleChange} />
                  {LastNameError && <p style={{ color: "red" }}>{LastNameError}</p>}
                </div>
              </Col>
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
              <Col sm={4}>
                <div className='input-box'>
                  <input type='Password' placeholder='Confirm Password' id='confirmPassword' name="confirmPassword" onChange={handleChange} />
                  {ConfirmPasswordError && <p style={{ color: "red" }}>{ConfirmPasswordError}</p>}
                </div>
              </Col>

              <Col sm={4}>
                <div className='input-box'>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Checked}
                        onChange={HandleTwoWayFactor}
                      />
                    }
                    label="Two way factor" />
                </div>

              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox onChange={HandleChecked} checked={Agree} id="agree" />} label="I agree to all the Terms & Privacy Policy." />
                  {AgreeError && <p style={{ color: "red" }}>{AgreeError}</p>}
                </FormGroup>
              </Col>
            </Row>
          </div>

          <div className='sm-container'>
            <div className='btnprofile my-5 left'>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button variant="contained btn btn-primary smallbtn mr-4" onClick={RegisterUser}> submit</Button>
                <Button variant="contained btn smallbtn btn-orang" onClick={CancelButton}>Cancel</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>



    </>
  );
}