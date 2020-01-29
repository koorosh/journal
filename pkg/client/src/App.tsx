import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import { ApolloProvider } from '@apollo/react-hooks'

import './App.css';
import client from './graphql-client'

import { Attendance, AttendanceReport, Home, Lesson, NewLesson } from './views'
import { Layout } from './layout'
import { Reports } from './views/reports'

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Redirect exact from="/" to="/today" />
            <Route exact path="/reports/attendance">
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
          </Switch>
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
