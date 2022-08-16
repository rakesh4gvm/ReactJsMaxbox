import React, { useRef, useState, useEffect } from 'react';
import Axios from "axios";
import Moment from "moment";

import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/material';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NotificationsIcon from '@material-ui/icons/Notifications';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import downarrow from '../../images/icon_downarrow.svg';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';

import { ButtonGroup, Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import Compose from '../ComposePage/ComposePage';
import parse from "html-react-parser";
import inboxuser1 from '../../images/avatar/1.jpg';
import inboxuser2 from '../../images/avatar/2.jpg';
import inboxuser3 from '../../images/avatar/3.jpg';
import inboxuser4 from '../../images/avatar/4.jpg';
import inboximg1 from '../../images/inboximg1.jpg';
import inboximg2 from '../../images/inboximg2.jpg';
import iconleftright from '../../images/icon_left_right.svg';
import iconstar from '../../images/icon_star.svg';
import icontimer from '../../images/icon_timer.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg';
import replyall from '../../images/icons/reply_all.svg';
import attachment from '../../images/icons/attachment.svg';
import text_font from '../../images/icons/text_font.svg';
import image_light from '../../images/icons/image_light.svg';
import smiley_icons from '../../images/icons/smiley_icons.svg';
import signature from '../../images/icons/signature.svg';
import link_line from '../../images/icons/link_line.svg';
import google_drive from '../../images/icons/google_drive.svg';
import Emailinbox from '../../images/email_inbox_img.png';
import Emailcall from '../../images/email_call_img.png';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails } from "../../_helpers/Utility";


function UseOutsideAlerter(ref) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        const element = document.getElementById("id_userboxlist")
        element.classList.remove("show");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
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

