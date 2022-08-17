import React, { useRef, useState, useEffect } from 'react';
import Axios from "axios";
import Moment from "moment";

import { styled, alpha } from '@mui/material/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Box from '@mui/material/Box';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import downarrow from '../../images/icon_downarrow.svg';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';

import Compose from '../ComposePage/ComposePage';
import inboxuser1 from '../../images/avatar/1.jpg';
import inboxuser3 from '../../images/avatar/3.jpg';
import iconleftright from '../../images/icon_left_right.svg';
import iconstar from '../../images/icon_star.svg';
import icontimer from '../../images/icon_timer.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg';
import Emailinbox from '../../images/email_inbox_img.png';
import Emailcall from '../../images/email_call_img.png';
import { Col, Row } from 'react-bootstrap';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import parse from "html-react-parser";
import HeaderTop from '../Header/header';
import { GetUserDetails } from "../../_helpers/Utility";

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
function UseOutSideAlerter(Ref) {
  useEffect(() => {
    function HandleClickOutside(Event) {
      if (Ref.current && !Ref.current.contains(Event.target)) {
        const Element = document.getElementById("id_userboxlist")
        Element.classList.remove("show");
      }
    }
    document.addEventListener("mousedown", HandleClickOutside);
    return () => {
      document.removeEventListener("mousedown", HandleClickOutside);
    };
  }, [Ref]);
}
const AddInboxClass = () => {
  const element = document.getElementById("id_userboxlist")
  if (element.classList.contains("show")) {
    element.classList.remove("show");
  }
  else {
    element.classList.add("show");
  }
};

