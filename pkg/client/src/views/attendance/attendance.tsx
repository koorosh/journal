import React, { MouseEventHandler, useEffect, useState } from 'react'
import { chain } from 'lodash'
import {
  Avatar,
  Button,
  ButtonGroup,
  Checkbox, Chip,
  CircularProgress,
  createStyles, Divider,
  Drawer,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, ListSubheader,
  makeStyles,
  Paper,
  Theme
} from '@material-ui/core'
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import ukLocale from 'date-fns/locale/uk'
import { gql } from 'apollo-boost'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import { deepOrange, green } from '@material-ui/core/colors'

import { Header } from '../../layout'
import { useLesson } from '../../hooks/use-lesson'

interface AttendanceProps { }

interface StudentsMap {
  [studentId: string]: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    selectedOption: {
      color: '#fff',
      backgroundColor: green[500],
    },
    checkedStudentAvatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4),
      fontSize: theme.typography.pxToRem(18),
      // marginLeft:
    },
    studentAvatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      fontSize: theme.typography.pxToRem(16),
    },
    drawer: {
      padding: theme.spacing(1)
    },
    listItemValue: {
      flexGrow: 0
    }
  }),
)

const CREATE_ATTENDANCE = gql`
  mutation createBatchAttendances($attendances: [CreateAttendancePayload]!) {
    createBatchAttendances(attendances: $attendances) {
      id
    }
  }
`

interface AttendanceParams {
  lessonId: string
}

export const Attendance: React.FC<AttendanceProps> = (props: AttendanceProps) => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const params = useParams<AttendanceParams>()

  const [lesson] = useLesson(params.lessonId)

  const [selectedStudents, setSelectedStudents] = React.useState<StudentsMap>({})

  const toggleStudentSelection = (studentId: string) =>
    (_event: React.MouseEvent<HTMLElement>) => {
      setSelectedStudents(prevState => ({
        ...prevState,
        [studentId]: !prevState[studentId],
      }))
    }

  const [createAttendances] = useMutation(CREATE_ATTENDANCE, {
    variables: {
      attendances: chain(selectedStudents)
        .entries()
        .filter(([_, isSelected]) => isSelected)
        .map(([studentId]) => ({
          studentId,
          lessonId: lesson?.id
        }))
        .value()
    }
  })

  const [canSubmit] = useState<boolean>(true)

  const onSubmit = React.useCallback(async () => {
    await createAttendances()
    history.goBack()
  }, [
    selectedStudents,
  ])

  if (lesson === undefined) return <CircularProgress/>

  const students = lesson.group.students || []

  return (
    <>
      <Header
        title="Перекличка"
        actionControl={
          <Button
            disabled={!canSubmit}
            color="inherit"
            onClick={onSubmit}
          >
            Зберегти
          </Button>
        }
      />

      <List
        hidden={students.length === 0}
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
          students.map((student, idx) => {
            return (
              <>
                <ListItem
                  button
                  onClick={toggleStudentSelection(student.id)}
                  key={idx}>
                  <ListItemText
                    primary={`${student.person.lastName} ${student.person.firstName[0]}`}
                  />
                  <ListItemSecondaryAction hidden={!selectedStudents[student.id]}>
                    <Avatar>H</Avatar>
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
