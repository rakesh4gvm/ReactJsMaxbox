
import React, { useRef, useState, useEffect } from 'react';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import Compose from '../ComposePage/ComposePage';
import Axios from "axios";
import parse from "html-react-parser";
import moment from "moment";
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
import inboxuser1 from '../../images/avatar/1.jpg';
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

function useOutsideAlerter(ref) {
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
const addInboxClass = () => {
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
  const [StarSelected, setStarSelected] = React.useState(false);
  const handleChange = (newValue) => {
    setValue(newValue);
  };


  const [ResultData, SetResultData] = useState([]);
  const [UnansweredResponsesList, SetUnansweredResponsesList] = React.useState([]);
  const [UnansweredResponsesChecked, setUnansweredResponsesChecked] = React.useState([]);
  const [DeletePopModel, setDeletePopModel] = React.useState(false);
  const [AllDeletePopModel, SetAllDeletePopModel] = React.useState(false);
  const [StarPopModel, SetStarPopModel] = React.useState(false);
  // const [InboxChecked, SetInboxChecked] = React.useState([]);

  const [Items, SetItems] = useState([]);
  const [SelectedDropdownList, SetSelectedDropdownList] = useState([]);
  const [SelectAllCheckbox, SetSelectAllCheckbox] = React.useState(false);
  const [SearchInbox, SetSearchInbox] = React.useState("");

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [sortField, setsortField] = React.useState("FromEmail");
  const [sortedBy, setsortedBy] = React.useState(1);
  const [ClientID, setClientID] = React.useState(0);
  const [UserID, SetClientID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [checked, setChecked] = React.useState([1]);

  useEffect(() => {

    if (UnansweredResponsesList?.length > 0) SetSelectedDropdownList(UnansweredResponsesList)
    GetClientID()
    GetUnansweredResponcesList();
  }, [SearchInbox, ClientID, UnansweredResponsesList?.length, Items]);

  // Get ClientID
  const GetClientID = () => {
    const ClientId = localStorage.getItem("ClientID")
    SetClientID(JSON.parse(ClientId)?._id)
  }

  // Start Get UnansweredResponsesList
  const GetUnansweredResponcesList = () => {
    var data = {
      Page: page,
      RowsPerPage: rowsPerPage,
      sort: true,
      Field: sortField,
      Sortby: sortedBy,
      Search: SearchInbox,
      ClientID: ClientID,
      UserID: UserID,
      PageName: "unanswered"
    };
    const responseapi = Axios({
      url: CommonConstants.MOL_APIURL + "/inbox_option/ReceiveEmailHistoryGetByUserPage",
      method: "POST",
      data: data,
    });
    responseapi.then((result) => {

      if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetUnansweredResponsesList(result.data.PageData);
        SetResultData(result.data.ResultObjData);
        OpenMessageDetails(result.data.PageData[0]._id);
      }


    });
  };
  // End Get UnansweredResponsesList 





  // Handle Dropdown List Checkbox
  const HandleDropdownListCheckbox = (Item) => {
    console.log("Item=======", Item)

    if (SelectedDropdownList.some(sl => sl?._id === Item?._id)) {
      const DropdownFilter = SelectedDropdownList.filter(sl => sl?._id !== Item?._id)
      if (DropdownFilter.length > 0) {
        SetItems(DropdownFilter)
      }
      console.log("DropdownFilter=======", DropdownFilter)
      SetSelectedDropdownList(DropdownFilter)
    } else {
      SetSelectedDropdownList([...SelectedDropdownList, Item])
    }
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

  const options = [
    { value: 'Primary', label: 'Primary' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const CloseDeletePopModel = () => {
    setDeletePopModel(false);
  }



  const DeleteMessage = (ID) => {

    if (ID != '') {
      var DeleteArray = []
      DeleteArray.push(ID)
      var data = {
        IDs: DeleteArray,
        LastUpdatedBy: -1
      };
      const responseapi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryDelete",
        method: "POST",
        data: data,
      });
      responseapi.then((result) => {
        if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
          CloseDeletePopModel();
          OpenMessageDetails('')
          GetUnansweredResponcesList();
        }
      });
    }
  }
  //Start Open Message Details
  const OpenMessageDetails = (ID) => {

    var data = {
      _id: ID,
    };
    const responseapi = Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGetByID",
      method: "POST",
      data: data,
    });
    responseapi.then((result) => {
      if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetOpenMessageDetails(result.data.Data);
      }
      else {
        SetOpenMessageDetails('');
      }
    });

  };
  //End Open Message Details

  // start PopModel Open and Close and Delete Message
  const OpenDeletePopModel = () => {
    setDeletePopModel(true);
  }

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
    var updatedList = [...UnansweredResponsesChecked];
    if (e.target.checked) {
      updatedList = [...UnansweredResponsesChecked, e.target.value];
    } else {
      updatedList.splice(UnansweredResponsesChecked.indexOf(e.target.value), 1);
    }
    setUnansweredResponsesChecked(updatedList);
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
      const responseapi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      responseapi.then((Result) => {
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
  //Page Refresh
  const RefreshPage = () => {
    SetSelectAllCheckbox(false);
    SetSearchInbox('');
    setUnansweredResponsesChecked([]);
    window.location.reload(true);
  }

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
                      {UnansweredResponsesList.length}
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
                      <a href="#" className="selectorall" onClick={addInboxClass}>
                        All <img src={downarrow} />
                      </a>

                      <div className="userdropall" id="id_userboxlist">
                        <div className="bodyuserdop textdeclist">
                          <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {ResultData?.map((item) => { // dropdown list

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
                      <FormControlLabel control={<Checkbox defaultChecked={SelectAllCheckbox} onChange={SeleactAllUnansweredResponsesCheckBox} />} label="Select All" />
                    </FormGroup>
                  </Col>
                </Row>
              </div>

              <div className='listinbox mt-3'>
                <scrollbars>
                  <Stack spacing={1} align="left">
                    {UnansweredResponsesList.map((row, index) => (
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
                                <h6>{moment(new Date(row.MessageDatetime).toDateString()).format("h:mm a")}</h6>
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
                    <Button onClick={handleOpen}>
                      <img src={iconleftright} />
                    </Button>
                    <Button onClick={handleOpenOne}>
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
                  <h6>{moment(new Date(OpenMessage.MessageDatetime).toDateString()).format("MMMM Do YYYY, h:mm:ss a")}</h6>
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