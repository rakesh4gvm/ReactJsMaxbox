import React, { useRef, useEffect } from 'react';
import Axios from "axios";

import { Col, Row } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
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
import FooterBottom from '../Footer/footer';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '../../images/icons/icon_wh_delete.svg';
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';
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

toast.configure();

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
  const [CountPage, SetCountPage] = React.useState(0);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [EmailAccountList, SetEmailAccountList] = React.useState([]);
  const [SortField, SetSortField] = React.useState("FromName");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState('');
  const [UserID, SetUserID] = React.useState(0);
  const [EmailAccountDetails, SetEmailAccountDetails] = React.useState([]);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [IsEmailAuthSucess, SetIsEmailAuthSucess] = React.useState(false);
  const [IsEmailAuthFail, SetIsEmailAuthFail] = React.useState(false);
  const [IsEmailAuthExist, SetIsEmailAuthExist] = React.useState(false);
  useEffect(() => {
    document.title = 'Email Configuration | MAXBOX';
    GetClientID();
    // CheckAccountAuthonicate()
    // GetEmailAccountList()

  }, [SortedBy, SortField]);

  const CheckAccountAuthonicate = () => {

    var queryparamter = window.location.search.substring(1);
    if (queryparamter != "") {
      var ResultMessage = (queryparamter.split('data=')[1]);
      var pagename = atob(ResultMessage);
      if (pagename != "UPDATE SUCCESS" && pagename != "SUCCESS" && pagename != "Email Already Authenticated" && pagename != "ERROR") {
        history.push("/EditEmail?data=" + ResultMessage);
      }
      else {
        if (pagename == "UPDATE SUCCESS" || pagename == "SUCCESS") {
          SetIsEmailAuthSucess(true)
          const queryParams = ""
          history.replace({
            search: queryParams,
          })
        }
        else if (pagename = "Email Already Authenticated") {
          SetIsEmailAuthExist(true)
          const queryParams = ""
          history.replace({
            search: queryParams,
          })
        }
        else {
          SetIsEmailAuthFail(true)
          const queryParams = ""
          history.replace({
            search: queryParams,
          })
        }
      }

    }
  }
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    CheckAccountAuthonicate()
    GetEmailAccountList(UserDetails.ClientID, UserDetails.UserID, Page)
  }

  // Start Get EmailAccount
  const GetEmailAccountList = (CID, UID, PN) => {
    let Data
    Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: '',
      ClientID: CID,
      UserID: UID,
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
        LoaderHide()
      } else {
        LoaderHide()
        toast.error(Result?.data?.Message);
      }
    });
  };
  // End Get EmailAccount

  //change Page
  const HandleChangePage = (Event, NewPage) => {
    SetPage(NewPage);
    GetEmailAccountList(ClientID, UserID, NewPage);
  };

  //SortData Page
  const SortData = (Field) => {
    SetSortField(Field);
    if (SortedBy == 1) {
      SetSortedBy(-1);
    } else {
      SetSortedBy(1);
    }
    GetEmailAccountList(ClientID, UserID, Page)
  }

  // start Authenticate email
  const AddEmailAccount = () => {
    var data = {
      ClientID: ClientID,
      UserID: UserID,

    };
    const responseapi = Axios({
      url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountAdd",
      method: "POST",
      data: data
    });
    responseapi.then((Result) => {

      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        //var AccountID = 0;
        var loginHint = ''
        var scope = encodeURIComponent(CommonConstants.SCOPE);
        var redirect_uri_encode = encodeURIComponent(CommonConstants.REDIRECT_URL);
        var client_id = encodeURIComponent(CommonConstants.CLIENT_ID);
        var response_type = "code";
        var access_type = "offline";
        var state = "Addemailaccountlistpage" + "," + ClientID + "," + UserID;

        var Url = "https://accounts.google.com/o/oauth2/auth?scope=" + scope + "&redirect_uri=" + redirect_uri_encode + "&response_type=" + response_type + "&client_id=" + client_id + "&state=" + state + "&access_type=" + access_type + "&approval_prompt=force&login_hint=" + loginHint + ""
        window.location.href = Url;
      } else {
        toast.error(Result?.data?.Message);
      }
    });

  }
  // end Authenticate email

  const EditEmailConfiguration = (ID) => {
    history.push("/EditEmail", ID);
  }
  // start ReAuthenticate email
  const ReAuthenticate = (data) => {
    var AccountID = data._id;
    var loginHint = data.Email;
    var scope = encodeURIComponent(CommonConstants.SCOPE);
    var redirect_uri_encode = encodeURIComponent(CommonConstants.REDIRECT_URL);
    var client_id = encodeURIComponent(CommonConstants.CLIENT_ID);
    var response_type = "code";
    var access_type = "offline";
    var state = "emailaccountlistpage" + "AccountID" + AccountID;

    var Url = "https://accounts.google.com/o/oauth2/auth?scope=" + scope + "&redirect_uri=" + redirect_uri_encode + "&response_type=" + response_type + "&client_id=" + client_id + "&state=" + state + "&access_type=" + access_type + "&approval_prompt=force&login_hint=" + loginHint + ""
    window.location.href = Url;
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
    responseapi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        LoaderShow()
        GetEmailAccountList(ClientID, UserID, Page)
        SetDeletePopModel(false);
      }
      else {
        GetEmailAccountList(ClientID, UserID, Page)
        SetDeletePopModel(false);
        toast.error(Result?.data?.Message);
      }
    });
  }
  // end email account delete


  return (
    <>

      <div id="hideloding" className="loding-display">
        <img src={MaxboxLoading} />
      </div>

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

      <div className='bodymain min-100vh'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='py-4'>
            <h5 className='my-0'>Email Configuration</h5>
          </Col>
        </Row>
        <Stack sx={{ width: '100%' }} spacing={2}>
          {IsEmailAuthSucess == true ? <Alert severity="success" onClose={() => { SetIsEmailAuthSucess(false) }}>   <strong> Well done!</strong> Authentication of your account is done.</Alert> : ""}
          {IsEmailAuthFail == true ? <Alert severity="error" onClose={() => { SetIsEmailAuthFail(false); }}> <strong>Oops!</strong> Something went wrong while authentication, please try again!</Alert> : ""}
          {IsEmailAuthExist == true ? <Alert severity="info" onClose={() => { SetIsEmailAuthExist(false); }}> <strong>Oops!</strong> Email already exist, please try again with other email!</Alert> : ""}
        </Stack>


        <div className='sm-container mt-5'>
          <Row className='mb-5'>
            <Col align="right">
              {ClientID != "" ?
                <Button className='btnaccount' onClick={AddEmailAccount}>
                  <AddIcon /> Add Account
                </Button>
                : ""}
            </Col>
          </Row>
          <Row>
            <Col>
              <TableContainer className='tablename' component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell onClick={() => { SortData("FirstName") }}>First Name</TableCell>
                      <TableCell onClick={() => { SortData("LastName") }}>Last Name</TableCell>
                      <TableCell onClick={() => { SortData("Email") }} >Email</TableCell>
                      <TableCell align="right">Working</TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {EmailAccountList.map((row) => (

                      <TableRow>
                        <TableCell>{row.FirstName}</TableCell>
                        <TableCell>{row.LastName}</TableCell>
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

                        <TableCell align="right">{row.IsWorking == true ? '' : <Button className='btnauthenticate' onClick={() => ReAuthenticate(row)}><img src={LoaderCircle} className="mr-1" ></img> Re Authenticate</Button>}</TableCell>
                        <TableCell>
                          <Button className='iconbtntable' onClick={() => OpenEmailAccountDeletePopModel(row)}>
                            <img src={DeleteIcon} />
                          </Button>
                          <Button className="iconbtntable" onClick={() => EditEmailConfiguration(row._id)}><EditIcon /></Button>
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