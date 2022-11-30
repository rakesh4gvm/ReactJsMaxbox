import './App.css';
import React, { useState } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { history } from '../src/_helpers/history';
import 'bootstrap/dist/css/bootstrap.min.css';
import OtherInboxPage from './_components/OtherInboxPage/OtherInboxPage';
import OtherInbox from './_components/OtherInbox/OtherInbox';
import ProfileSettingPage from '../src/_components/ProfileSettingPage/ProfileSettingPage';
import EmailConfigurationPage from '../src/_components/EmailConfigurationPage/EmailConfigurationPage';
import UnansweredResponsesPage from './_components/UnansweredResponsesPage/UnansweredResponsesPage';
import StarredPage from '../src/_components/StarredPage/StarredPage';
import FollowUpLaterPage from '../src/_components/FollowUpLaterPage/FollowUpLaterPage';
import FollowUpLater from '../src/_components/FollowUpLater/FollowUpLater';
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
import HeaderTop from './_components/Header/header';
import FooterBottom from './_components/Footer/footer';
import { CheckLocalStorage } from "./_helpers/Utility";
import EditTemplatesPage from './_components/EditTemplatesPage/EditTemplatesPage';
import OTPConfirmPage from './_components/OTPConfirmPage/OTPConfirmPage';
import ContactEmailPage from '../src/_components/ContactEmailPage/ContactEmailPage';
import AddContactEmailPage from '../src/_components/AddContactEmailPage/AddContactEmailPage';
import NewInboxPage from '../src/_components/NewInboxPage/NewInboxPage';


function App() {
  const [isAuth, setIsAuth] = useState(CheckLocalStorage());

  return (
    <div className="App">
      {window.location.pathname != '/' && isAuth == true ? <HeaderTop /> : null}

      <Router history={history}>
        <Switch>
          <Route exact path="/OtherInboxPage" component={OtherInboxPage} />
          <Route exact path="/OtherInbox" component={OtherInbox} />
          <Route exact path="/UnansweredResponses" component={UnansweredResponsesPage} />
          <Route exact path="/Starred" component={StarredPage} />
          <Route exact path="/FollowUpLater" component={FollowUpLaterPage} />
          <Route exact path="/FollowUp" component={FollowUpLater} />
          <Route exact path="/Drafts" component={DraftsPage} />
          <Route exact path="/Spam" component={SpamPage} />
          <Route exact path="/ProfileSetting" component={ProfileSettingPage} />
          <Route exact path="/EmailConfiguration" component={EmailConfigurationPage} />
          <Route exact path="/UnansweredReplies" component={UnansweredRepliesPage} />
          <Route exact path="/AllSentEmails" component={AllSentEmailsPage} />
          <Route exact path="/Templates" component={TemplatesPage} />
          <Route exact path="/ObjectionTemplate" component={ObjectionTemplatePage} />
          <Route exact path="/SelectTemplates" component={SelectTemplatesPage} />
          <Route exact path="/CreateTemplates" component={CreateTemplatesPage} />
          <Route exact path="/CreateObjection" component={CreateObjectionPage} />
          <Route exact path="/EditObjectionTemplate" component={EditObjectionTemplatePage} />
          <Route exact path="/Register" component={RegisterPage} />
          <Route exact path="/EditEmail" component={EditEmailPage} />
          <Route exact path="/ClientList" component={ClientListPage} />
          <Route exact path="/AddClient" component={AddClientPage} />
          <Route exact path="/EditClient" component={EditClientPage} />
          <Route exact path="/EditTemplates" component={EditTemplatesPage} />
          <Route exact path="/Forgetpassword" component={ForgetpasswordPage} />
          <Route exact path="/Confirmpassword" component={ConfirmpasswordPage} />
          <Route exact path="/OTPConfirm" component={OTPConfirmPage} />
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/ContactEmail" component={ContactEmailPage} />
          <Route exact path="/AddContactEmail" component={AddContactEmailPage} />
          <Route exact path="/AllInbox" component={AllInboxPage} />
          <Route exact path="/NewInbox" component={NewInboxPage} />


          <Redirect from="*" to="/" />

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
