import React, { useRef, useEffect } from 'react';
import Axios from "axios";

import { Col, Row } from 'react-bootstrap';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FooterBottom from '../Footer/footer'; 
import InputLabel from '@mui/material/InputLabel'; 
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';


import BgProfile from '../../images/bg-profile.png';
import { history } from "../../_helpers";
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
 

   
export default function AddContactEmailPage() {  
  const [Email, setEmail] = React.useState('');
  const [AccountID, setAccountID] = React.useState('');
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [AccountList, SetAccountList] = React.useState([]);

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
    setEmail(AccountDetails.Email)
    
  };

  const SaveContact =()=>{
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


  return (
    <>
 

      <div className='bodymain min-100vh'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='py-4'>
            <h5 className='my-0'>Add Email Contacts</h5>
          </Col>
        </Row>  
        <div className='sm-container mt-5'>
          <Row className='mb-5'>
            <Col sm={6}>      
                <FormControl className='dropemailbox'>
                  <Select  onChange={SelectEmailAccount}  displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                    <MenuItem value="">select  email</MenuItem>
                    {AccountList.map((data) => (
                    <MenuItem name={data.Email}  value={data.AccountID}>
                      {data.Email}
                    </MenuItem>
                  ))}
                </Select>
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
                <input type='email' placeholder='Contact Email' id='contactemail' />
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