import React, { useRef, useEffect } from 'react';
import Axios from "axios";
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import FooterBottom from '../Footer/footer';


import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '../../images/icons/icon_wh_delete.svg';
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';
import BgProfile from '../../images/bg-profile.png';

import Emailinbox from '../../images/email_inbox_img.png';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails } from "../../_helpers/Utility";

var atob = require('atob');

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


export default function EmailConfigurationPage() {
  //var ClientID='',UserID=''
  const [CountPage, SetCountPage] = React.useState(0);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [EmailAccountList, SetEmailAccountList] = React.useState([]);
  const [SortField, SetSortField] = React.useState("FromName");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [EmailAccountDetails, SetEmailAccountDetails] = React.useState([]);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [Email, SetEmail] = React.useState()
  useEffect(() => {
    GetClientID();
    CheckAccountAuthonicate()
    GetEmailAccountList()
    // GetEmailList()
  }, [Page, RowsPerPage, SortedBy, SortField,ClientID,UserID]);

  const CheckAccountAuthonicate = () => {
    var queryparamter = window.location.search.substring(1);
    if (queryparamter != "") {
      var ResultMessage = atob(queryparamter.split('data=')[1]);
    }
  }
  const GetClientID = () => {
    debugger;
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      // ClientID=UserDetails.ClientID;
      // UserID=UserDetails.UserID;
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
  }

  // Start Get EmailAccount
  const GetEmailAccountList = () => {
    let Data
    Data = {
      Page: Page,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: '',
      ClientID: ClientID,
      UserID: UserID,
    };

    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetEmailAccountList(Result.data.PageData);
        SetCountPage(Result.data.PageCount);
      }
    });
  };
  // End Get EmailAccount

  //change Page
  const HandleChangePage = (Event, NewPage) => {
    SetPage(NewPage);
    GetEmailAccountList();
  };

  //SortData Page
  const SortData = (Field) => {
    SetSortField(Field);
    if (SortedBy == 1) {
      SetSortedBy(-1);
    } else {
      SetSortedBy(1);
    }
    GetEmailAccountList()
  }

  // start Authenticate email
  const AddEmailAccount = () => {
    var data = {
      ClientID:ClientID,
      UserID: UserID,

    };
    const responseapi = Axios({
      url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountAdd",
      method: "POST",
      data: data
    });
    responseapi.then((result) => {

      if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
        var AccountID = 0;
        var loginHint = ''
        var scope = encodeURIComponent(CommonConstants.SCOPE);
        var redirect_uri_encode = encodeURIComponent(CommonConstants.REDIRECT_URL);
        var client_id = encodeURIComponent(CommonConstants.CLIENT_ID);
        var response_type = "code";
        var access_type = "offline";
        var state = AccountID + "_" + encodeURIComponent(loginHint);

        var Url = "https://accounts.google.com/o/oauth2/auth?scope=" + scope + "&redirect_uri=" + redirect_uri_encode + "&response_type=" + response_type + "&client_id=" + client_id + "&state=" + state + "&access_type=" + access_type + "&approval_prompt=force&login_hint=" + loginHint + ""
        window.location.href = Url;
      }
    });

  }
  // end Authenticate email

  // start ReAuthenticate email
  const ReAuthenticate = (data) => {
    const responseapi = Axios({
      url: CommonConstants.MOL_APIURL + "/email_account/ReAuthenticateEmailAccount",
      method: "POST",
      data: data
    });
    responseapi.then((result) => {
      if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
        var AccountID = data._id;
        var loginHint = data.Email;
        var scope = encodeURIComponent(CommonConstants.SCOPE);
        var redirect_uri_encode = encodeURIComponent(CommonConstants.REDIRECT_URL);
        var client_id = encodeURIComponent(CommonConstants.CLIENT_ID);
        var response_type = "code";
        var access_type = "offline";
        var state = AccountID + "_" + encodeURIComponent(loginHint);

        var Url = "https://accounts.google.com/o/oauth2/auth?scope=" + scope + "&redirect_uri=" + redirect_uri_encode + "&response_type=" + response_type + "&client_id=" + client_id + "&state=" + state + "&access_type=" + access_type + "&approval_prompt=force&login_hint=" + loginHint + ""
        window.location.href = Url;
      }
    });

  }
  // end ReAuthenticate email

  // start email account delete
  const OpenEmailAccountDeletePopModel = (data) => {
    SetEmailAccountDetails(data)
    SetDeletePopModel(true);
  }
  const CloseDeletePopModel = () => {
    SetDeletePopModel(false);
  }

  const EmailAccountDelete = (data) => {
    var data = {
      ID: data._id
    };
    const responseapi = Axios({
      url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountDelete",
      method: "POST",
      data: data
    });
    responseapi.then((result) => {
      if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
        GetEmailAccountList()
        SetDeletePopModel(false);
      }
      else {
        GetEmailAccountList()
        SetDeletePopModel(false);
      }
    });
  }
  // end email account delete

  // // Get Email List ID
  // const GetEmailList = () => {
  //   const Data = { ID: "62e216304561e63bc0f37f5b" }
  //   const ResponseApi = Axios({
  //     url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountGetByID",
  //     method: "POST",
  //     data: Data,
  //   });
  //   ResponseApi.then((Result) => {
  //     if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
  //       SetEmail(Result.data.Data)
  //     }
  //   });
  // }

  // // Update Email
  // const UpdateEmail = async () => {
  //   var FirstName = document.getElementById("firstName").value;
  //   var LastName = document.getElementById("lastName").value;
  //   var Email = document.getElementById("email").value;
  //   var RefreshToken = document.getElementById("refreshToken").value;
  //   var IsWorking = document.getElementById("isWorking").value;

  //   let Data = {
  //     UserID: "62e216304561e63bc0f37f5b",
  //     FirstName: FirstName,
  //     LastName: LastName,
  //     Email: Email,
  //     RefreshToken: RefreshToken,
  //     IsWorking: IsWorking,
  //   }
  //   Axios({
  //     url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountUpdate",
  //     method: "POST",
  //     data: Data,
  //   }).then((Result) => {
  //   })
  // }

  return (
    <>
      <HeaderTop />

      <Modal className="modal-pre"
        open={DeletePopModel}
        onClose={CloseDeletePopModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Style} className="modal-prein">
          <div className='p-5 text-center'>
            <img src={Emailinbox} width="130" className='mb-4' />
            <Typography id="modal-modal-title" variant="b" component="h6">
              Are you sure ?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              you want to delete a email.
            </Typography>
          </div>
          <div className='d-flex btn-50'>
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { EmailAccountDelete(EmailAccountDetails); }}>
              Yes
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseDeletePopModel(); }}>
              No
            </Button>
          </div>
        </Box>
      </Modal>

      <div className='bodymain'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='py-4'>
            <h5 className='my-0'>Email Configuration</h5>
          </Col>
        </Row>



        <div className='sm-container mt-5'>
          <Row className='mb-5'>
            <Col align="right">
              <Button className='btnaccount' onClick={AddEmailAccount}>
                <AddIcon /> Add Account
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <TableContainer className='tablename' component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell onClick={() => { SortData("FirstName") }} align="right">First Name</TableCell>
                      <TableCell onClick={() => { SortData("LastName") }} align="right">Last Name</TableCell>
                      <TableCell onClick={() => { SortData("Email") }} >Email</TableCell>
                      <TableCell align="right">Working</TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {EmailAccountList.map((row) => (

                      <TableRow>
                        <TableCell align="right">{row.FirstName}</TableCell>
                        <TableCell align="right">{row.LastName}</TableCell>
                        <TableCell scope="row">{row.Email}</TableCell>
                        <TableCell align="right">
                          <ButtonGroup className='table-btn' variant="text" aria-label="text button group">
                            {row.IsWorking == true ? <Button className='btn-success'>
                              Yes
                            </Button> : <Button className='btn-success'>
                              NO
                            </Button>}
                          </ButtonGroup>
                        </TableCell>

                        <TableCell align="right">{row.IsWorking == false ? '' : <Button className='btnauthenticate' onClick={() => ReAuthenticate(row)}><img src={LoaderCircle} className="mr-1" ></img> Re Authenticate</Button>}</TableCell>
                        <TableCell align="right">
                          <Button className='iconbtntable' onClick={() => OpenEmailAccountDeletePopModel(row)}>
                            <img src={DeleteIcon} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack className='my-4 page-dec' spacing={2}>
                <Pagination count={CountPage} onChange={HandleChangePage} variant="outlined" shape="rounded" />
              </Stack>
            </Col>
          </Row>
        </div>

      </div>

      <FooterBottom />

    </>
  );
}