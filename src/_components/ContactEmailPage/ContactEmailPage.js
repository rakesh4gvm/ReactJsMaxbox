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

import FooterBottom from '../Footer/footer';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '../../images/icons/icon_wh_delete.svg';
import SearchIcon from '@material-ui/icons/Search';
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';
import BgProfile from '../../images/bg-profile.png';
import { styled, alpha } from '@mui/material/styles';
import { history } from "../../_helpers";
import Emailinbox from '../../images/email_inbox_img.png';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import EditIcon from '@material-ui/icons/Edit';
import { toast } from "react-toastify";
import InputBase from '@mui/material/InputBase';
import "react-toastify/dist/ReactToastify.css";
import MaxboxLoading from '../../images/Maxbox-Loading.gif';
import { MenuItem } from '@mui/material';

import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import Navigation from '../Navigation/Navigation'; 

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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',

}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '9',
  color: '#666'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

toast.configure();



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



export default function ContactEmailPage() {
  const [personName, setPersonName] = React.useState([]);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [CountPage, SetCountPage] = React.useState(0);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [ContactList, SetContactList] = React.useState([]);
  const [AccountList, SetAccountList] = React.useState([]);
  const [SortField, SetSortField] = React.useState("ContactEmail");
  const [AccountIDs, SetAccountIDs] = React.useState([]);
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [DeleteID, SetDeleteID] = React.useState()


  useEffect(() => {
    GetClientID();
  }, [SearchInbox, SortedBy, SortField]);


  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    EmailAccountGet(UserDetails.ClientID, UserDetails.UserID)
    // GetContactList(UserDetails.ClientID, UserDetails.UserID, AccountIDs)
  }

  // Start Get Objection Template List
  const GetContactList = (CID, UID, IDs, PN) => {
    LoaderShow()
    var Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
      AccountIDs: IDs
    };

    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/contact/ContactGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetContactList(Result.data.PageData);
        SetCountPage(Result.data.PageCount);
        LoaderHide()
      }
      else {
        SetContactList([])
        SetCountPage(0)
        LoaderHide()
        toast.error(Result?.data?.Message);
      }
    });
  };

  const EmailAccountGet = (CID, UID) => {
    LoaderShow()
    var Data = {
      ClientID: CID,
      UserID: UID,
      AccountIDs: []
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/contact/EmailAccountGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetAccountList(Result.data.PageData);
          var AccountID = Result.data.PageData[0].AccountID;
          var AccountIDArry = [];
          AccountIDArry.push(AccountID);
          SetAccountIDs(AccountIDArry)
          GetContactList(CID, UID, [Result.data.PageData[0].AccountID], Page)
          setPersonName(
            typeof Result.data.PageData[0].Email === 'string' ? Result.data.PageData[0].Email.split(',') : Result.data.PageData[0].Email,
          );
        }

      }
      else {
        SetAccountList([])

        toast.error(Result?.data?.Message);
      }
    });
    LoaderHide()
  }

  const HandleChangePage = (Event, NewPage) => {
    SetPage(NewPage);
    GetContactList(ClientID, UserID, AccountIDs, NewPage);
  };

  const AddContact = () => {
    history.push({
      pathname: '/AddContactEmail',
      state: AccountIDs
    });
  }

  const OpenDeletePopModel = (ID) => {
    SetDeletePopModel(true);
    SetDeleteID(ID)
  }
  const CloseDeletePopModel = () => {
    SetDeletePopModel(false);
  }
  const DeleteContact = () => {
    var Data = {
      ID: DeleteID
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/contact/ContactDelete",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        LoaderShow()
        GetContactList(ClientID, UserID, [], Page)
        toast.success(<div>Contacts <br />Delete mail successfully.</div>);
        SetDeletePopModel(false);
      }
      else {
        GetContactList(ClientID, UserID, [], Page)
        SetDeletePopModel(false);
        toast.error(Result?.data?.Message);
      }
    });
  }

  const handleChange = (event) => {
    LoaderShow()
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );

    var Ids = []

    for (var i = 0; i < value.length; i++) {

      let Result = AccountList.find(data => data.Email == value[i])
      Ids.push(Result.AccountID)
    }
    let res
    if (Ids.length > 0) {
      res = Ids
    } else {
      res = [-1]
    }
    SetAccountIDs(res)
    GetContactList(ClientID, UserID, res, Page)
  };
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      LoaderShow()
      SetPage(1);
      SetRowsPerPage(10);
      SetSearchInbox(e.target.value)
      LoaderHide()
    }
  }
  return (
    <>

      <div id="hideloding" className="loding-display">
        <img src={MaxboxLoading} />
      </div>

      <div>
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
                you want to delete a email ?
              </Typography>
            </div>
            <div className='d-flex btn-50'>
              <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteContact() }}>
                Yes
              </Button>
              <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseDeletePopModel(); }}>
                No
              </Button>
            </div>
          </Box>
        </Modal>
      </div>

      <div className='lefter'>
        <Navigation />
      </div>
      <div className='righter'> 

        <div className='px-3'> 
          <Row className='bodsetting px-4'>
            <Col className='py-3'>
            <h5 className='my-0'>Email Contacts</h5> 
            </Col>
          </Row>
        </div>

      <div className='container'> 

        <div className='sm-container mt-5'>
          <Row className='mb-5'>
            <Col sm={5}>
              <FormControl className='dropemailbox'>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  MenuProps={MenuProps}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <>Select Authed Email</>;
                    }
                    return selected.join(', ');
                  }}
                >
                  {AccountList.map((data) => (
                    <MenuItem key={data.AccountID} name={data.Email} value={data.Email}>
                      <Checkbox checked={personName.indexOf(data.Email) > -1} />
                      {/* <Checkbox defaultChecked={data.AccountID == AccountIDs ? true : false} /> */}
                      <ListItemText primary={data.Email} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>



            </Col>
            <Col sm={4}>
              <div className='textbox-dek serchdek'>
                <Search onKeyUp={(e) => SearchBox(e, this)}>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    defaultValue={SearchInbox}
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              </div>
            </Col>
            <Col sm={3} align="right">
              <Button className='btnaccount' onClick={AddContact}>
                <AddIcon /> Add Contact
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>

              <TableContainer className='tablename' component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Contact Email</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ContactList.map((row) => (
                      <TableRow
                        key={row.ContactEmail}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.EmailAccount.Email}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.ContactEmail}
                        </TableCell>
                        <TableCell align="right">
                          <Button className='iconbtntable' onClick={() => OpenDeletePopModel(row?._id)}
                          >
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
      </div>
 
    </>
  );
}