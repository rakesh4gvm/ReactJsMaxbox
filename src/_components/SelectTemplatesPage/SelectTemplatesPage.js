import React, { useRef, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header'; 
import FooterBottom from '../Footer/footer'; 

 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'; 
import ButtonGroup from '@mui/material/ButtonGroup';
import Radio from '@mui/material/Radio';
 
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; 
import TemplateImg from '../../images/template_img.png';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '../../images/icons/icon_wh_delete.svg';
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';
import BgProfile from '../../images/bg-profile.png';
import WhTemplate from '../../images/icons/wh_template.svg';
import SmallSend from '../../images/icons/small_send.svg';
import MailMultipal from '../../images/icons/mail_multipal.svg';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility'; 
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
 
function createData(TemplatesName, Templatescontent) {
  return { TemplatesName, Templatescontent };
}

const rows = [
  createData('Reschedule a meeting', ' It is a long established fact that a reader will....'), 
  createData('Follow Up', 'Sed ut perspiciatis unde omnis iste natus error....'),  
  createData('Best Wishes', 'Who has any right to find fault with a man who....'),  
  createData('Subscription Detail', ' The wise man therefore always holds in these....'),  
  createData('Account Status', 'Expound the actual teachings of the great expl....'),  
  createData('Activation Link', 'These cases are perfectly simple and easy to di.... '),   
];


export default function SelectTemplatesPage({ children }) {
  
  const [open, setOpen] = React.useState(false); 
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
          <img src={TemplateImg} width="130" className='mb-4' />
          <Typography id="modal-modal-title" variant="b" component="h6">
          Are you sure for Use this <br/>Template?
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure  for move this E-mail into Other Inbox ?
          </Typography> */}
        </div>
        <div className='d-flex btn-50'>
          <Button className='btn btn-pre' variant="contained" size="medium">
            Yes
          </Button>
          <Button className='btn btn-darkpre' variant="contained" size="medium">
          Cancel
          </Button>
        </div>
      </Box>
    </Modal>

 
    </div>
 
    <div className='bodymain'> 
      <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div> 
        <Col className='py-4'> 
          <h5 className='my-0'><a href='' className='mr-2 iconwhite'><ArrowBackIcon /></a> Select Templates</h5> 
        </Col> 
      </Row>  
      
      

      <div className='  mt-5'>
      <div className='containermd'>
          {/* <Row className='mb-5'>
            <Col align="right">
                <Button className='btnaccount'>
                  <AddIcon /> Create Template
                </Button> 
            </Col>
          </Row> */}
          <Row className='mb-5'>
            <Col> 
                <TableContainer className='tablename' component={Paper}>
                  <Table className='centerbox' aria-label="caption table"> 
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell>
                              <Radio 
                                onChange={handleChange}
                                value="a"
                                name="radio-buttons"
                                inputProps={{ 'aria-label': 'A' }}
                              />
                          </TableCell>
                          <TableCell align="right">
                              <Button className='btntemplateround'>
                              <img src={WhTemplate} />
                              </Button> 
                          </TableCell> 
                          <TableCell scope="row">
                            <b>{row.TemplatesName}</b>
                          </TableCell>
                          <TableCell align="right">{row.Templatescontent}</TableCell>
                          <TableCell align="right">
                          <img src={SmallSend} /><label><b className='mx-1'>Total Send :</b></label> 1542
                          </TableCell>
                          <TableCell>
                          <img src={MailMultipal} /><label><b className='mx-1'>Total Open (%) :</b></label> 59 %
                          </TableCell> 
                          <TableCell>
                            <ButtonGroup className='tablebtnlist' variant="text" aria-label="text button group">
                              <Button variant="contained btn" onClick={handleOpen}><EditIcon /></Button>
                              {/* <Button variant="contained btn mx-2"><VisibilityIcon /></Button>
                              <Button variant="contained btn"><img src={DeleteIcon} /></Button> */}
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack className='my-4 page-dec' spacing={2}> 
                  <Pagination count={3} variant="outlined" shape="rounded" />
                </Stack>
            </Col>
          </Row> 
          </div>
      </div>

    </div>

    <FooterBottom />  

    </>
    );
}