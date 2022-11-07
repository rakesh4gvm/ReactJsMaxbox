import React, { useRef, useState, useEffect } from 'react';
import Axios from "axios";
import Moment from "moment";

import { styled, alpha } from '@mui/material/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import DraftComposePage from "../DraftComposePage/DraftComposePage"
import AddDraftPage from "../AddDraftPage/AddDraftPage"

import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg';
import Iconsedit from '../../images/icons/icons-edit.svg';
import Emailinbox from '../../images/email_inbox_img.png';
import { Col, Row } from 'react-bootstrap';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import parse from "html-react-parser";
import { GetUserDetails, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import defaultimage from '../../images/default.png';
import InfiniteScroll from "react-infinite-scroll-component";
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Tooltip from "@material-ui/core/Tooltip";
import timermenu from '../../images/icons/timermenu.svg';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function UseOutSideAlerter(Ref) {
  useEffect(() => {
    function HandleClickOutside(Event) {
      if (Ref.current && !Ref.current.contains(Event.target)) {
        const Element = document.getElementById("Userdropshow")
        Element.classList.remove("show");
      }
    }
    document.addEventListener("mousedown", HandleClickOutside);
    return () => {
      document.removeEventListener("mousedown", HandleClickOutside);
    };
  }, [Ref]);
}

export default function DraftsPage() {
  const [DraftList, SetDraftList] = React.useState([]);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [SortField, SetSortField] = React.useState("MailTo");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [AllDeletePopModel, SetAllDeletePopModel] = React.useState(false);
  const [InboxChecked, SetInboxChecked] = React.useState([]);
  const [SelectAllCheckbox, SetSelectAllCheckbox] = React.useState(false);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [ResponseData, SetResponseData] = useState([])
  const [TotalCount, SetTotalCount] = React.useState(0);
  const [HasMore, SetHasMore] = useState(true)

  useEffect(() => {
    document.title = 'Draft | MAXBOX';
    GetClientID();
  }, [SearchInbox]);

  // Get ClientID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    GetDraftList(UserDetails.ClientID, UserDetails.UserID, Page, "");
    // if (ResponseData.length <= 10) {
    //   SetHasMore(false)
    // }
  }
  const SetHasMoreData = (arr) => {
    if (arr.length === 0) {
      SetHasMore(false)
    } else if (arr.length <= 9) {
      SetHasMore(false)
    } else if (arr.length === 10) {
      SetHasMore(true)
    }
  }

  // Start Get Draft List
  const GetDraftList = (CID, UID, PN, Str) => {

    var Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetResponseData(Result.data.PageData)
          SetHasMoreData(Result.data.PageData)
          // SetDraftList([...DraftList, ...Result.data.PageData]);
          if (Str === "scroll") {
            SetDraftList([...DraftList, ...Result.data.PageData]);
          } else {
            SetDraftList(Result.data.PageData);
          }
          OpenMessageDetails(Result.data.PageData[0]._id);
          SetMailNumber(1)
          LoaderHide()
        }
        else {
          SetResponseData([])
          SetHasMoreData(Result.data.PageData)
          if (DraftList && DraftList?.length > 1) {
            SetDraftList([...DraftList]);
            let LastElement = DraftList?.slice(-1)
            OpenMessageDetails(LastElement[0]?._id, 0);
          } else {
            OpenMessageDetails('');
            SetDraftList([]);
          }
          LoaderHide()
          if (OpenMessage == "") {
            toast.error(<div>Drafts <br />No Data.</div>)
          }
        }
        GetTotalRecordCount(CID, UID);
      }
      else {
        SetDraftList([]);
        OpenMessageDetails('');
        toast.error(Result?.data?.Message);
      }
    });
  };
  // End Get Draft List

  //Start Open Message Details
  const OpenMessageDetails = (ID, index) => {

    // if (ID != '') {
    //   SetMailNumber(index + 1)
    // }

    if (ID != "") {

      SetMailNumber(index + 1)

      var Data = {
        _id: ID,
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {

        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data != "" && Result.data.Data != null && Result.data.Data != undefined) {
            SetOpenMessageDetails(Result.data.Data);
          } else {
            SetDraftList([])
            SetOpenMessageDetails([]);
          }
        }
        else {
          SetOpenMessageDetails('');
          toast.error(Result?.data?.Message);
        }
      });
    }

  }
  //End Open Message Details


  // Start PopModel Open and Close and Delete Message
  const OpenDeletePopModel = () => {
    SetDeletePopModel(true);
  }
  const CloseDeletePopModel = () => {
    SetDeletePopModel(false);
  }
  const DeleteMessage = (ID) => {
    debugger
    if (ID != '') {
      var DeleteArray = []
      DeleteArray.push(ID)
      var Data = {
        IDs: DeleteArray,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Draft <br />Draft template deleted successfully.</div>);
          CloseDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          GetDraftList(ClientID, UserID, Page, "");
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End PopModel Open and Close And Delete Message

  // Start Delete All Message 
  const OpenAllDeletePopModel = () => {
    if (InboxChecked.length > 0) {
      SetAllDeletePopModel(true);
    } else {
      toast.error("Please select atleast one email.")
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
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Draft <br />Draft template deleted successfully.</div>);
          CloseAllDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          GetDraftList(ClientID, UserID, Page, "");
          SetSelectAllCheckbox(false);
          SetInboxChecked([]);
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Delete All Message 

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
      SetInboxChecked(DraftList.map(item => item._id));
    } else {
      SetSelectAllCheckbox(false);
      SetInboxChecked([]);
    }
  }
  // End CheckBox Code

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetPage(1);
      SetRowsPerPage(10);
      SetDraftList([])
      SetSearchInbox(e.target.value)
    }
  }
  // End Search

  // Refresh Page
  const RefreshPage = () => {
    LoaderShow()
    SetPage(1);
    SetRowsPerPage(10);
    // SetDraftList([])
    SetSelectAllCheckbox(false);
    SetSearchInbox('');
    SetInboxChecked([]);
    GetDraftList(ClientID, UserID, Page, "");
  }

  // Get Total Total Record Count
  const GetTotalRecordCount = (CID, UID) => {

    const Data = {
      ClientID: CID,
      UserID: UID
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/draft_template/TotalRecordCount",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {

        if (Result.data.TotalCount >= 0) {
          SetTotalCount(Result.data.TotalCount);
        } else {
          SetTotalCount(0);
          toast.error(Result?.data?.Message);
        }

      }
    })
  }


  /* start navcode */

  const NavBarClick = () => {
    const element = document.getElementById("navclose")
    if (element.classList.contains("opennav")) {
      element.classList.remove("opennav");
    }
    else {
      element.classList.add("opennav");
    }
  }
  /* end code*/

  /* start navcode */

  const Userdropdown = () => {
    const element = document.getElementById("Userdropshow")
    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }
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
  /* end code*/

  // Fetch More Data
  const FetchMoreData = async () => {
    SetPage(Page + 1);
    await GetDraftList(ClientID, UserID, Page + 1, "scroll")

  };

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

  const WrapperRef = useRef(null);
  UseOutSideAlerter(WrapperRef);

  return (
    <>
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
                you want to delete selected email ?
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
          <Col className='maxcontainerix' id="navclose">
            <div className='closeopennav'>
              <a className='navicons m-4' onClick={(NavBarClick)}><ArrowRight /></a>
              <Tooltip title="Follow Up Later"><a className='m-4'><img src={timermenu} /></a></Tooltip>
            </div>
            <div className='navsmaller px-0 leftinbox'>
              <div className='px-3 bgfilter'>
                <Row>
                  {/* <Col sm={9}> <h3 className='title-h3'>Draft</h3> </Col> */}
                  <Col sm={9}><a className='navicons mr-2' onClick={(NavBarClick)}><ArrowLeft /></a> <h3 className='title-h3'>Draft</h3> </Col>
                  <Col sm={3}>
                    <div className="inboxnoti">
                      <NotificationsIcon />
                      {TotalCount}
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
                          defaultValue={SearchInbox}
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {/* <Col xs={8}>
                    <div class="selecter-m inboxtype">
                      <a href="#" className="selectorall" onClick={FromEmailList}>
                        All <img src={downarrow} />
                      </a>
                      <div className="userdropall" id="id_userboxlist" ref={WrapperRef}>
                        <div className="bodyuserdop textdeclist">

                          <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {FromEmailDropdownList?.map((item, index) => {
                              const labelId = `checkbox-list-secondary-label-${index}`;
                              return (
                                <ListItem className='droplistchec'
                                  key={index}
                                  secondaryAction={
                                    <Checkbox onChange={FromEmailDropdownListCheckbox}
                                      value={item._id}
                                      checked={FromEmailDropdownListChecked?.find(x => x === item?._id)}
                                      inputProps={{ 'aria-labelledby': labelId }} />
                                  }
                                  disablePadding
                                >
                                  <ListItemButton>
                                    <ListItemAvatar>
                                      <ListItemAvatar className="scvar">
                                        <Avatar alt="Remy Sharp" src={inboxuser1} />
                                      </ListItemAvatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={item.FirstName} secondary={<React.Fragment>{item.Email}</React.Fragment>}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </div>
                      </div>
                    </div>
                  </Col> */}
                  <Col xs={4} align='right'>
                    <ButtonGroup variant="text" aria-label="text button group">
                      <Button className='iconbtn' variant="contained" size="large" onClick={RefreshPage} title="Refresh" >
                        <RefreshIcon />
                      </Button>
                      <Button className='iconbtn' variant="contained" size="large" onClick={OpenAllDeletePopModel} title="All Delete">
                        <DeleteIcon />
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="mt-3">
                    <FormGroup>
                      <FormControlLabel control={<Checkbox checked={SelectAllCheckbox} onChange={SeleactAllInBoxCheckBox} />} label="Select All" />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              {
                DraftList?.length === 0 ?
                  <div id="scrollableDiv" class="listinbox">
                    <InfiniteScroll
                      dataLength={DraftList?.length}
                      next={FetchMoreData}
                      hasMore={false}
                      loader={<h4></h4>}
                      scrollableTarget="scrollableDiv"
                    >
                    </InfiniteScroll>
                  </div>
                  :
                  DraftList?.length <= 9
                    ?
                    <div id="scrollableDiv" class="listinbox">
                      <InfiniteScroll
                        dataLength={DraftList?.length}
                        next={FetchMoreData}
                        hasMore={false}
                        loader={<h4></h4>}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                          <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                          </p>
                        }
                      >
                        <Stack spacing={1} align="left">
                          {DraftList?.length >= 1 && DraftList?.map((row, index) => (
                            <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id, index)}>
                              <Row>
                                <Col xs={1} className="pr-0">
                                  <FormControlLabel control={<Checkbox defaultChecked={InboxChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
                                </Col>

                                <Col xs={11}>
                                  <Row>
                                    <Col xs={2}>
                                      <span className="inboxuserpic">
                                        <img src={defaultimage} width="55px" alt="" />
                                      </span>
                                    </Col>
                                    <Col xs={8}>
                                      <h4>{row.Subject}</h4>
                                      <div className='small'> <p className='mb-0'><strong className='bold400'>To</strong>: {row.MailTo}</p></div>
                                    </Col>
                                    <Col xs={2} className="pl-0">
                                      <h6>
                                        {
                                          Moment(row.CreatedDate).format("DD/MM/YYYY") === Moment().format("DD/MM/YYYY")
                                            ? Moment(row.CreatedDate).format("LT")
                                            : Moment(row.CreatedDate).format("DD/MM/YYYY")
                                        }
                                      </h6>
                                      <h5 className='draftext'>Draft</h5>
                                    </Col>
                                  </Row>
                                  <Row>
                                    {/* <Col xs={2} className='ja-center'>
                                      <div className='attachfile'>
                                        <input type="file" />
                                        <AttachFileIcon />
                                      </div>
                                    </Col> */}
                                    <Col xs={10}>
                                      <p>{parse(row.Body)}</p>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Item>
                          ))}
                        </Stack>
                      </InfiniteScroll>
                    </div>
                    :
                    <div id="scrollableDiv" class="listinbox mt-3">
                      <InfiniteScroll
                        dataLength={DraftList?.length}
                        next={FetchMoreData}
                        hasMore={HasMore}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                          <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                          </p>
                        }
                      >
                        <Stack spacing={1} align="left">
                          {DraftList?.length > 1 && DraftList?.map((row, index) => (
                            <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id, index)}>
                              <Row>
                                <Col xs={1} className="pr-0">
                                  <FormControlLabel control={<Checkbox defaultChecked={InboxChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
                                </Col>
                                <Col xs={11}>
                                  <Row>
                                    <Col xs={2}>
                                      <span className="inboxuserpic">
                                        <img src={defaultimage} width="55px" alt="" />
                                      </span>
                                    </Col>
                                    <Col xs={8}>
                                      <h4>{row.Subject}</h4> 
                                      <div className='small'> <p className='mb-0'><strong className='bold400'>To</strong>: bhumit@gmail.com</p></div>
                                    </Col>
                                    <Col xs={2} className="pl-0">
                                      <h6>
                                        {
                                          Moment(row.CreatedDate).format("DD/MM/YYYY") === Moment().format("DD/MM/YYYY")
                                            ? Moment(row.CreatedDate).format("LT")
                                            : Moment(row.CreatedDate).format("DD/MM/YYYY")
                                        }
                                      </h6>
                                      <h5 className='draftext'>Draft</h5>
                                    </Col>
                                  </Row>
                                  <Row>
                                    {/* <Col xs={2} className='ja-center'>
                                      <div className='attachfile'>
                                        <input type="file" />
                                        <AttachFileIcon />
                                      </div>
                                    </Col> */}
                                    <Col xs={10}>
                                      <p>{parse(row.Body)}</p>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Item>
                          ))}
                        </Stack>
                      </InfiniteScroll>
                    </div>
              }

            </div>
          </Col>
          <Col className='rightinbox'>
            <div className='inxtexteditor'>
              <Row className='bt-border pb-4 mb-4 colsm12'>
                <Col lg={6}>
                  <Row className='userlist'>
                    <Col xs={2}>
                      {
                        OpenMessage == 0 ? ''
                          :
                          <span className="inboxuserpic">
                            <img src={defaultimage} width="63px" alt="" />
                          </span>
                      }
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} Align="right">
                  {
                    OpenMessage == 0 ? ''
                      :
                      <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group">
                        {/* <Button onClick={HandleOpen}>
                      <img src={iconleftright} />
                    </Button> */}
                        <Button>
                          <label>{MailNumber} / {DraftList.length}</label>
                        </Button>
                        {<Button onClick={OpenDeletePopModel}>
                          <img src={icondelete} title={"Delete"} />
                        </Button>}
                        {/* <Button>
                          <img src={iconmenu} />
                        </Button> */}
                      </ButtonGroup>
                  }
                </Col>
              </Row>
              <Row className='mb-3'>
                <Col>
                  <h2>{OpenMessage == 0 ? '' : OpenMessage.Subject} </h2>
                </Col>
                <Col>
                  <h6>{OpenMessage == 0 ? '' : Moment(OpenMessage.CreatedDate).format("LLL")}</h6>
                </Col>
              </Row>
              <Row>
                <Col>
                  {OpenMessage == 0 ? '' : parse(OpenMessage.Body)}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      <DraftComposePage GetDraftList={GetDraftList} />
      <AddDraftPage GetDraftList={GetDraftList} />

    </>
  );


}