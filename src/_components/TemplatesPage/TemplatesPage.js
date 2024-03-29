import * as React from 'react'; 
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

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '../../images/icons/icon_wh_delete.svg';
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';
import BgProfile from '../../images/bg-profile.png';
import WhTemplate from '../../images/icons/wh_template.svg';
import SmallSend from '../../images/icons/small_send.svg';
import MailMultipal from '../../images/icons/mail_multipal.svg';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
 
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


export default function TemplatesPage({ children }) {
     

return (
    <>
    <HeaderTop />  
 
    <div className='bodymain'> 
      <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
        <Col className='py-4'>
          <h5 className='my-0'>Templates</h5> 
        </Col> 
      </Row>  
      
      

      <div className='  mt-5'>
      <div className='containermd'>
          <Row className='mb-5'>
            <Col align="right">
              <a href='/SelectTemplates'>
                <Button className='btnaccount'>
                  <AddIcon /> Create Template
                </Button> 
              </a>
            </Col>
          </Row>
          <Row>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.name}>
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
                              <Button variant="contained btn"><EditIcon /></Button>
                              <Button variant="contained btn mx-2"><VisibilityIcon /></Button>
                              <Button variant="contained btn"><img src={DeleteIcon} /></Button>
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