import React, { useRef, useEffect } from 'react';
import Axios from "axios";

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

export default function ClientListPage() {
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

  useEffect(() => {
    GetClientID();
    CheckAccountAuthonicate()
    GetTemplateList()
  }, [Page, RowsPerPage, SortedBy, SortField, ClientID, UserID]);

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
  }

  // Start Get Client List
  const GetTemplateList = () => {
    let Data
    Data = {
      Page: Page,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: '',
      ClientID: ClientID,
      UserID: UserID,
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
  const DeleteClient = () => {
    const Data = {
      ID: DeleteID
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/client/ClientDelete",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        GetTemplateList()
        SetDeletePopModel(false);
      }
      else {
        GetTemplateList()
        SetDeletePopModel(false);
      }
    });
  }
  // End Delete Message

  //Change Page
  const HandleChangePage = (Event, NewPage) => {
    SetPage(NewPage);
    GetTemplateList();
  };

  // Edit CLient
  const EditClient = (ID) => {
    history.push("/EditClient", ID);
  }

  // Add CLient
  const AddClient = () => {
    history.push("/AddClient");
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
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteClient(OpenMessage._id); }}>
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
              <Button className='btnaccount' onClick={AddClient}>
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
                      {/* <TableCell>BCC Email</TableCell> */}
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {TemplateList?.map((row) => (
                      <TableRow>
                        <TableCell>{row.Subject}</TableCell>
                        {/* <TableCell scope="row">{row.BccEmail}</TableCell> */}

                        <TableCell align="right">
                          <Button className='iconbtntable' onClick={() => OpenDeletePopModel(row._id)}>
                            <img src={DeleteIcon} />
                          </Button>
                          <Button className="iconbtntable" onClick={() => EditClient(row._id)}><EditIcon /></Button>
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

    </>
  );
}