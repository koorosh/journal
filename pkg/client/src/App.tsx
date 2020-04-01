import React from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom"
import { ApolloProvider } from '@apollo/react-hooks'

import './App.css';
import client from './graphql-client'
import history from './history'

import { Attendance, AttendanceReport, Home, Lesson, NewLesson } from './views'
import { Layout } from './layout'
import { Reports } from './views/reports'
import { ChangePassword, Login } from './views/account'
import { SettingsView } from './views/settings'
import { GroupDashboard, Groups } from './views/groups'

const App: React.FC = () => {
  return (
    <Router history={history}>
      <ApolloProvider client={client}>
        <Layout>
          <Switch>
            <Redirect exact from="/" to="/today" />
            <Route exact path="/reports/attendance/:groupId">
              <AttendanceReport />
            </Route>
            <Route exact path="/lesson/:lessonId/attendance">
              <Attendance />
            </Route>
            <Route exact path="/lesson/:lessonId/attendance/report">
              <AttendanceReport />
            </Route>
            <Route exact path="/lesson/new">
              <NewLesson />
            </Route>
            <Route exact path="/lesson/:id">
              <Lesson />
            </Route>
            <Route exact path="/today">
              <Home />
            </Route>
            <Route exact path="/reports">
              <Reports />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/changePassword">
              <ChangePassword />
            </Route>
            <Route exact path="/settings">
              <SettingsView />
            </Route>
            <Route path="/groups">
              <Switch>
                <Route exact path="/groups">
                  <Groups />
                </Route>
                <Route exact path="/groups/:groupId">
                  <GroupDashboard />
                </Route>
              </Switch>
            </Route>
          </Switch>
        </Layout>
      </ApolloProvider>
    </Router>
  )
}

export default App
