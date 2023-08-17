import './App.css';
import React, { useState } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { history } from '../src/_helpers/history';
import 'bootstrap/dist/css/bootstrap.min.css';
import OtherInboxPage from './_components/OtherInboxPage/OtherInboxPage';
import ProfileSettingPage from '../src/_components/ProfileSettingPage/ProfileSettingPage';
import EmailConfigurationPage from '../src/_components/EmailConfigurationPage/EmailConfigurationPage';
import FocusedPage from './_components/FocusedPage/FocusedPage';
import StarredPage from '../src/_components/StarredPage/StarredPage';
import FollowUpLaterPage from '../src/_components/FollowUpLaterPage/FollowUpLaterPage';
import DraftsPage from '../src/_components/DraftsPage/DraftsPage';
import SpamPage from '../src/_components/SpamPage/SpamPage';
import TemplatesPage from '../src/_components/TemplatesPage/TemplatesPage';
import ObjectionTemplatePage from '../src/_components/ObjectionTemplatePage/ObjectionTemplatePage';
import SelectTemplatesPage from '../src/_components/SelectTemplatesPage/SelectTemplatesPage';
import CreateTemplatesPage from './_components/CreateTemplatesPage/CreateTemplatesPage';
import CreateObjectionPage from '../src/_components/CreateObjectionPage/CreateObjectionPage';
import EditObjectionTemplatePage from '../src/_components/EditObjectionTemplatePage/EditObjectionTemplatePage';
import RegisterPage from './_components/RegisterPage/RegisterPage';
import LoginPage from './_components/LoginPage/LoginPage';
import ForgetpasswordPage from './_components/ForgetpasswordPage/ForgetpasswordPage';
import ConfirmpasswordPage from './_components/ConfirmpasswordPage/ConfirmpasswordPage';
import EditEmailPage from './_components/EditEmailPage/EditEmailPage';
import ClientListPage from './_components/ClientListPage/ClientListPage';
import AddClientPage from './_components/AddClientPage/AddClientPage';
import EditClientPage from './_components/EditClientPage/EditClientPage';
import UnansweredRepliesPage from './_components/UnansweredRepliesPage/UnansweredRepliesPage';
import AllSentEmailsPage from './_components/AllSentEmailsPage/AllSentEmailsPage';
import AllInboxPage from './_components/AllInboxPage/AllInboxPage';
import AllInboxByID from './_components/AllInboxByID/AllInboxByID';
import HeaderTop from './_components/Header/header';
import FooterBottom from './_components/Footer/footer';
import { CheckLocalStorage } from "./_helpers/Utility";
import EditTemplatesPage from './_components/EditTemplatesPage/EditTemplatesPage';
import OTPConfirmPage from './_components/OTPConfirmPage/OTPConfirmPage';
import ContactEmailPage from '../src/_components/ContactEmailPage/ContactEmailPage';
import AddContactEmailPage from '../src/_components/AddContactEmailPage/AddContactEmailPage';
import NewInboxPage from '../src/_components/NewInboxPage/NewInboxPage';
import FocusedByID from './_components/FocusedByID/FocusedByID';
import StarredByID from './_components/StarredByID/StarredByID';
import SpamByID from './_components/SpamByID/SpamByID';
import OtherInboxByID from './_components/OtherInboxByID/OtherInboxByID';
import FollowUpLaterByID from './_components/FollowUpLaterByID/FollowUpLaterByID';
import AllSentEmailByID from './_components/AllSentEmailByID/AllSentEmailByID';
import UnansweredRepliesByID from './_components/UnansweredRepliesByID/UnansweredRepliesByID';
import Navigation from './_components/Navigation/Navigation';
import ChatbotComponent from "./_components/ChatbotComponent"
import LabelByID from './_components/LabelByID/LabelByID';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(CheckLocalStorage());

  var LoginData = localStorage.getItem("LoginData")
  let HideHeader = isLoggedIn ?  <div className='lefter'><Navigation /></div> : null
  
  let Chatbot = isLoggedIn ?   <ChatbotComponent /> : null


  
  return (
    <div className="App">
      
      <Router history={history}>
      {HideHeader}
      {Chatbot}
        <Switch>
        
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/Register" component={RegisterPage} />
          <Route exact path="/" render={() => ((<Redirect to="/login" />))} />
          <Route exact path="/OtherInboxPage" component={OtherInboxPage} />
          <Route path="/OtherInboxByID/:id" component={OtherInboxByID} />
          <Route exact path="/Focused" component={FocusedPage} />
          <Route path="/FocusedByID/:id" component={FocusedByID} />
          <Route exact path="/Starred" component={StarredPage} />
          <Route path="/StarredByID/:id" component={StarredByID} />
          <Route exact path="/FollowUpLater" component={FollowUpLaterPage} />
          <Route path="/FollowUpLaterByID/:id" component={FollowUpLaterByID} />
          <Route exact path="/Drafts" component={DraftsPage} />
          <Route exact path="/Spam" component={SpamPage} />
          <Route path="/SpamByID/:id" component={SpamByID} />
          <Route exact path="/ProfileSetting" component={ProfileSettingPage} />
          <Route exact path="/EmailConfiguration" component={EmailConfigurationPage} />
          <Route exact path="/UnansweredReplies" component={UnansweredRepliesPage} />
          <Route exact path="/UnansweredRepliesByID/:id" component={UnansweredRepliesByID} />
          <Route exact path="/AllSentEmails" component={AllSentEmailsPage} />
          <Route exact path="/AllSentEmailsByID/:id" component={AllSentEmailByID} />
          <Route exact path="/Templates" component={TemplatesPage} />
          <Route exact path="/ObjectionTemplate" component={ObjectionTemplatePage} />
          <Route exact path="/SelectTemplates" component={SelectTemplatesPage} />
          <Route exact path="/CreateTemplates" component={CreateTemplatesPage} />
          <Route exact path="/CreateObjection" component={CreateObjectionPage} />
          <Route exact path="/EditObjectionTemplate" component={EditObjectionTemplatePage} />
          
          <Route exact path="/EditEmail" component={EditEmailPage} />
          <Route exact path="/ClientList" component={ClientListPage} />
          <Route exact path="/AddClient" component={AddClientPage} />
          <Route exact path="/EditClient" component={EditClientPage} />
          <Route exact path="/EditTemplates" component={EditTemplatesPage} />
          <Route exact path="/Forgetpassword" component={ForgetpasswordPage} />
          <Route exact path="/Confirmpassword" component={ConfirmpasswordPage} />
          <Route exact path="/OTPConfirm" component={OTPConfirmPage} />
         
          <Route exact path="/ContactEmail" component={ContactEmailPage} />
          <Route exact path="/AddContactEmail" component={AddContactEmailPage} />
          <Route exact path="/AllInbox" component={AllInboxPage} />
          <Route path="/AllInboxByID/:id" component={AllInboxByID} />
          <Route exact path="/NewInbox" component={NewInboxPage} />
          <Route path="/LabelByID/:id" component={LabelByID} />
         

        </Switch>
        {/* {(window.location.pathname == '/ClientList' || 
          window.location.pathname == '/AddClient' ||
          window.location.pathname == '/EditClient' ||
          window.location.pathname == '/EmailConfiguration' ||
          window.location.pathname == '/EditEmail') && isAuth==true ? <FooterBottom/>:null} */}
      </Router>

    </div>
  );
}

export default App;
