import React, { useRef, useState, useEffect } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow } from "../../_helpers/Utility";
import Navigation from '../Navigation/Navigation';
import DraftComposePage from '../DraftComposePage/DraftComposePage';

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

export default function OtherInboxPage(props) {
  const [DraftList, SetDraftList] = React.useState([]);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [SortField, SetSortField] = React.useState("MailTo");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [MailNumber, SetMailNumber] = React.useState(1);

  useEffect(() => {
    document.title = 'Drafts | MAXBOX';
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
        GetDraftList(UserDetails.ClientID, UserDetails.UserID, Page);
      } else {
        GetDraftList(UserDetails.ClientID, UserDetails.UserID, Page)
      }
    }
  }

  // Start Get Draft List
  const GetDraftList = (CID, UID, PN) => {
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
    LoaderShow()
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetDraftList(Result.data.PageData);
          OpenMessageDetails(Result.data.PageData[0]._id);
          SetMailNumber(1)
          LoaderHide()
        } else {
          SetDraftList([]);
          SetOpenMessageDetails([]);
          LoaderHide()
        }
      }
    });
  };
  // End Get Draft List

  //Start Open Message Details
  const OpenMessageDetails = (ID, index) => {
    if (ID != "") {
      SetMailNumber(index + 1)
      var Data = {
        _id: ID,
      };
      LoaderShow()
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data != "" && Result.data.Data != null && Result.data.Data != undefined) {
            SetOpenMessageDetails(Result.data.Data);
            LoaderHide()
          } else {
            SetDraftList([])
            SetOpenMessageDetails([]);
            LoaderHide()
          }
        }
        else {
          SetOpenMessageDetails('');
          LoaderHide()
        }
      });
    }
  }
  //End Open Message Details

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

  return (

    <>
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
                  {DraftList.map((item, index) => (
                    <TableRow
                      key={item.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      onClick={() => OpenMessageDetails(item._id, index)}
                    >
                      <TableCell width={'35px'}><StarBorderIcon /></TableCell>
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
                        <label>{MailNumber} / {DraftList.length}</label>
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
                {OpenMessage == 0 ? '' : parse(OpenMessage.Body)}
              </div>
            </div>
          </SplitPane>
        </div>
      </div>
      <DraftComposePage GetDraftList={GetDraftList} />
    </>
  );
}

























