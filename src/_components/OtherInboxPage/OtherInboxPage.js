import React, { useRef, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Axios from "axios";
import parse from "html-react-parser";
import moment from "moment";


import HeaderTop from '../Header/header';
import Compose from '../ComposePage/ComposePage';
import InboxList from '../InboxListPage/InboxListPage'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
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

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";



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


export default function OtherInboxPage() {
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  useEffect(() => {
    
  
  }, [isLoading]);




  const OpenMessageDetails = (ID) => {
   
    if (ID != '') {
      var data = {
        _id: ID,
      };
      const responseapi = Axios({
        url:CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGetByID",
        method: "POST",
        data: data,
      });
      responseapi.then((result) => {
        if(result.data.StatusMessage==ResponseMessage.SUCCESS)
        {
          SetOpenMessageDetails(result.data.Data);
        }
        debugger
        
      });
    }
  };

   const DeleteMessage=(ID)=>{

    debugger;
    if (ID != '') {
      var data = {
        IDs: ID,
        LastUpdatedBy:-1
      };
    
      const responseapi = Axios({
        url:CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryDelete",
        method: "POST",
        data: data,
      });
      responseapi.then((result) => {
        if(result.data.StatusMessage==ResponseMessage.SUCCESS)
        {
          setLoading(true)
        }
       
        
      });
    }
 }
  const [open, setOpen] = React.useState(false);
  const [openone, setOpenone] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenOne = () => setOpenone(true);
  const handleCloseOne = () => setOpenone(false);

  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <HeaderTop />

      <div>

        <Modal className="modal-pre"
          open={open}
          onClose={handleClose}
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
          open={openone}
          onClose={handleCloseOne}
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
                      value={value}
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
            <InboxList OpenMessageDetails={OpenMessageDetails} ID ={isLoading}/>
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
                    <Button>
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
                    <Button   onClick={() => {DeleteMessage(OpenMessage._id);}}>
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
               
               
               {OpenMessage==0?'':parse(OpenMessage.HtmlBody)} 
               
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