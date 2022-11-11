import React, { useRef, useEffect,useState } from 'react';
import Axios from "axios";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Col, Row } from 'react-bootstrap';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FooterBottom from '../Footer/footer'; 
import InputLabel from '@mui/material/InputLabel'; 
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { styled, alpha } from '@mui/material/styles';

import BgProfile from '../../images/bg-profile.png';
import { history } from "../../_helpers";
import { ValidateEmail } from "../../_helpers/Utility";
import Emailinbox from '../../images/email_inbox_img.png';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import EditIcon from '@material-ui/icons/Edit';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaxboxLoading from '../../images/Maxbox-Loading.gif';
import { MenuItem } from '@mui/material';
 


toast.configure();
 
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
   
export default function AddContactEmailPage() {  
  const [Email, setEmail] = React.useState('');
  const [AccountID, setAccountID] = React.useState('');
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [AccountList, SetAccountList] = React.useState([]);
  const [EmailError, SetEmailError] = useState("");
  const [EmailAccountError, SetEmailAccountError] = useState("");
  useEffect(() => {
    GetClientID();
  }, [AccountID,ClientID,UserID]);

   // Get Client ID
   const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    EmailAccountGet(UserDetails.ClientID, UserDetails.UserID)
    LoaderHide()
  }

  const EmailAccountGet=(CID, UID)  =>
  {
   var Data = {
      ClientID: CID,
      UserID: UID
     
    };
  const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/contact/EmailAccountGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      //debugger;
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetAccountList(Result.data.PageData);
       // LoaderHide()
      }
      else {
        SetAccountList([])
        //LoaderHide()
        toast.error(Result?.data?.Message);
      }
    });

  }
  
  const SelectEmailAccount = (event) => {
    setAccountID(event.target.value);
    var AccountDetails=AccountList.find(c=>c.AccountID==event.target.value);
    if(AccountDetails !="" && AccountDetails!== undefined){

      setEmail(AccountDetails.Email)
      SetEmailAccountError("")
    }else{
      setEmail("")
      SetEmailAccountError("Please select email account")
    }
   
  };

  // FromValidation start
  const FromValidation = () => {
    var Isvalid = true;
    var ContactEmail = document.getElementById("contactemail").value;
   
    if (ContactEmail === "") {
      SetEmailError("Please enter email")
      Isvalid = false
    }
    var IsValiEmail = ValidateEmail(ContactEmail)
    if (IsValiEmail == false) {
      Isvalid = false
    }


    return Isvalid;
  };

  function handleChange(e) {
    var ContactEmail = document.getElementById("contactemail").value;
   
    if (ContactEmail != "") {
      var IsValiEmail = ValidateEmail(ContactEmail)
      if(IsValiEmail == false){
        SetEmailError("Invalid email")
      }else{
        SetEmailError("")
      }
    }

    
  };

  const SaveContact =()=>{
    LoaderShow();
    var Isvalid = FromValidation()
    if(AccountID <= 0)
    {
      SetEmailAccountError("Please select email account")
      Isvalid = false;
    }else{
      SetEmailAccountError("")
    }
if(Isvalid){
    var contactemail = document.getElementById("contactemail").value;
    var Data={
      AccountID: AccountID,
      ClientID:ClientID,
      UserID:UserID,
      ContactEmail:contactemail
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/contact/ContactAdd",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      //debugger;
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        history.push("/ContactEmail");
      }
      else {
       
        //LoaderHide()
        toast.error(Result?.data?.Message);
      }
    });
  }
  LoaderHide()
  }
 // Cancel Edit Client
 const CancelContact = () => {
  history.push("/ContactEmail");
}

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

  return (
    <>
 
 <div id="hideloding" className="loding-display">
                <img src={MaxboxLoading} />
            </div>
      <div className='bodymain min-100vh'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='py-4'>
          <h5 onClick={CancelContact} className='my-0'><a className='mr-2 iconwhite'><ArrowBackIcon /></a>Add Email Contacts</h5>
          </Col>
        </Row>  
        <div className='sm-container mt-5'>
          <Row className='mb-5'>
            <Col sm={6}>      
                <FormControl className='dropemailbox'>
                  <Select  onChange={SelectEmailAccount}   inputProps={{ 'aria-label': 'Without label' }}  >
                    <MenuItem value="">select  email</MenuItem>
                    {AccountList.map((data) => (
                    <MenuItem name={data.Email}  value={data.AccountID}>
                      {data.Email}
                    </MenuItem>
                  ))}
                </Select>
                {EmailAccountError && <p style={{ color: "red" }}>{EmailAccountError}</p>}
                </FormControl>
            </Col>
            <Col sm={6} align="right"> 
            </Col>
          </Row>
          <Row className='mt-5'>
            <Col>
              <div className='listlable'>
                <label>Email</label>
                <p>{Email}</p>
              </div>
            </Col>
          </Row>
          <Row className='mt-5'>
            <Col sm={6}>
              <div className='input-box'>
                <input type='email' placeholder='Contact Email' id='contactemail' onChange={handleChange} />
                {EmailError && <p style={{ color: "red" }}>{EmailError}</p>}
              </div>
            </Col>
          </Row> 
          <div className='btnprofile my-3 float-left'>
            <ButtonGroup variant="text" aria-label="text button group">
              <Button variant="contained btn btn-primary smallbtn mr-4" onClick={SaveContact}> Save</Button>
            </ButtonGroup>
          </div>
            
            
        </div>


      </div>

      <FooterBottom />
    </>
  );
}