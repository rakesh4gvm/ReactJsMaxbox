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
import { GetUserDetails } from "../../_helpers/Utility";
import EditIcon from '@material-ui/icons/Edit';
import { Col, Row } from 'react-bootstrap';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

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
  const [DeleteID, SetDeleteID] = React.useState()
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    document.title = 'Template | MAXBOX';
    GetClientID();
    // CheckAccountAuthonicate()
    // GetTemplateList()
  }, [Page, RowsPerPage, SortedBy, SortField]);

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
    GetTemplateList(UserDetails.ClientID, UserDetails.UserID)
  }

  // Start Get Template List
  const GetTemplateList = (CID, UID) => {
    let Data
    Data = {
      Page: Page,
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
        SetTemplateList(Result.data.PageData);
        SetCountPage(Result.data.PageCount);
      }
      else {
        SetTemplateList([])
        SetCountPage(0)
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
        toast.error(<div>Template <br />Template deleted successfully.</div>);
        GetTemplateList(ClientID, UserID)
        SetDeletePopModel(false);
      }
      else {
        GetTemplateList(ClientID, UserID)
        SetDeletePopModel(false);
        toast.error(Result?.data?.Message);
      }
    });
  }
  // End Delete Message

  //Change Page
  const HandleChangePage = (Event, NewPage) => {
    SetPage(NewPage);
    GetTemplateList(ClientID, UserID);
  };

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

      <div className='bodymain'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='py-4'>
            <h5 className='my-0'>Template</h5>
          </Col>
        </Row>
        <div className='sm-container mt-5'>
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
                      <TableCell>Subject</TableCell>
                      <TableCell>Body</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {TemplateList?.map((row) => (
                      <>
                        <TableRow>
                          <TableCell align="center">
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen((prev) => ({
                              ...prev,
                              [row._id]: !prev[row._id],
                            }))}>
                              {open[row._id] ? <><RemoveCircleIcon /></> : <><AddCircleIcon /></>}
                            </IconButton>
                          </TableCell>
                          <TableCell>{row.Subject}</TableCell>
                          {/* <TableCell>  {parse(row.BodyText)}   </TableCell> */}

                          <TableCell align="right">
                            <Button className='iconbtntable' onClick={() => OpenDeletePopModel(row._id)}>
                              <img src={DeleteIcon} />
                            </Button>
                            <Button className="iconbtntable" onClick={() => EditTemplate(row._id)}><EditIcon /></Button>
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

    </>
  );
}