export default function UnansweredResponsesPage() {
  const [Value, SetValue] = React.useState(new Date('2014-08-18T21:11:54'));
  const [StarSelected, setStarSelected] = React.useState(false);
  const [UnansweredResponsesList, SetUnansweredResponsesList] = React.useState([]);
  const [UnansweredResponsesChecked, setUnansweredResponsesChecked] = React.useState([]);
  const [DeletePopModel, setDeletePopModel] = React.useState(false);
  const [AllDeletePopModel, SetAllDeletePopModel] = React.useState(false);
  const [StarPopModel, SetStarPopModel] = React.useState(false);
  const [Items, SetItems] = useState([]);
  const [SelectAllCheckbox, SetSelectAllCheckbox] = React.useState(false);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [Page, setPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SortField, SetsortField] = React.useState("FromEmail");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [Checked, SetChecked] = React.useState([1]);
  const [Open, SetOpen] = React.useState(false);
  const [OpenOne, SetOpneOne] = React.useState(false);
  const [SelectedDropdownList, SetSelectedDropdownList] = useState([]);

  useEffect(() => {
    if (UnansweredResponsesList?.length > 0) SetSelectedDropdownList(UnansweredResponsesList)
    GetClientID()
    GetUnansweredResponcesList();
  }, [SearchInbox, ClientID, UnansweredResponsesList?.length, Items]);

  const HandleOpen = () => SetOpen(true);
  const HandleClose = () => SetOpen(false);
  const HandleOpenOne = () => SetOpneOne(true);
  const HandleCloseOne = () => SetOpneOne(false);

  // Start Handle Dropdown List Checkbox
  const HandleDropdownListCheckbox = (Item) => {
    if (SelectedDropdownList.some(sl => sl?._id === Item?._id)) {
      SetSelectedDropdownList(SelectedDropdownList.filter(sl => sl?._id !== Item?._id))
    } else {
      SetSelectedDropdownList([...SelectedDropdownList, Item])
    }
  }
  // End Handle Dropdown List Checkbox

  // Start Add Show Compose
  const AddShowCompose = () => {
    const Element = document.getElementById("UserCompose")
    if (Element.classList.contains("show")) {
      Element.classList.remove("show");
    }
    else {
      Element.classList.add("show");
    }
  };
  // End Add Show Compose

  // Start Handle Change
  const HandleChange = (NewValue) => {
    SetValue(NewValue);
  };
  // End Handle Change

  // Start Get ClientID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
  }
  // End Get ClientID

  // Start Get UnansweredResponsesList
  const GetUnansweredResponcesList = () => {

    let Data = {
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
        SetUnansweredResponsesList(Result.data.PageData);
        OpenMessageDetails(Result.data.PageData[0]._id);
      }
    });
  };
  // End Get UnansweredResponsesList 

  // Start Handle Toggle
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
  // End Handle Toggle

  // Start Close Delete Pop
  const CloseDeletePopModel = () => {
    setDeletePopModel(false);
  }
  // End Close Delete Pop

  // Start Delete Message
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
          GetUnansweredResponcesList();
        }
      });
    }
  }
  // End Delete Message

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

  // Start PopModel Open and Close and Delete Message
  const OpenDeletePopModel = () => {
    setDeletePopModel(true);
  }
  // End PopModel Open and Close and Delete Message

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
          GetUnansweredResponcesList();
        }
      });
    }
  }
  // End Update Star Message and model open and close

  // Start CheckBox Code
  const UnansweredResponcesCheckBox = (e) => {
    var UpdatedList = [...UnansweredResponsesChecked];
    if (e.target.checked) {
      UpdatedList = [...UnansweredResponsesChecked, e.target.value];
    } else {
      UpdatedList.splice(UnansweredResponsesChecked.indexOf(e.target.value), 1);
    }
    setUnansweredResponsesChecked(UpdatedList);
  }
  const SeleactAllUnansweredResponsesCheckBox = (e) => {
    if (e.target.checked) {
      SetSelectAllCheckbox(true);
      setUnansweredResponsesChecked(UnansweredResponsesList.map(item => item._id));
    } else {
      SetSelectAllCheckbox(false);
      setUnansweredResponsesChecked([]);
    }
  }
  // End CheckBox Code

  // Start Delete All Message 
  const OpenAllDeletePopModel = () => {
    if (UnansweredResponsesChecked.length > 0) {
      SetAllDeletePopModel(true);
    }
  }
  const CloseAllDeletePopModel = () => {
    SetAllDeletePopModel(false);
  }
  const DeleteAllMessage = () => {
    if (UnansweredResponsesChecked.length > 0) {
      var Data = {
        IDs: UnansweredResponsesChecked,
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
          GetUnansweredResponcesList();
        }
      });
    }
  }
  // End Delete All Message 

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetSearchInbox(e.target.value)
    }
  }
  // End Search

  // Start Page Refresh
  const RefreshPage = () => {
    SetSelectAllCheckbox(false);
    SetSearchInbox('');
    setUnansweredResponsesChecked([]);
  }
  // End Page Refresh

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

  const wrapperRef = useRef(null);
  UseOutsideAlerter(wrapperRef);

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
      </div>

      <div className='bodymain'>
        <Row className='mb-columfull'>
          <Col className='maxcontainerix'>
            <div className='px-0 py-4 leftinbox'>
              <div className='px-3'>
                <Row>
                  <Col sm={9}> <h3 className='title-h3'>Unanswered Responces</h3> </Col>
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

                      <div className="userdropall" id="id_userboxlist">
                        <div className="bodyuserdop textdeclist">
                          <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {UnansweredResponsesList?.map((item) => { // dropdown list

                              const labelId = `checkbox-list-secondary-label-${item._id}`;
                              return (
                                <ListItem className='droplistchec'
                                  key={item._id}
                                  secondaryAction={
                                    <Checkbox
                                      // defaultChecked
                                      // edge="end"
                                      // onChange={HandleToggle(item._id)}
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
                      <FormControlLabel control={<Checkbox defaultChecked={SelectAllCheckbox} onChange={SeleactAllUnansweredResponsesCheckBox} />} label="Select All" />
                    </FormGroup>
                  </Col>
                </Row>
              </div>

              <div className='listinbox mt-3'>
                <scrollbars>
                  <Stack spacing={1} align="left">
                    {SelectedDropdownList?.map((row, index) => (
                      <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id)}>
                        <Row>
                          <Col xs={1} className="pr-0">
                            <FormControlLabel control={<Checkbox defaultChecked={UnansweredResponsesChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={UnansweredResponcesCheckBox} />} label="" />
                            {/* <FormControlLabel control={<Checkbox />} label="" />  */}
                          </Col>
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
                        </Row>
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
                    <Button onClick={OpenDeletePopModel}>
                      <img src={icondelete} />
                    </Button>
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