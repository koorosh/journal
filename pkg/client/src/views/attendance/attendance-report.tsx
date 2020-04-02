import React, { useCallback, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { formatISO, parseISO } from 'date-fns'
import { chain } from 'lodash'
import {
  AppBar,
  createStyles,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
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
import { useUpdateAttendancesReason } from '../../hooks'

interface AttendanceItem {
  attendanceIds: string[]
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
    redButton: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      borderColor: theme.palette.error.contrastText,
    }
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
  const [ updateAttendancesReasons ] = useUpdateAttendancesReason()

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
    [studentId: string]: AttendanceReason
  }

  const [studentReasons, setStudentReasons] = useState<StudentReason>({})

  const handleReasonChange = useCallback((studentId: string, attendanceIds: string[]) =>
    async (event: React.MouseEvent<HTMLElement>, reason: AttendanceReason) => {
      setStudentReasons((prevState => ({
        ...prevState,
        [studentId]: reason,
      })))
      await updateAttendancesReasons({ variables: { attendanceIds, reason }})
    }, [])

  const rows = chain(attendances)
    .groupBy((item: Attendance) => item.student.id)
    .map((attendances: Attendance[]): AttendanceItem => ({
      student: attendances[0].student,
      reason: attendances[0].reason || null,
      attendanceIds: attendances.map(attendance => attendance.id),
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
            const { student, attendanceIds, reason: initReason } = attendanceItem
            const studentId = student.id
            const skippedLessons = attendanceIds.length
            const reason = studentReasons[studentId] || initReason
            return (
              <>
                <ListItem key={idx}>
                  <ListItemText
                    primary={`${student.person.lastName} ${student.person.firstName[0]}.`}
                    secondary={skippedLessons}
                  />
                  <ListItemSecondaryAction>

                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={reason}
                      onChange={handleReasonChange(studentId, attendanceIds)}
                    >
                      <ToggleButton value={'illness'}>
                        ХВ
                      </ToggleButton>
                      <ToggleButton value={'important'}>
                        П/П
                      </ToggleButton>
                      <ToggleButton value={'no_reason'}>
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