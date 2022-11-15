import React, { useRef, useState, useEffect } from 'react';
import Axios from "axios"

import { Select } from '@material-ui/core';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { MenuItem } from '@mui/material';
import { history } from "../../_helpers";

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import BgProfile from '../../images/bg-profile.png';
import { Col, Row } from 'react-bootstrap';

import FooterBottom from '../Footer/footer';
import { GetUserDetails, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import Cameraicons from '../../images/icons/icons-camera.svg';


import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaxboxLoading from '../../images/Maxbox-Loading.gif';


toast.configure();

export default function ProfileSettingPage() {
  const [DropdownValue, SetDropdownValue] = useState([])
  const [User, SetUser] = useState()
  const [Country, SetCountry] = useState([])
  
  const [Base64Image, SetBase64Image] = useState()
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [Checked, SetChecked] = React.useState();
  const [ImagePreview, SetImagePreview] = useState()
  const [FirstNameError, SetFirstNameError] = useState("");
  const [LastNameError, SetLastNameError] = useState("");
  const [EmailError, SetEmailError] = useState("");
  const [PasswordError, SetPasswordError] = useState("");
  const [ConfirmPasswordError, SetConfirmPasswordError] = useState("");

  useEffect(() => {
    document.title = 'Profile Setting | MAXBOX';
    GetClientID()
    // GetUserList()
    // GetCountryList()
  }, [])
  useEffect(() => {

  }, [DropdownValue])

  // Select Country
  const SelectCountry = (e) => {
    SetDropdownValue(e.target.value)
  }

  // Start Get ClientID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    GetUserList(UserDetails.UserID)
    GetCountryList()
  }

  // Get Users List
  const GetUserList = (UserID) => {
    const Data = { UserID: UserID }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/user/UserGetByID",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetUser(Result?.data?.Data)
        SetDropdownValue(Result?.data?.Data?.CountryID?._id)
        SetChecked(Result?.data?.Data?.TwoWayFactor)
        SetBase64Image(Result?.data?.Data?.UserImage);
        LoaderHide()
      } else {
        toast.error(Result?.data?.Message);
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
      } else {
        toast.error(Result?.data?.Message);
      }
    });
  }

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
    if (File.type === "image/png" || File.type === "image/jpeg" || File.type === "image/jpg") {
      SetImagePreview(File)
      const Base64 = await ConvertBase64(File)
      SetBase64Image(Base64)
    } else {
      toast.error("Please select valid image format.")
    }


    // const Data = { Email: Email }
    // const ResponseApi = await Axios({
    //   url: CommonConstants.MOL_APIURL + "/utility/UserProfileImageUpload",
    //   method: "POST",
    //   data: Data,
    // })

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

  // Handle Two Way Factor
  const HandleTwoWayFactor = (event) => {
    SetChecked(event.target.checked);
  };

  // FromValidation start
  const FromValidation = () => {
    var Isvalid = true;
    var FirstName = document.getElementById("firstName").value;
    var LastName = document.getElementById("lastName").value;
    var Password = document.getElementById("password").value;
    var ConfirmPassword = document.getElementById("confirmpassword").value;


    if (FirstName === "") {
      SetFirstNameError("Please enter first name")
      Isvalid = false
    }
    if (LastName === "") {
      SetLastNameError("Please enter last name")
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
   


    var IsValidPassword = validatePassword(Password);
    var IsValidCPassword = validateConfirmPassword();

   

    if (IsValidPassword == false) {
      Isvalid = false
    }
    if (IsValidCPassword == false) {
      Isvalid = false
    }

    return Isvalid;
  };

  function handleChange(e) {
    
    const { name, value } = e.target;
    console.log(value)
    console.log(name)
    if (name == "firstName") {
      if (value != "") {
        SetFirstNameError("")
      }
    }
    else if (name == "lastName") {
      if (value != "") {
        SetLastNameError("")
      }
    }
  
    else if (name == "password") {
      if (value != "") {
        validatePassword(value);
      }
    }

    else if (name == "confirmpassword") {
      if (value != "") {

        validateConfirmPassword()
      }
    }
    

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
    var ConfirmPassword = document.getElementById("confirmpassword").value;
    if (Password !== ConfirmPassword) {
      SetConfirmPasswordError("Confirmed password is not matching with password");
      return false
    }
    else {
      SetConfirmPasswordError('');
    }
    return true
  }

  // Update User
  const UpdateUser = async () => {
    const Valid = FromValidation();
    if (Valid) {
    var FirstName = document.getElementById("firstName").value;
    var LastName = document.getElementById("lastName").value;
    var Email = document.getElementById("email").value;
    var PhoneNumber = document.getElementById("phone").value;
    var ZipCode = document.getElementById("zip").value;
    var Password = document.getElementById("password").value;

    var CheckData = await CheckEmailExists(Email)

    let CountryId
    if (DropdownValue === null) {
      CountryId = User?.CountryID?._id
    }
    else {
      CountryId = DropdownValue
    }

    let Data = {
      UserID: UserID,
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      PhoneNumber: PhoneNumber,
      ZipCode: ZipCode,
      CountryID: CountryId,
      Password: Password,
      UserProfile: Base64Image,
      TwoWayFactor: Checked
    }

    if (CheckData === "SUCCESS") {
      Axios({
        url: CommonConstants.MOL_APIURL + "/user/UserUpdate",
        method: "POST",
        data: Data,
      }).then((Result) => {
        if (Result.data.StatusMessage === "SUCCESS") {
          const GetLoginData = localStorage.getItem("LoginData")
          const Image = JSON.parse(GetLoginData)
          Image.UserImage = Base64Image

          localStorage.setItem("LoginData", JSON.stringify(Image))
          toast.success(<div>Profile Setting <br />Profile setting updated successfully.</div>);
          LoaderShow()
          GetUserList(UserID);
        } else {
          toast.error(Result?.data?.Message);
        }
      })
    }

  }
  }

  const CancelUser = async () => {
    history.push("/UnansweredResponses");
  }

  function UseOutsideAlerter(Ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (Ref.current && !Ref.current.contains(event.target)) {
          const element = document.getElementById("Userdropshow")
          element.classList.remove("show");
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [Ref]);
  }


  const WrapperRef = useRef(null);
  UseOutsideAlerter(WrapperRef);
  return (
    <>

      <div id="hideloding" className="loding-display">
        <img src={MaxboxLoading} />
      </div>

      <div className='bodymain'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='text-center py-5' style={{ minHeight: '230px' }}>
            <h4>Profile Setting</h4>
          </Col>
        </Row>


        <Row className='text-center mt-5'>
          <Col>
            <div className='imguploadmain'>
              <div className='imgupload'>
                {/* <img src={User?.UserImage} alt="img" /> */}
                <img src={ImagePreview ? URL.createObjectURL(ImagePreview) : User?.UserImage} alt={ImagePreview ? ImagePreview.name : null} />
              </div>
              <div className='uploadedimg'>
                <img src={Cameraicons} width="20px" />
                <input type='file' onChange={(e) => UploadImage(e)} accept="image/*" />
              </div>
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
                <input type='text' placeholder='First Name' id='firstName' name="firstName" defaultValue={User?.FirstName}  onChange={handleChange}/>
                {FirstNameError && <p style={{ color: "red" }}>{FirstNameError}</p>}
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Last Name' id='lastName' name="lastName" defaultValue={User?.LastName} onChange={handleChange}/>
                {LastNameError && <p style={{ color: "red" }}>{LastNameError}</p>}
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='email' placeholder='Email' id='email' defaultValue={User?.Email} readonly="readonly" />
                
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Phone Number' id='phone' defaultValue={User?.PhoneNumber} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='text' placeholder='Zip code' id='zip' defaultValue={User?.ZipCode} />
              </div>
            </Col>
            <Col sm={4}>
              <div className='select-box'>
                <Select labelId="demo-simple-select-label" fullWidth value={DropdownValue} onChange={SelectCountry}>
                  {Country?.map((row) => (
                    <MenuItem value={row?._id}>{row?.CountryName}</MenuItem>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <div className='input-box'>
                <input type='Password' placeholder='Password' id='password' name="password" defaultValue={User?.Password} onChange={handleChange} />
                {PasswordError && <p style={{ color: "red" }}>{PasswordError}</p>}
              </div>
            </Col>
            <Col sm={4}>
              <div className='input-box'>
                <input type='Password' placeholder='Confirm Password' id='confirmpassword' name="confirmpassword" defaultValue={User?.Password} onChange={handleChange}/> 
                {ConfirmPasswordError && <p style={{ color: "red" }}>{ConfirmPasswordError}</p>}
                 </div>
            </Col>
            <Col sm={4}>
            </Col>
          </Row>
          <Row>
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
            <Col sm={4}>
            </Col>
            <Col sm={4}>
            </Col>
          </Row>
        </div>

        <div className='btnprofile my-5'>
          <ButtonGroup variant="text" aria-label="text button group">
            <Button variant="contained btn btn-primary smallbtn mx-4" onClick={UpdateUser}> Save</Button>
            <Button variant="contained btn btn-orang smallbtn" onClick={CancelUser}> Cancel</Button>
          </ButtonGroup>
        </div>

      </div>

      <FooterBottom />

    </>
  );
}