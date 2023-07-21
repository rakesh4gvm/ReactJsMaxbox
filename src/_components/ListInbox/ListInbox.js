import React, { useRef, useState, useEffect } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";

import { makeStyles, styled, useTheme, alpha } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";

import InputBase from '@mui/material/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import SplitPane from "react-split-pane";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import iconleftright from '../../images/icon_left_right.svg';
import iconmenu from '../../images/icon_menu.svg';
import iconstar from '../../images/icon_star.svg';
import ReplyIcon from '@material-ui/icons/Reply';
import EmailBanner from '../../images/email_banner.jpg'

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


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


function createData(name, correspondents, date) {
  return { name, correspondents, date };
}

const rows = [
  createData('Frozen yoghurt', 'Charles Byrd', '11:12 AM'),
  createData('Lorem Ipsum is simply dummy text of the printing', '3DLook Team', '9:59 AM'),
  createData('containing Lorem Ipsum passages', '3DLook Team', '9:59 AM'),
  createData(' looked up one of the more obscure Latin words', '3DLook Team', '9:59 AM'),
  createData('Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero', '3DLook Team', '9:59 AM'),
  createData('Finibus Bonorum et Malorum" by Cicero are also reproduced', '3DLook Team', '9:59 AM'),
  createData(' looked up one of the more obscure Latin words', '3DLook Team', '9:59 AM'),
  createData('Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero', '3DLook Team', '9:59 AM'),
  createData('Finibus Bonorum et Malorum" by Cicero are also reproduced', '3DLook Team', '9:59 AM'),
  createData('Frozen yoghurt', 'Charles Byrd', '11:12 AM'),
  createData('Lorem Ipsum is simply dummy text of the printing', '3DLook Team', '9:59 AM'),
  createData('containing Lorem Ipsum passages', '3DLook Team', '9:59 AM'),
];


export default function ListInbox() {

  const [FollowUpList, SetFollowUpList] = useState([])
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [FollowUpDate, SetFollowupDate] = React.useState(new Date().toLocaleString());

  useEffect(() => {
    GetFollowUpLaterList()
  }, [FollowUpDate])

  // Start Get Follow Up Later List
  const GetFollowUpLaterList = () => {

    var Data = {
      Page: Page,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: "MessageDatetime",
      Sortby: -1,
      Search: "",
      ClientID: "63329c5eb0c02730f8cac29d",
      UserID: "63159cf4957df035d054fe11",
      IsInbox: false,
      IsStarred: false,
      IsFollowUp: true,
      IsSpam: false,
      IsOtherInbox: false,
      AccountIDs: [-1],
      SearchDate: Moment(FollowUpDate).format("YYYY-MM-DD")
    };

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
        } else {
          SetFollowUpList([])
          SetOpenMessageDetails([]);
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
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            SetOpenMessageDetails(Result.data.Data[0]);
          } else {
            SetFollowUpList([])
            SetOpenMessageDetails([]);
          }
        }
        else {
          SetOpenMessageDetails([]);
        }
      });
    }
    else {
      SetOpenMessageDetails([]);
    }
  };
  //End Open Message Details

  const SelectFollowupDate = (NewValue) => {
    SetFollowupDate(NewValue);
  };



  return (
    <>
      <header className='minisearchhed'>
        <Row>
          <Col>
            <Search className='serchinbox'>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
              />
            </Search>
          </Col>

          <Col>
            <div className="dropdatebox">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={0}>
                  <DesktopDatePicker
                    inputFormat="MM/dd/yyyy"
                    value={FollowUpDate}
                    onChange={SelectFollowupDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </div>
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
                  <TableCell component="th" width={'30px'} align="center"><StarBorderIcon /></TableCell>
                  <TableCell component="th" width={'30px'}><AttachFileIcon /></TableCell>
                  <TableCell component="th">Subject</TableCell>
                  <TableCell component="th">From Email</TableCell>
                  <TableCell component="th">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {FollowUpList.map((item, index) => (
                  <TableRow
                    key={item.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell width={'35px'} align="center"><StarBorderIcon /></TableCell>
                    <TableCell width={'35px'}></TableCell>
                    <TableCell>{item.Subject.split(' ').slice(0, 8).join(' ')}{item.Subject.split(' ').length > 8 ? '...' : ''}</TableCell>
                    <TableCell>{item.FromEmail}</TableCell>
                    <TableCell>{Moment(item.FollowUpDate).format("DD/MM/YYYY")}</TableCell>
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
                      <b>From : </b>
                      {/* <strong>{OpenMessage.FromName}</strong> */}
                      {OpenMessage.FromEmail}
                    </label>
                    <label><b>To : </b>{OpenMessage.ToEmail}</label>
                    <label><b>Subject : </b>{OpenMessage.Subject}</label>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className='lablebox text-right'>
                    <label>{OpenMessage == 0 ? '' : Moment(OpenMessage.MessageDatetime).format("LLL")}</label>
                  </div>
                  <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group">
                    <Button>
                      <label>{MailNumber} / {FollowUpList.length}</label>
                    </Button>
                    <Button>
                      <a><img src={iconstar} title={"Starred"} /></a>
                    </Button>
                    <Button>
                      <a><img src={iconsarrow2} /></a>
                    </Button>
                    <Button>
                      <a><img src={iconsarrow1} /></a>
                    </Button>
                    {<Button>
                      <a><img src={icondelete} /></a>
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
    </>
  );
}













