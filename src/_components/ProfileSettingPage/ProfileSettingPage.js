import React, { useState, useEffect } from 'react';
import Axios from "axios"

import { Select } from '@material-ui/core';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { MenuItem } from '@mui/material';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import BgProfile from '../../images/bg-profile.png';
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import FooterBottom from '../Footer/footer';
// import inboximg2 from '../../images/inboximg2.jpg';

const Style = {
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

export default function ProfileSettingPage({ children }) {
  const [Selected, SetSelected] = React.useState(false);
  const [DropdownValue, SetDropdownValue] = useState([])
  const [Open, SetOPen] = React.useState(false);
  const [OpneOne, SetOpenOne] = React.useState(false);
  const [User, SetUser] = useState()
  const [Country, SetCountry] = useState([])
  const [SelectedCountryDropdown, setSelectedCountryDropdown] = useState(null);
  const [Base64Image, SetBase64Image] = useState()
  const [Value, SetValue] = React.useState(new Date('2014-08-18T21:11:54'));

  useEffect(() => {
    GetUserList()
    GetCountryList()
  }, [])
  useEffect(() => {
   
  }, [DropdownValue])

  const HandleOpen = () => SetOPen(true);
  const HandleClose = () => SetOPen(false);
  const HandleOpenOne = () => SetOpenOne(true);
  const HandleCloseOne = () => SetOpenOne(false);

  // Add Show Compose
  const AddShowCompose = () => {
    const element = document.getElementById("UserCompose")
    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }
  };

  // Select Country
  const SelectCountry = (e) => {
    debugger;
    SetDropdownValue(e.target.value)
  }

  // Get Users List
  const GetUserList = () => {
    const Data = { UserID: "62f100397213b9323442a660" }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/user/UserGetByID",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetUser(Result?.data?.Data)
        SetDropdownValue(Result?.data?.Data?.CountryID?._id)
      }
    });
  }

  // Get Country List
  const GetCountryList = () => {
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/user/CountryGet",
      method: "GET",
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetCountry(Result?.data?.PageData)
      }
    });
  }

  // Handle Change
  const HandleChange = (NewValue) => {
    SetValue(NewValue);
  };

  // Check Existing Email
  const CheckEmailExists = async (Email) => {
    const Data = { Email: Email }
    const ResponseApi = await Axios({
      url: CommonConstants.MOL_APIURL + "/user/UserEmailExist",
      method: "POST",
      data: Data,
    })
    return ResponseApi?.data.StatusMessage
  }

  // Upload Image
  const UploadImage = async (e) => {
    const File = e.target.files[0]
    const Base64 = await ConvertBase64(File)
    SetBase64Image(Base64)
  }

  // Convert image to base64
  const ConvertBase64 = (File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(File)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (Error) => {
        reject(Error)
      }
    })
  }

  // Update User
  const UpdateUser = async () => {
    var FirstName = document.getElementById("firstName").value;
    var LastName = document.getElementById("lastName").value;
    var Email = document.getElementById("email").value;
    var PhoneNumber = document.getElementById("phone").value;
    var ZipCode = document.getElementById("zip").value;
    var Password = document.getElementById("password").value;

    var CheckData = await CheckEmailExists(Email)

    let CountryId
    if (SelectedCountryDropdown === null) {
      CountryId = User?.CountryID?._id
    }
    else {
      CountryId = SelectedCountryDropdown
    }

    let Data = {
      UserID: "62f100397213b9323442a660",
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      PhoneNumber: PhoneNumber,
      ZipCode: ZipCode,
      CountryID: CountryId,
      Password: Password,
      UserProfile: Base64Image
    }

    if (CheckData === "SUCCESS") {
      Axios({
        url: CommonConstants.MOL_APIURL + "/user/UserUpdate",
        method: "POST",
        data: Data,
      }).then((Result) => {
        GetUserList()
      })
    }
  }

  return (
    <>
      <HeaderTop />

      <div className='bodymain'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='text-center py-5' style={{ minHeight: '230px' }}>
            <h4>Profile Setting</h4>
          </Col>
        </Row>


        <Row className='text-center mt-5'>
          <Col>
            <div>
              <img src={User?.UserImage} alt="img" />
            </div>
            <div className='mt-4'>
              <h5>{User?.FirstName} {User?.LastName}</h5>
              <a>{User?.Email}</a>
            </div>
          </Col>
        </Row>

        <div className='sm-container mt-5'>
          <Row>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='First Name' id='firstName' name="firstName" defaultValue={User?.FirstName} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Last Name' id='lastName' name="lastName" defaultValue={User?.LastName} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='email' placeholder='Email' id='email' defaultValue={User?.Email} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Phone No.' id='phone' defaultValue={User?.PhoneNumber} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Zip code' id='zip' defaultValue={User?.ZipCode} />
              </div>
            </Col>
            <Col sm={4}>
              <div>
              <Select labelId="demo-simple-select-label" fullWidth value={DropdownValue} onChange={SelectCountry}>
                                        {Country?.map((row) => (
                                            <MenuItem value={row?._id}>{row?.CountryName}</MenuItem>
                                        ))}
                                    </Select>

                {/* <Select id="demo-simple-select-label" value={DropdownValue} fullWidth onChange={SelectCountry} >
                  {Country?.map((row) => (
                    <MenuItem value={row?._id}>{row?.CountryName}</MenuItem >
                  ))}
                </Select> */}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <div className='input-box'>
                <input type='Password' placeholder='Password' id='password' defaultValue={User?.Password} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='Password' placeholder='Confirm Password' id='confirmpassword' defaultValue={User?.Password} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='file' onChange={(e) => UploadImage(e)} />
              </div>
            </Col>
          </Row>
        </div>

        <div className='btnprofile my-5'>
          <ButtonGroup variant="text" aria-label="text button group">
            <Button variant="contained btn btn-primary smallbtn"> Edit</Button>
            <Button variant="contained btn btn-primary smallbtn mx-4" onClick={UpdateUser}> Save</Button>
            <Button variant="contained btn btn-orang smallbtn"> Cancel</Button>
          </ButtonGroup>
        </div>

      </div>

      <FooterBottom />

    </>
  );
}