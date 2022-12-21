import React, { useRef, useEffect } from 'react';
import Axios from "axios";
import parse from "html-react-parser";
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

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '../../images/icons/icon_wh_delete.svg';
import BgProfile from '../../images/bg-profile.png';
import { history } from "../../_helpers";
import Emailinbox from '../../images/email_inbox_img.png';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import EditIcon from '@material-ui/icons/Edit';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import FooterBottom from '../Footer/footer';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import MaxboxLoading from '../../images/Maxbox-Loading.svg';

import Templatecarbon from '../../images/icons/table-template.svg';
import SmallSend from '../../images/icons/small_send.svg';
import MailMultipal from '../../images/icons/mail_multipal.svg';
import InboxRounded from '../../images/icons/inbox_rounded.svg';
import EyesView from '../../images/icons/eyes_view.svg';

import Navigation from '../Navigation/Navigation';

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


export default function TemplatesListPage() {
  const [CountPage, SetCountPage] = React.useState(0);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [TemplateList, SetTemplateList] = React.useState([]);
  const [SortField, SetSortField] = React.useState("Subject");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [EyesPopModel, SetEyesPopModel] = React.useState(false);
  const [DeleteID, SetDeleteID] = React.useState()
  const [open, setOpen] = React.useState(false);
  const [PopupBody, SetPopupBody] = React.useState(false);

  useEffect(() => {
    document.title = 'Template | MAXBOX';
    GetClientID();
    // CheckAccountAuthonicate()
    // GetTemplateList()
  }, [SortedBy, SortField]);

  // Check Authinticate
  const CheckAccountAuthonicate = () => {
    var queryparamter = window.location.search.substring(1);
    if (queryparamter != "") {
      var ResultMessage = (queryparamter.split('data=')[1]);
      history.push("/EditEmail?data=" + ResultMessage);
    }
  }

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    CheckAccountAuthonicate()
    GetTemplateList(UserDetails.ClientID, UserDetails.UserID, Page)
  }

  // Start Get Template List
  const GetTemplateList = (CID, UID, PN) => {
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
      url: CommonConstants.MOL_APIURL + "/templates/TemplateGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetTemplateList(Result.data.PageData);
          SetCountPage(Result.data.PageCount);
          LoaderHide()
        } else {
          toast.error(<div>Templates <br />No Data.</div>)
          LoaderHide()
        }
      }
      else {
        SetTemplateList([])
        SetCountPage(0)
        LoaderHide()
        toast.error(Result?.data?.Message);
      }
    });
  };

  // Start PopModel Open and Close and Delete Message
  const OpenDeletePopModel = (ID) => {
    SetDeletePopModel(true);
    SetDeleteID(ID)
  }
  const CloseDeletePopModel = () => {
    SetDeletePopModel(false);
  }

  // Start PopModel Open and Close and Delete Message
  const OpenEyesPopModel = (ID, Body) => {
    SetEyesPopModel(true);
    SetPopupBody(Body);
    SetDeleteID(ID)
  }
  const CloseEyesPopModel = () => {
    SetEyesPopModel(false);
  }

  const DeleteTemplate = () => {
    const Data = {
      ID: DeleteID
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/templates/TemplateDelete",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        toast.success(<div>Template <br />Template deleted successfully.</div>);
        LoaderShow()
        GetTemplateList(ClientID, UserID, Page)
        SetDeletePopModel(false);
      }
      else {
        GetTemplateList(ClientID, UserID, Page)
        SetDeletePopModel(false);
        toast.error(Result?.data?.Message);
      }
    });
  }
  // End Delete Message

  // Pagination Starts
  const HandleChangePage = (Event, NewPage) => {
    LoaderShow()
    SetPage(NewPage);
    GetTemplateList(ClientID, UserID, NewPage);
  };
  // Pagination Ends

  // Edit Template
  const EditTemplate = (ID) => {
    history.push("/EditTemplates", ID);
  }

  // Add Template
  const AddTemplate = () => {
    history.push("/CreateTemplates");
  }

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
              You want to Delete Templates
            </Typography>
          </div>
          <div className='d-flex btn-50'>
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteTemplate(OpenMessage._id); }}>
              Yes
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseDeletePopModel(); }}>
              No
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal className="modal-pre"
        open={EyesPopModel}
        onClose={CloseEyesPopModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Style} className="modal-prein wd-600">
          <div className="px-4 pt-4">
            <Typography className='text-center mt-2 mb-4' id="modal-modal-title" variant="b" component="h4">
              Body
            </Typography>
            <div className='max-heghauto'>
              <Typography sx={{ mt: 2 }} component="h6" className='bodytextpoup'>
                {PopupBody}
              </Typography>

            </div>
          </div>
          <div className='mt-4 d-flex btn-50'>
            <Button className='btn btn-darkpre mx-auto w-100' variant="contained" size="medium" onClick={() => { CloseEyesPopModel(); }}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>


      <div className='lefter'>
        <Navigation />
      </div>
      <div className='righter'>
        <div className='px-3'>
          <Row className='bodsetting px-4'>
            <Col className='py-3'>
              <h5 className='my-0'>Template</h5>
            </Col>
          </Row>
        </div>

        <div className='container px-3'>
          <div className='sm-container-bix pt-5'>
            <Row className='mb-5'>
              <Col align="right">
                <Button className='btnaccount' onClick={AddTemplate}>
                  <AddIcon /> Create Templates
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <TableContainer className='tablename' component={Paper}>

                  <Table sx={{ minWidth: 750 }} aria-label="caption table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Body</TableCell>
                        <TableCell>Send</TableCell>
                        <TableCell>Open</TableCell>
                        {/* <TableCell>Replies</TableCell> */}
                        <TableCell>Open %</TableCell>
                        {/* <TableCell>Replies %</TableCell> */}
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {TemplateList?.map((row) => (
                        <>
                          <TableRow>
                            {/* <TableCell align="center">
                              <IconButton aria-label="expand row" size="small" onClick={() => setOpen((prev) => ({
                                ...prev,
                                [row._id]: !prev[row._id],
                              }))}>
                                {open[row._id] ? <><RemoveCircleIcon /></> : <><AddCircleIcon /></>}
                              </IconButton>
                            </TableCell> */}
                            <TableCell style={{ maxWidth: 320 }}><img className='mr-2' src={Templatecarbon} width="38" />
                              <span style={{ maxWidth: 320 }}>{row.Subject}</span>
                            </TableCell>

                            <TableCell sx={{ minWidth: 320 }}>
                              <div className='hidtextmax' style={{ width: 320 }}>{parse(row.BodyText)}</div>
                            </TableCell>

                            <TableCell><img src={SmallSend} /> {row.IsSentCount}</TableCell>
                            <TableCell><img src={MailMultipal} /> {row.IsOpenCount}</TableCell>
                            {/* <TableCell><img src={InboxRounded} /> Replies</TableCell> */}

                            <TableCell>{parseInt(row.IsSentCount) > 0 ? ((parseInt(row.IsOpenCount) / parseInt(row.IsSentCount)) * 100).toFixed(0) : 0} % </TableCell>
                            {/* <TableCell>Replies %</TableCell> */}

                            <TableCell align="left">
                              <ButtonGroup variant="text" aria-label="text button group">
                                <Button className="iconbtntable" onClick={() => EditTemplate(row._id)}><EditIcon /></Button>
                                <Button className='iconbtntable' onClick={() => OpenEyesPopModel(row._id, parse(row.BodyText))}>
                                  <img src={EyesView} />
                                </Button>
                                <Button className='iconbtntable' onClick={() => OpenDeletePopModel(row._id)}>
                                  <img src={DeleteIcon} />
                                </Button>
                              </ButtonGroup>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                              <Collapse in={open[row._id]} timeout="auto" unmountOnExit>
                                <Box margin={1} className="innertables">
                                  <Table size="small" aria-label="purchases">
                                    <TableHead>
                                    </TableHead>
                                    <TableRow>
                                      <TableCell><div className='bodytables'>{parse(row.BodyText)}</div></TableCell>
                                    </TableRow>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </>
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