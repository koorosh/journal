import React, { useEffect, useState } from 'react'
import { chain, sortBy } from 'lodash'
import {
  AppBar,
  Button,
  Checkbox,
  createStyles,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core'

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { gql } from 'apollo-boost'
import { useHistory, useParams } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import { useLesson } from '../../hooks/use-lesson'
import { useAttendancesByLessonId } from '../../hooks/use-attendance'

interface StudentsMap {
  [studentId: string]: boolean
}

const CREATE_ATTENDANCE = gql`
  mutation createBatchAttendancesForLesson($attendances: [CreateAttendancePayload]!, $lessonId: ID!) {
    createBatchAttendancesForLesson(attendances: $attendances, lessonId: $lessonId) {
      id
    }
  }
`

interface AttendanceParams {
  lessonId: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectedItem: {
      color: theme.palette.error.main,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
)

export const Attendance: React.FC = () => {

  const history = useHistory()
  const params = useParams<AttendanceParams>()

  const [lesson] = useLesson(params.lessonId)

  const [attendances] = useAttendancesByLessonId(params.lessonId)

  const [selectedStudents, setSelectedStudents] = React.useState<StudentsMap>({})

  useEffect(() => {
    attendances?.forEach(item => {
      setSelectedStudents(prevState => ({
        ...prevState,
        [item.student.id]: true,
      }))
    })
  }, [attendances])

  const classes = useStyles()

  const toggleStudentSelection = (studentId: string) =>
    (_event: React.MouseEvent<HTMLElement>) => {
      setSelectedStudents(prevState => ({
        ...prevState,
        [studentId]: !prevState[studentId],
      }))
    }

  const setStudentState = (studentId: string) => (e: React.ChangeEvent<HTMLInputElement>, nextState: boolean) => {
    setSelectedStudents(prevState => ({
      ...prevState,
      [studentId]: nextState,
    }))
  }

  const [createAttendances] = useMutation(CREATE_ATTENDANCE, {
    variables: {
      lessonId: lesson?.id,
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

  const students = sortBy(lesson?.group?.students || [], 'person.lastName')

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
            {lesson?.group?.name}
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
      <Toolbar />
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
            const isSelected = Boolean(selectedStudents[student.id])
            return (
              <>
                <ListItem
                  button
                  onClick={toggleStudentSelection(student.id)}
                  key={idx}
                  className={isSelected ? classes.selectedItem : undefined}
                >
                  <ListItemText
                    primary={`${student.person.lastName} ${student.person.firstName}`}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      onChange={setStudentState(student.id)}
                      checked={isSelected}
                      icon={<RadioButtonUncheckedIcon color="disabled" />}
                      checkedIcon={<HighlightOffIcon color="error" />}
                    />
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