export default function OtherInboxPage() {
  const [InBoxList, SetInBoxList] = React.useState([]);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [SortField, SetSortField] = React.useState("FromName");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [AllDeletePopModel, SetAllDeletePopModel] = React.useState(false);
  const [StarPopModel, SetStarPopModel] = React.useState(false);
  const [StarSelected, SetStarSelected] = React.useState(false);
  const [InboxChecked, SetInboxChecked] = React.useState([]);
  const [SelectAllCheckbox, SetSelectAllCheckbox] = React.useState(false);
  const [Open, SetOpen] = React.useState(false);
  const [OpenOne, SetOpenOne] = React.useState(false);
  const [Value, SetValue] = React.useState(new Date('2014-08-18T21:11:54'));
  const [Checked, SetChecked] = React.useState([1]);
  const [SelectedDropdownList, SetSelectedDropdownList] = useState([]);

  useEffect(() => {
   
    GetClientID();
    GetInBoxList();
    if (InBoxList?.length > 0) SetSelectedDropdownList(InBoxList)
  }, [SearchInbox, ClientID, InBoxList?.length,InboxChecked]);

  // Handle Change Dropdown List Manage by on React Js
  const HandleDropdownListCheckbox = (item) => {
    if (SelectedDropdownList.some(sl => sl?._id === item?._id)) {
      SetSelectedDropdownList(SelectedDropdownList.filter(sl => sl?._id !== item?._id))
    } else {
      SetSelectedDropdownList([...SelectedDropdownList, item])
    }
  }

 

  const HandleOpen = () => SetOpen(true);
  const HandleClose = () => SetOpen(false);
  const HandleOpenOne = () => SetOpenOne(true);
  const HandleCloseOne = () => SetOpenOne(false);

  const handleChange = (NewValue) => {
    SetValue(NewValue);
  };

  // Get ClientID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
  }

  // Start Get InBoxList
  const GetInBoxList = () => {
    var Data = {
      Page: Page,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: ClientID,
      UserID: UserID,
      IsInbox: false,
      IsStarred: false,
      IsFollowUp: false,
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetInBoxList(Result.data.PageData);
        OpenMessageDetails(Result.data.PageData[0]._id);
      }
      else
      {
        SetInBoxList([]);
        OpenMessageDetails([]);
      }
    });
  };
  // End Get InBoxList

  //Start Open Message Details
  const OpenMessageDetails = (ID) => {
    var Data = {
      _id: ID,
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGetByID",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetOpenMessageDetails(Result.data.Data);
      }
      else {
        SetOpenMessageDetails('');
      }
    });
  };
  //End Open Message Details

  // start PopModel Open and Close and Delete Message
  const OpenDeletePopModel = () => {
    SetDeletePopModel(true);
  }
  const CloseDeletePopModel = () => {
    SetDeletePopModel(false);
  }
  const DeleteMessage = (ID) => {
    if (ID != '') {
      var DeleteArray = []
      DeleteArray.push(ID)
      var Data = {
        IDs: DeleteArray,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          CloseDeletePopModel();
          OpenMessageDetails('')
          GetInBoxList();
          if (SelectedDropdownList.some(sl => sl?._id === ID)) {
            SetSelectedDropdownList(SelectedDropdownList.filter(sl => sl?._id !== ID))
          }
        }
      });
    }
  }
  // End PopModel Open and Close And Delete Message

  // Start Delete All Message 
  const OpenAllDeletePopModel = () => {
    if (InboxChecked.length > 0) {
      SetAllDeletePopModel(true);
    }
  }
  const CloseAllDeletePopModel = () => {
    SetAllDeletePopModel(false);
  }
  const DeleteAllMessage = () => {
    if (InboxChecked.length > 0) {
      var Data = {
        IDs: InboxChecked,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          CloseAllDeletePopModel();
          OpenMessageDetails('')
          GetInBoxList();
          SetSelectedDropdownList(null);
        }
      });
    }
  }
  // End Delete All Message 

  // Start Update Star Message and model open and close
  const OpenStarPopModel = () => {
    SetStarPopModel(true);
  }
  const CloseStarPopModel = () => {
    SetStarPopModel(false);
  }
  const UpdateStarMessage = (ID) => {
    if (ID != '') {
      //setSelected(true);
      var Data = {
        _id: ID,
        IsStarred: true,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryUpdate",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          CloseStarPopModel();
          OpenMessageDetails('')
          GetInBoxList();
        }
      });
    }
  }
  // End Update Star Message and model open and close

  // Start CheckBox Code
  const InBoxCheckBox = (e) => {
    var UpdatedList = [...InboxChecked];
    if (e.target.checked) {
      UpdatedList = [...InboxChecked, e.target.value];
    } else {
      UpdatedList.splice(InboxChecked.indexOf(e.target.value), 1);
    }
    SetInboxChecked(UpdatedList);
  }
  const SeleactAllInBoxCheckBox = (e) => {
    if (e.target.checked) {
      SetSelectAllCheckbox(true);
      SetInboxChecked(InBoxList.map(item => item._id));
    } else {
      SetSelectAllCheckbox(false);
      SetInboxChecked([]);
    }

  }
  // End CheckBox Code

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetSearchInbox(e.target.value)
    }
  }
  // End Search

  const RefreshPage = () => {
    SetSelectAllCheckbox(false);
    SetSearchInbox('');
    SetInboxChecked([]);
  }

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

  const HandleToggle = (Value) => () => {
    const CurrentIndex = Checked.indexOf(Value);
    const NewChecked = [...Checked];
    if (CurrentIndex === -1) {
      NewChecked.push(Value);
    } else {
      NewChecked.splice(CurrentIndex, 1);
    }
    SetChecked(NewChecked);
  };

  const WrapperRef = useRef(null);
  UseOutSideAlerter(WrapperRef);




  return (
    <>
      <HeaderTop />

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
                you want to delete a email.
              </Typography>
            </div>
            <div className='d-flex btn-50'>
              <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteMessage(OpenMessage._id); }}>
                Yes
              </Button>
              <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseDeletePopModel(); }}>
                No
              </Button>
            </div>
          </Box>
        </Modal>

        <Modal className="modal-pre"
          open={AllDeletePopModel}
          onClose={CloseAllDeletePopModel}
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
                you want to delete a all email.
              </Typography>
            </div>
            <div className='d-flex btn-50'>
              <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteAllMessage(); }}>
                Yes
              </Button>
              <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseAllDeletePopModel(); }}>
                No
              </Button>
            </div>
          </Box>
        </Modal>

        <Modal className="modal-pre"
          open={StarPopModel}
          onClose={CloseStarPopModel}
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
                you want to Star a email.
              </Typography>
            </div>
            <div className='d-flex btn-50'>
              <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateStarMessage(OpenMessage._id); }}>
                Yes
              </Button>
              <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseStarPopModel(); }}>
                No
              </Button>
            </div>
          </Box>
        </Modal>

        <Modal className="modal-pre"
          open={Open}
          onClose={HandleClose}
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
                Are you sure  for move this E-mail into Other Inbox ?
              </Typography>
            </div>
            <div className='d-flex btn-50'>
              <Button className='btn btn-pre' variant="contained" size="medium">
                Yes
              </Button>
              <Button className='btn btn-darkpre' variant="contained" size="medium">
                No
              </Button>
            </div>
          </Box>
        </Modal>


        <Modal className="modal-pre"
          open={OpenOne}
          onClose={HandleCloseOne}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={Style} className="modal-prein">
            <div className='px-5 pt-5 text-center'>
              <img src={Emailcall} width="130" className='mb-4' />
              <Typography id="modal-modal-title" variant="b" component="h6">
                Follow Up Later
              </Typography>
            </div>
            <div className='px-5 pb-5 text-left datepikclen'>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Choose date for follow up later.
              </Typography>
              <div className="pt-3">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={0}>
                    <DesktopDatePicker
                      inputFormat="MM/dd/yyyy"
                      value={Value}
                      onChange={handleChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
            </div>
            <div className='d-flex btn-50'>
              <Button className='btn btn-pre' variant="contained" size="medium">
                Ok
              </Button>
              <Button className='btn btn-darkpre' variant="contained" size="medium">
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>

      </div>

      <div className='bodymain'>
        <Row className='mb-columfull'>
          <Col className='maxcontainerix'>
            <div className='px-0 py-4 leftinbox'>
              <div className='px-3'>
                <Row>
                  <Col sm={9}> <h3 className='title-h3'>Other Inbox</h3> </Col>
                  <Col sm={3}>
                    <div className="inboxnoti">
                      <NotificationsIcon />
                      {SelectedDropdownList?.length}
                    </div>
                  </Col>
                </Row>
                <Row className='my-3'>
                  <Col>
                    <div className='textbox-dek serchdek'>
                      <Search onKeyUp={(e) => SearchBox(e, this)}>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={8}>
                    <div class="selecter-m inboxtype">
                      <a href="#" className="selectorall" onClick={AddInboxClass}>
                        All <img src={downarrow} />
                      </a>
                      <div className="userdropall" id="id_userboxlist" ref={WrapperRef}>
                        <div className="bodyuserdop textdeclist">
                          <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {InBoxList?.map((item) => { // dropdown list
                              const labelId = `checkbox-list-secondary-label-${item._id}`;
                              return (
                                <ListItem className='droplistchec'
                                  key={item._id}
                                  secondaryAction={
                                    <Checkbox
                                      // defaultChecked
                                      // edge="end"
                                      // onChange={handleToggle(item._id)}
                                      // checked={checked.indexOf(item._id) !== -1}
                                      onChange={() => HandleDropdownListCheckbox(item)}
                                      checked={SelectedDropdownList?.some(sl => sl?._id === item?._id)}
                                      inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                  }
                                  disablePadding
                                >
                                  <ListItemButton>
                                    <ListItemAvatar>

                                      <ListItemAvatar className="scvar">
                                        <Avatar alt="Remy Sharp" src={inboxuser1} />
                                      </ListItemAvatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={item.FromName}
                                      secondary={
                                        <React.Fragment>
                                          {item.FromEmail}
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={4} align='right'>
                    <ButtonGroup variant="text" aria-label="text button group">
                      <Button className='iconbtn' variant="contained" size="large" onClick={RefreshPage}>
                        <RefreshIcon />
                      </Button>
                      <Button className='iconbtn' variant="contained" size="large" onClick={OpenAllDeletePopModel}>
                        <DeleteIcon />
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="mt-3">
                    <FormGroup>
                      <FormControlLabel control={<Checkbox defaultChecked={SelectAllCheckbox} onChange={SeleactAllInBoxCheckBox} />} label="Select All" />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <div className='listinbox mt-3'>
                <scrollbars>
                  <Stack spacing={1} align="left">
                    {SelectedDropdownList?.map((row) => (  // datalist
                      <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id)}>
                        <Row>
                          <Col xs={1} className="pr-0">
                            <FormControlLabel control={<Checkbox defaultChecked={InboxChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
                          </Col>
                        </Row>
                        <Col xs={11} className="pr-0">
                          <Row>
                            <Col xs={2}>
                              <span className="inboxuserpic">
                                <img src={inboxuser1} width="55px" alt="" />
                              </span>
                            </Col>
                            <Col xs={8}>
                              <h4>{row.FromEmail}</h4>
                              <h3>{row.Subject}</h3>
                            </Col>
                            <Col xs={2} className="pl-0">
                              <h6>{Moment(new Date(row.MessageDatetime).toDateString()).format("h:mm a")}</h6>
                              <ToggleButton className='startselct' value="check" selected={StarSelected} onClick={() => UpdateStarMessage(row._id)}>
                                <StarBorderIcon className='starone' />
                                <StarIcon className='selectedstart startwo' />
                              </ToggleButton>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={2} className='ja-center'>
                              <div className='attachfile'>
                                <input type="file" />
                                <AttachFileIcon />
                              </div>
                            </Col>
                            <Col xs={10}>
                              <p>{row.Snippet}</p>
                            </Col>
                          </Row>
                        </Col>
                      </Item>
                    ))}
                  </Stack>
                </scrollbars>
              </div>
            </div>
          </Col>
          <Col className='rightinbox'>
            <div className='inxtexteditor'>
              <Row className='bt-border pb-4 mb-4 colsm12'>
                <Col lg={6}>
                  <Row className='userlist'>
                    <Col xs={2}>
                      <span className="inboxuserpic">
                        <img src={inboxuser3} width="63px" alt="" />
                      </span>
                    </Col>
                    <Col xs={10} className='p-0'>
                      <h5>{OpenMessage.FromName}</h5>
                      <h6>to me <KeyboardArrowDownIcon /></h6>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} Align="right">
                  <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group">
                    <Button onClick={HandleOpen}>
                      <img src={iconleftright} />
                    </Button>
                    <Button onClick={HandleOpenOne}>
                      <label>56 / 100</label>
                    </Button>
                    <Button onClick={OpenStarPopModel}>
                      <img src={iconstar} />
                    </Button>
                    <Button>
                      <img src={icontimer} />
                    </Button>
                    <Button>
                      <img src={iconsarrow2} />
                    </Button>
                    <Button>
                      <img src={iconsarrow1} />
                    </Button>
                    {<Button onClick={OpenDeletePopModel}>
                      <img src={icondelete} />
                    </Button>}
                    <Button>
                      <img src={iconmenu} />
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Row className='mb-3'>
                <Col>
                  <h2>{OpenMessage.Subject} </h2>
                </Col>
                <Col>
                  <h6>{Moment(new Date(OpenMessage.MessageDatetime).toDateString()).format("MMMM Do YYYY, h:mm:ss a")}</h6>
                </Col>
              </Row>
              <Row>
                <Col>
                  {OpenMessage == 0 ? '' : parse(OpenMessage.HtmlBody)}
                </Col>
              </Row>
              <div className='d-flex mt-5 ml-2'>
                <Row>
                  <Col sm={6} className='p-0'>
                    <a href='#' className='p-2'><img src={iconsarrow1} /></a>
                  </Col>
                  <Col sm={6} className='p-0'>
                    <a href='#' className='p-2'><img src={iconsarrow2} /></a>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Compose />

    </>
  );
}