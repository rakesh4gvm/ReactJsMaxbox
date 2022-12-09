import React, { useRef, useState, useEffect } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, IsGreaterDate } from "../../_helpers/Utility";
import Navigation from '../Navigation/Navigation';
import UnansweredResponsesComposePage from '../UnansweredResponsesCompose/UnansweredResponsesComposePage';
import UnansweredResponsesReplyPage from '../UnansweredResponsesReply/UnansweredResponsesReplyPage';
import UnansweredResponsesForwardPage from '../UnansweredResponsesReply/UnansweredResponsesForwardPage';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { styled, alpha } from '@material-ui/core/styles';

import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg';
import iconstar from '../../images/icon_star.svg';

import ToggleButton from '@mui/material/ToggleButton';
import StarIcon from '@material-ui/icons/Star';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Emailinbox from '../../images/email_inbox_img.png';
import Emailcall from '../../images/email_call_img.png';
import icontimer from '../../images/icon_timer.svg';
import inbox from '../../images/icons/inbox.svg';
import { Box } from '@material-ui/core';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function UnansweredResponsesPage(props) {

  const [FollowUpList, SetFollowUpList] = useState([])
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SortField, SetsortField] = React.useState("MessageDatetime");
  const [SortedBy, SetSortedBy] = React.useState(-1);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const StarhandleOpen = () => setOpen(true);
  const StarhandleClose = () => setOpen(false);
  const [FollowupPopModel, SetFollowupPopModel] = React.useState(false);
  const FollowupPopOpen = () => SetFollowupPopModel(true);
  const FollowupPopClose = () => SetFollowupPopModel(false);
  const [InboxhandleModel, SetInboxhandleModel] = React.useState(false);
  const InboxhandleOpen = () => SetInboxhandleModel(true);
  const InboxhandleClose = () => SetInboxhandleModel(false);
  const [FollowupDate, SetFollowupDate] = React.useState(new Date().toLocaleString());
  const [StarPopModel, SetStarPopModel] = React.useState(false);
  const [OtherInboxPopModel, SetOtherInboxPopModel] = React.useState(false);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);

  useEffect(() => {
    document.title = 'Unanswered Responses | MAXBOX';
    GetClientID();
  }, [SearchInbox])

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    if (props !== undefined) {
      const ID = props.location.state;
      if (ID != "" && ID != null && ID != "undefined") {
        GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, ID);
      } else {
        GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, 0)
      }
    }
  }

  // Start Get Follow Up Later List
  const GetUnansweredResponcesList = (CID, UID, PN, ID) => {
    let AccountIDs = []
    if (ID?.ID?.length > 0) {
      AccountIDs.push(ID?.ID)
    } else {
      AccountIDs = [-1]
    }
    var Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
      IsInbox: true,
      IsStarred: false,
      IsFollowUp: false,
      IsOtherInbox: false,
      IsSpam: false,
      AccountIDs: AccountIDs
    };
    LoaderShow()
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetFollowUpList(Result.data.PageData)
          OpenMessageDetails(Result.data.PageData[0]._id);
          SetMailNumber(1)
          LoaderHide()
        } else {
          SetFollowUpList([])
          SetOpenMessageDetails([]);
          LoaderHide()
        }
      }
    })
  }
  // End Get Follow Up Later List

  //Start Open Message Details
  const OpenMessageDetails = (ID, index) => {
    if (ID != '') {
      SetMailNumber(index + 1)
      var Data = {
        _id: ID,
      };
      LoaderShow()
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            SetOpenMessageDetails(Result.data.Data[0]);
            LoaderHide()
          } else {
            SetFollowUpList([])
            SetOpenMessageDetails([]);
            LoaderHide()
          }
        }
        else {
          SetOpenMessageDetails([]);
          LoaderHide()
        }
      });
    }
    else {
      SetOpenMessageDetails([]);
      LoaderHide()
    }
  };
  //End Open Message Details

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetPage(1);
      SetRowsPerPage(10);
      SetFollowUpList([])
      SetSearchInbox(e.target.value)
    }
  }
  // End Search

  // Start PopModel Open and Close and Delete Message
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
          toast.success(<div>Unanswered Responses <br />Delete mail successfully.</div>);
          CloseDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          if (props !== undefined) {
            const ID = props.location.state;
            if (ID != "" && ID != null && ID != "undefined") {
              GetUnansweredResponcesList(ClientID, UserID, Page, ID);
            } else {
              GetUnansweredResponcesList(ClientID, UserID, Page, 0)
            }
          }
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End PopModel Open and Close and Delete Message

  // Start Followup Message
  const OpenFollowupPopModel = () => {
    SetFollowupPopModel(true);
  }
  const CloseFollowupPopModel = () => {
    SetFollowupPopModel(false);
  }
  const SelectFollowupDate = (NewValue) => {
    SetFollowupDate(NewValue);
  };
  const UpdateFollowupMessage = (ID) => {
    const IsValidDate = Moment(FollowupDate).isValid()
    const IsGreater = IsGreaterDate(FollowupDate)

    if (ID != '') {
      if (FollowupDate != null) {
        if (IsValidDate & IsGreater) {
          var Data = {
            ID: ID,
            IsFollowUp: true,
            FollowupDate: FollowupDate,
            IsInbox: false,
            LastUpdatedBy: -1
          };
          const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/receive_email_history/FollowupUpdate",
            method: "POST",
            data: Data,
          });
          ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
              toast.success(<div>Unanswered Responses  <br />Follow up later updated successfully.</div>);
              CloseFollowupPopModel();
              OpenMessageDetails('')
              LoaderShow()
              if (props !== undefined) {
                const ID = props.location.state;
                if (ID != "" && ID != null && ID != "undefined") {
                  GetUnansweredResponcesList(ClientID, UserID, Page, ID);
                } else {
                  GetUnansweredResponcesList(ClientID, UserID, Page, 0)
                }
              }
            }
            else {
              toast.error(Result?.data?.Message);
            }
          });
        } else {
          toast.error(<div>Unanswered Responses <br />Please enter valid date.</div>)
        }
      } else {
        toast.error(<div>Unanswered Responses <br />Please enter date.</div>)
      }
    }
  }
  // End Followup Message

  // Start Update Star Message and model open and close
  const OpenStarPopModel = () => {
    SetStarPopModel(true);
  }
  const CloseStarPopModel = () => {
    SetStarPopModel(false);
  }
  const UpdateStarMessage = (ID) => {
    if (ID != '') {
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
          toast.success(<div>Unanswered Responses <br />Starred  updated successfully.</div>);
          CloseStarPopModel();
          OpenMessageDetails('')
          LoaderShow()
          if (props !== undefined) {
            const ID = props.location.state;
            if (ID != "" && ID != null && ID != "undefined") {
              GetUnansweredResponcesList(ClientID, UserID, Page, ID);
            } else {
              GetUnansweredResponcesList(ClientID, UserID, Page, 0)
            }
          }
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Update Star Message and model open and close

  // Start Other inbox Message and model open and close
  const OpenOtherInboxPopModel = () => {
    SetOtherInboxPopModel(true);
  }
  const CloseOtherInboxPopModel = () => {
    SetOtherInboxPopModel(false);
  }
  const UpdateOtherInbox = (ID) => {
    if (ID != '') {
      var Data = {
        _id: ID,
        IsOtherInbox: true,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryUpdate",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Unanswered Responses  <br />Other inbox updated successfully.</div>);
          CloseOtherInboxPopModel();
          OpenMessageDetails('')
          LoaderShow()
          if (props !== undefined) {
            const ID = props.location.state;
            if (ID != "" && ID != null && ID != "undefined") {
              GetUnansweredResponcesList(ClientID, UserID, Page, ID);
            } else {
              GetUnansweredResponcesList(ClientID, UserID, Page, 0)
            }
          }
        }
        else {
          CloseOtherInboxPopModel();
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Other inbox  Message and model open and close

  const [ReplyDetails, SetReplyDetails] = useState("")

  // start replay code
  // Open Compose
  const OpenComposeReply = (e) => {
    document.getElementById("To").value = ""
    document.getElementById("Subject").value = ""
    document.getElementById("CC").value = ""
    document.getElementById("BCC").value = ""

    const Data = {
      ID: OpenMessage._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetReplyMessageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetReplyDetails(Result?.data?.Data)
      } else {
        // toast.error(Result?.data?.Message);
      }
    })

    const element = document.getElementById("UserComposeReply")

    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }

    const elementreply = document.getElementById("UserCompose")
    elementreply.classList.remove("show");
    const elementreplytwo = document.getElementById("UserComposeForward")
    elementreplytwo.classList.remove("show");
  };
  // end replay code


  // start replay code
  // Open Compose
  const OpenComposeForward = (e) => {
    document.getElementById("To").value = ""
    document.getElementById("Subject").value = ""
    document.getElementById("CC").value = ""
    document.getElementById("BCC").value = ""

   

    const element = document.getElementById("UserComposeForward")

    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }

    const elementforward = document.getElementById("UserCompose")
    elementforward.classList.remove("show");

    const elementforwardtwo = document.getElementById("UserComposeReply")
    elementforwardtwo.classList.remove("show");
  };
  // end replay code

  return (

    <>

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
            {
              OpenMessage?.IsStarred === false ?
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  you want to Star an email ?
                </Typography>
                :
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  you want to UnStar an email ?
                </Typography>
            }
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
        open={FollowupPopModel}
        onClose={FollowupPopClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-prein">
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
                    value={FollowupDate}
                    onChange={SelectFollowupDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </div>
          </div>
          <div className='d-flex btn-50'>
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateFollowupMessage(OpenMessage._id); }}>
              Ok
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseFollowupPopModel(); }}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={OtherInboxPopModel}
        onClose={CloseOtherInboxPopModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-prein">
          <div className='p-5 text-center'>
            <img src={Emailinbox} width="130" className='mb-4' />
            <Typography id="modal-modal-title" variant="b" component="h6">
              Are you sure ?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure for move this E-mail into Other Inbox ?
            </Typography>
          </div>
          <div className='d-flex btn-50'>
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateOtherInbox(OpenMessage._id); }}>
              Yes
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseOtherInboxPopModel(); }}>
              No
            </Button>
          </div>
        </Box>
      </Modal>

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

      <div className='lefter'>
        <Navigation />
      </div>
      <div className='righter'>
        <header className='minisearchhed'>
          <Row>
            <Col sm={8}>
              <Search className='serchinbox' onKeyUp={(e) => SearchBox(e, this)}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  defaultValue={SearchInbox}
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Col>
          </Row>
        </header>
        <div className='bodyview' >
          <SplitPane
            split="horizontal "
            minSize={150}
            maxSize={-200}
            defaultSize={"40%"}
          >
            <div className="simulationDiv">
              <Table className='tablelister' sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell component="th" width={'30px'}><StarBorderIcon /></TableCell>
                    <TableCell component="th" width={'30px'}><AttachFileIcon /></TableCell>
                    <TableCell component="th">Subject</TableCell>
                    <TableCell component="th">From Email</TableCell>
                    <TableCell component="th">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {FollowUpList.map((item, index) => (
                    <TableRow className="SelectionSubject"
                      key={item.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      onClick={() => OpenMessageDetails(item._id, index)}
                    >
                      <TableCell width={'35px'}>
                        <ToggleButton title="Starred" className='startselct' value="check" selected={item.IsStarred} onClick={() => UpdateStarMessage(item._id)} >
                          <StarBorderIcon className='starone' />
                          <StarIcon className='selectedstart startwo' />
                        </ToggleButton>
                      </TableCell>
                      <TableCell width={'35px'}></TableCell>
                      <TableCell scope="row"> {item.Subject} </TableCell>
                      <TableCell>{item.FromEmail}</TableCell>
                      <TableCell>{Moment(item.MessageDatetime).format("DD/MM/YYYY")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="statisticsDiv">
              <div className='composehead px-3'>
                <Row>
                  <Col sm={6}>
                    <div className='lablebox'>
                      <label>
                        <b>From</b>
                        {OpenMessage.FromEmail}
                      </label>
                      <label><b>To</b>{OpenMessage.ToEmail}</label>
                      <label><b>Subject</b>{OpenMessage.Subject}</label>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className='lablebox text-right'>
                      <lable>{OpenMessage == 0 ? '' : Moment(OpenMessage.MessageDatetime).format("LLL")}</lable>
                    </div>
                    <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group">
                      <Button>
                        <label>{MailNumber} / {FollowUpList.length}</label>
                      </Button>
                      {/* <Button>
                        <a><img src={iconstar} title={"Starred"} onClick={StarhandleOpen} /></a>
                      </Button> */}
                      <Button>
                        <ToggleButton className='startselct' value="check" selected={OpenMessage.IsStarred} onClick={() => OpenStarPopModel()}>
                          <StarBorderIcon className='starone' />
                          <StarIcon className='selectedstart startwo' />
                        </ToggleButton>
                      </Button>
                      {/* <Button>
                        <a onClick={FollowupPopOpen}><img src={icontimer} /></a>
                      </Button> */}
                      <Button onClick={OpenFollowupPopModel}>
                        <img src={icontimer} title={"Follow Up Later"} />
                      </Button>
                      {/* <Button>
                        <a onClick={InboxhandleOpen}><img src={inbox} /></a>
                      </Button> */}
                      <Button onClick={OpenOtherInboxPopModel}>
                        <img src={inbox} title={"Other Inbox"} />
                      </Button>
                      <Button>
                        <a><img src={iconsarrow2} onClick={OpenComposeReply} /></a>
                      </Button>
                      <Button>
                        <a><img src={iconsarrow1} onClick={OpenComposeForward} /></a>
                      </Button>
                      {<Button onClick={OpenDeletePopModel}>
                        <img src={icondelete} title="Delete" />
                      </Button>}
                      <Button>
                        <a><img src={iconmenu} /></a>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </div>
              <div className='emailbodybox'>
                {OpenMessage == 0 ? '' : parse(OpenMessage.HtmlBody)}
              </div>
            </div>
          </SplitPane>
        </div>
      </div>
      <UnansweredResponsesComposePage GetUnansweredResponcesList={GetUnansweredResponcesList} />

      <Button onClick={() => OpenComposeReply(OpenMessage)}>
        <div className='composebody' id='maxcomposeReply'>
          <div className="usercompose userdefual" id="UserComposeReply">
            <UnansweredResponsesReplyPage GetUnansweredResponcesList={GetUnansweredResponcesList} ReplyDetails={OpenMessage._id}  />
          </div>
        </div>
      </Button>
      <div className='composebody' id='maxcomposeForward'>
        <div className="usercompose userdefual" id="UserComposeForward">
          <UnansweredResponsesForwardPage GetUnansweredResponcesList={GetUnansweredResponcesList} />
        </div>
      </div>
    </>
  );
}













