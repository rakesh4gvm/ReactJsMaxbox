import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import FooterBottom from '../Footer/footer';
import { Select } from '@material-ui/core';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import BgProfile from '../../images/bg-profile.png';
import Axios from "axios"

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { useEffect } from 'react';
import { useState } from 'react';

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

export default function ProfileSettingPage({ children }) {
  const [selected, setSelected] = React.useState(false);

  const addShowCompose = () => {
    const element = document.getElementById("UserCompose")
    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }
  };
  const [open, setOpen] = React.useState(false);
  const [openone, setOpenone] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenOne = () => setOpenone(true);
  const handleCloseOne = () => setOpenone(false);

  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));
  const [user, setUser] = useState()
  const [country, setCountry] = useState([])
  const [SelectedCountryDropdown, setSelectedCountryDropdown] = useState(null);

  const SelectCountry = (e) => {
    setSelectedCountryDropdown(e.target.value)
  }

  useEffect(() => {
    getUserList()
    getCountryList()
  }, [])

  const getUserList = () => {
    const data = { UserID: "62da32ea6874d926c02a8472" }
    const responseapi = Axios({
      url: CommonConstants.MOL_APIURL + "/user/UserGetByID",
      method: "POST",
      data: data,
    });
    responseapi.then((result) => {
      if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
        setUser(result?.data?.Data)
      }
    });
  }

  const getCountryList = () => {
    const responseapi = Axios({
      url: CommonConstants.MOL_APIURL + "/user/CountryGet",
      method: "GET",
    });
    responseapi.then((result) => {
      if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
        setCountry(result?.data?.PageData)
      }
    });
  }

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const [checkEmail, setCheckEmail] = useState("")

  const checkEmailExists = async (Email) => {
    const data = { Email: Email }
    const resApi = await Axios({
      url: CommonConstants.MOL_APIURL + "/user/UserEmailExist",
      method: "POST",
      data: data,
    })

    return resApi?.data.StatusMessage
  }

  const updateUser = async () => {
    var FirstName = document.getElementById("firstName").value;
    var LastName = document.getElementById("lastName").value;
    var Email = document.getElementById("email").value;
    var PhoneNumber = document.getElementById("phone").value;
    var ZipCode = document.getElementById("zip").value;
    var Password = document.getElementById("password").value;

    var checkData = await checkEmailExists(Email)

    let Country
    if (SelectedCountryDropdown === null) {
      Country = user?.CountryID?._id
    }
    else {
      Country = SelectedCountryDropdown
    }

    let data = {
      UserID: "62da32ea6874d926c02a8472",
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      PhoneNumber: PhoneNumber,
      ZipCode: ZipCode,
      CountryID: Country,
      Password: Password,
    }

    if (checkData === "SUCCESS") {
      Axios({
        url: CommonConstants.MOL_APIURL + "/user/UserUpdate",
        method: "POST",
        data: data,
      }).then((res) => {
        return console.log("UserUpdate Succrsss======", res)
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
            <div className='imgupload'>
            </div>
            <div className='mt-4'>
              <h5>{user?.FirstName} {user?.LastName}</h5>
              <a>{user?.Email}</a>
            </div>
          </Col>
        </Row>

        <div className='sm-container mt-5'>
          <Row>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='First Name' id='firstName' name="firstName" defaultValue={user?.FirstName} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Last Name' id='lastName' name="lastName" defaultValue={user?.LastName} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='email' placeholder='Email' id='email' defaultValue={user?.Email} />
                {checkEmail && (
                  <span style={{ color: "red" }}>
                    Email Already Exists.
                  </span>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Phone No.' id='phone' defaultValue={user?.PhoneNumber} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Zip code' id='zip' defaultValue={user?.ZipCode} />
              </div>
            </Col>
            <Col sm={4}>
              <div class="Select-box">
                <Select labelId="demo-simple-select-label" defaultdefaultValue={user?.CountryID?.CountryName} id="country" onChange={SelectCountry} >
                  {country?.map((row) => (
                    <option value={row?._id}>{row?.CountryName}</option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <div className='input-box'>
                <input type='Password' placeholder='Password' id='password' defaultValue={user?.Password} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='Password' placeholder='Confirm Password' id='confirmpassword' defaultValue={user?.Password} />
              </div>
            </Col>
            <Col>
            </Col>
          </Row>
        </div>

        <div className='btnprofile my-5'>
          <ButtonGroup variant="text" aria-label="text button group">
            <Button variant="contained btn btn-primary smallbtn"> Edit</Button>
            <Button variant="contained btn btn-primary smallbtn mx-4" onClick={updateUser}> Save</Button>
            <Button variant="contained btn btn-orang smallbtn"> Cancel</Button>
          </ButtonGroup>
        </div>

      </div>

      <FooterBottom />

    </>
  );
}