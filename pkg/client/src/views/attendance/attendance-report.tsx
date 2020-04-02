import React, { useCallback, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { formatISO, parseISO } from 'date-fns'
import { chain } from 'lodash'
import {
  AppBar,
  Button,
  createStyles,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  makeStyles, MenuItem,
  Select,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core'

import { useAttendanceBy } from '../../hooks/use-attendance-by'
import { Attendance, AttendanceReason, Student } from '../../interfaces'
import CloseIcon from '@material-ui/icons/Close'
import SendIcon from '@material-ui/icons/Send'
import { DateNavigator } from '../../components/date-navigator'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

interface AttendanceItem {
  items: Attendance[]
  student: Student
  reason: AttendanceReason | null
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    secondaryToolbar: {
      background: theme.palette.background.default,
      paddingTop: theme.spacing(),
      paddingBottom: theme.spacing(),
    },
    sendMessageButton: {
      margin: theme.spacing(1),
    },
  }),
)

export const AttendanceReport: React.FC = () => {
  const history = useHistory()
  const classes = useStyles()

  const searchParams = new URLSearchParams(history.location.search)

  const dateStringFromParams = searchParams.get('date')
  const initialDate = dateStringFromParams ? parseISO(dateStringFromParams) : new Date()
  const [date, setDate] = useState<Date>(initialDate)

  const matchParams = useRouteMatch<{ groupId: string }>()
  const { groupId } = matchParams.params
  const [attendances] = useAttendanceBy({ groupId, date })

  // TODO (koorosh): Refactor this to some reusable hook
  // parsing data from params and set date param back to
  // URL search string.
  const onDateChange = useCallback((date: Date) => {
    setDate(date)
    const dateIso = formatISO(date, { representation: 'date' })
    const searchParams = new URLSearchParams(history.location.search)
    searchParams.set('date', dateIso)
    history.push({
      ...history.location,
      search: searchParams.toString(),
    })
  }, [history])


  interface StudentReason {
    [studentId: string]: number
  }

  const [studentReasons, setStudentReasons] = useState<StudentReason>({})

  const handleReasonChange = useCallback((studentId: string) =>
    (event: React.MouseEvent<HTMLElement>, reason: number) => {

      setStudentReasons((prevState => ({
        ...prevState,
        [studentId]: reason,
      })))
    }, [])

  const rows = chain(attendances)
    .groupBy((item: Attendance) => item.student.id)
    .map((value: Attendance[]): AttendanceItem => ({
      student: value[0].student,
      reason: null,
      items: value,
    }))
    .value()

  return (
    <>
      <AppBar
        variant="elevation"
        color="primary"
        position="fixed"
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="cancel"
            onClick={history.goBack}
          >
            <CloseIcon/>
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Відвідуваність
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <Toolbar
        className={classes.secondaryToolbar}
      >
        <DateNavigator
          date={date}
          onChange={onDateChange}
        />
      </Toolbar>
      <List
        hidden={rows.length === 0}
        component="nav"
      >
        {
          rows.map((attendanceItem, idx) => {
            const { student, items } = attendanceItem
            const studentId = student.id
            const skippedLessons = items.length
            const reason = studentReasons[studentId]
            return (
              <>
                <ListItem key={idx}>
                  <ListItemText
                    primary={`${student.person.lastName} ${student.person.firstName[0]}.`}
                    secondary={
                      <>
                        <Typography>{skippedLessons}</Typography>

                        {/*<Button*/}
                        {/*  variant="contained"*/}
                        {/*  color="primary"*/}
                        {/*  className={classes.sendMessageButton}*/}
                        {/*  endIcon={<SendIcon />}*/}
                        {/*>*/}
                        {/*  СМС*/}
                        {/*</Button>*/}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>

                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={reason}
                      onChange={handleReasonChange(studentId)}
                    >
                      <ToggleButton value="1">
                        ХВ
                      </ToggleButton>
                      <ToggleButton value="2">
                        П/П
                      </ToggleButton>
                      <ToggleButton value="3">
                        Б/П
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider/>
              </>
            )
          })
        }
      </List>
    </>
  )
}