import React, { useEffect, useState } from 'react'
import { chain } from 'lodash'
import {
  Button,
  Checkbox,
  createStyles,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, ListSubheader, makeStyles, Theme,
} from '@material-ui/core'

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { gql } from 'apollo-boost'
import { useHistory, useParams } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import { Header } from '../../layout'
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

  const students = lesson?.group?.students || []

  return (
    <>
      <Header
        title="Перекличка"
        backButton
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
                    primary={`${student.person.lastName} ${student.person.firstName[0]}`}
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
