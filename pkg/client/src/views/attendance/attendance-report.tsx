import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
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
import SaveIcon from '@material-ui/icons/Save'
import { DateNavigator } from '../../components/date-navigator'

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
  }),
)

export const AttendanceReport: React.FC = () => {
  const history = useHistory()
  const classes = useStyles()
  const [canSubmit] = useState<boolean>(false)

  const searchParams = new URLSearchParams(history.location.search)

  const dateStringFromParams = searchParams.get('date')
  const initialDate = dateStringFromParams ? parseISO(dateStringFromParams) : new Date()
  const [date, setDate] = useState<Date>(initialDate)

  const groupId = searchParams.get('groupId') || undefined
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

  const onSubmit = React.useCallback(async () => {
    // await createAttendances()
    if (date) {
      const dateIso = formatISO(date, { representation: 'date' })
      const searchParams = new URLSearchParams(history.location.search)
      searchParams.set('date', dateIso)
      history.push({
        ...history.location,
        pathname: '/today',
        search: searchParams.toString(),
      })
    } else {
      history.push('/today')
    }
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
            <CloseIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Звітний облік відвідуваності
          </Typography>
          <Button
            disabled={!canSubmit}
            color="inherit"
            onClick={onSubmit}
            startIcon={<SaveIcon />}
          >
            Зберегти
          </Button>
        </Toolbar>
      </AppBar>
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
        aria-label="students list"
        subheader={
          <ListSubheader
            component="div"
          >
            Учні
          </ListSubheader>
        }
      >
        {
          rows.map((attendanceItem, idx) => {
            const { student, items, reason } = attendanceItem
            return (
              <>
                <ListItem
                  button
                  key={idx}
                >
                  <ListItemText
                    primary={`${student.person.lastName} ${student.person.firstName}`}
                  />
                  <ListItemSecondaryAction>
                    <Typography>{items.length}</Typography>
                    <Select defaultValue="">
                      <MenuItem value="">
                        <em></em>
                      </MenuItem>
                      <MenuItem value={1}>хв</MenuItem>
                      <MenuItem value={2}>п/п</MenuItem>
                      <MenuItem value={3}>б/п</MenuItem>
                    </Select>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </>
            )
          })
        }
      </List>
    </>
  )
}