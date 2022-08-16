import React, { useState, useEffect } from 'react';
import Axios from "axios"

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import BgProfile from '../../images/bg-profile.png';
import { Col, Row } from 'react-bootstrap';
import MainHeader from '../MainHeader/MainHeader';
import FooterBottom from '../Footer/footer';
import Select from 'react-select'
import BgSign from '../../images/sign-bg.png';


// import inboximg2 from '../../images/inboximg2.jpg';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const options = [
  { value: 'v1', label: 'Country' },
  { value: 'v2', label: 'Country 1' },
  { value: 'v3', label: 'Country 2' }
]

export default function RegisterPage({ children }) {
  const [FirstNameError, SetFirstNameError] = useState("");
  const [LastNameError, SetLastNameError] = useState("");
  const [EmailError, SetEmailError] = useState("");
  const [PasswordError, SetPasswordError] = useState("");
  const [ConfirmPasswordError, SetConfirmPasswordError] = useState("");

  // Email Validation
  const ValidateEmail = (FirstName, LastName, Email, Password, ConfirmPassword) => {
    if (FirstName === "") {
      SetFirstNameError("Please Enter First Name")
    }
    if (LastName === "") {
      SetLastNameError("Please Enter Last Name")
    }
    if (Email === "") {
      SetEmailError("Please Enter Email");
    }
    if (Password === "") {
      SetPasswordError("Please Eneter Password");
    }
    if (ConfirmPassword === "") {
      SetConfirmPasswordError("Please Eneter ConfirmPassword")
    }
    return true;
  };

  // Register User
  const RegisterUser = async () => {
    var FirstName = document.getElementById("firstName").value;
    var LastName = document.getElementById("lastName").value;
    var Email = document.getElementById("email").value;
    var Password = document.getElementById("password").value;
    var ConfirmPassword = document.getElementById("confirmPassword").value;

    const Valid = ValidateEmail(FirstName, LastName, Email, Password, ConfirmPassword);

    const Data = {
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      Password: Password,
    }

    if (Valid) {
      if (FirstName == "" || LastName == "" || Email == "" || Password == "" || ConfirmPassword !== Password) {
        console.log("Error occurs")
      } else {
        Axios({
          url: CommonConstants.MOL_APIURL + "/user/UserAdd",
          method: "POST",
          data: Data,
        }).then((Result) => {
          SetFirstNameError("")
          SetLastNameError("")
          SetEmailError("")
          SetPasswordError("")
          SetConfirmPasswordError("")
          console.log("Result========", Result)
        })
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
                  <input type='text' placeholder='First Name' id='firstName' name="firstName"  />
                  {FirstNameError && <p style={{ color: "red" }}>{FirstNameError}</p>}
                </div>
              </Col>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='text' placeholder='Last Name' id='lastName' name="lastName" />
                  {LastNameError && <p style={{ color: "red" }}>{LastNameError}</p>}
                </div>
              </Col>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='email' placeholder='Email' id='email' name="email" />
                  {EmailError && <p style={{ color: "red" }}>{EmailError}</p>}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='Password' placeholder='Password' id='password' name="password" />
                  {PasswordError && <p style={{ color: "red" }}>{PasswordError}</p>}
                </div>
              </Col>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='Password' placeholder='Confirm Password' id='confirmPassword' name="confirmPassword" />
                  {ConfirmPasswordError && <p style={{ color: "red" }}>{ConfirmPasswordError}</p>}
                </div>
              </Col>
              <Col>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked />} label="I agree to all the Terms & Privacy Policy." />
                </FormGroup>
              </Col>
            </Row>
          </div>

          <div className='sm-container'>
            <div className='btnprofile my-5 left'>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button variant="contained btn btn-primary smallbtn" onClick={RegisterUser}> submit</Button>
                {/* <Button variant="contained btn btn-orang smallbtn"> Cancel</Button> */}
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>



    </>
  );
}