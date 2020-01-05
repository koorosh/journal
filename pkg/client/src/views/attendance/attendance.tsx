import React, { useEffect } from 'react'
import {
  Button, ButtonGroup,
  Checkbox, CircularProgress,
  createStyles, FormControl,
  Grid, InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, makeStyles, MenuItem, Select, Theme
} from '@material-ui/core'
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import ukLocale from "date-fns/locale/uk";
import { gql } from 'apollo-boost'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'

import { Group, Reasons, Student, Subject } from '../../interfaces'

interface AttendanceProps {

}

interface StudentsMap {
  [studentId: string]: Reasons | undefined
}

interface StudentsQueryData {
  studentsInGroup: Student[]
}

interface InitialQueryData {
  subjects: Subject[]
  groupsThisYear: Group[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
)

const INITIAL_DATA = gql`
  {
    subjects {
      id
      name
    }

    groupsThisYear {
      id
      name
      year
    }
  }
`

const STUDENTS_IN_GROUP = gql`
  query studentsInGroup($groupId: ID!) {
    studentsInGroup(groupId: $groupId) {
      person {
        firstName
        lastName
        phone
      }
      id
    }
  }
`

const CREATE_ATTENDANCE = gql`
  mutation createGroupAttendanceReport(
    $groupId: ID!
    $subjectId: ID!
    $lessonNo: Int!
    $date: Date!
    $absentStudentIds: [StudentAbsenceReasonMap]!
  ) {
      createGroupAttendanceReport(
        attendanceReport: {
          groupId: $groupId,
          subjectId: $subjectId,
          lessonNo: $lessonNo,
          date: $date,
          absentStudentIds: $absentStudentIds
        }) {
        id
      }
    }
`

const lessonsNo = [1, 2, 3, 4, 5, 6, 7]

export const Attendance: React.FC<AttendanceProps> = (props: AttendanceProps) => {
  const classes = useStyles()

  const {
    error,
    loading,
    data,
  } = useQuery<InitialQueryData>(INITIAL_DATA)

  const { subjects = [], groupsThisYear: groups = [] } = (data || {})

  const [
    queryStudents,
    {
      loading: studentsIsLoading,
      error: studentsError,
      data: {
        studentsInGroup: students = [],
      } = {},
    },
  ] = useLazyQuery<StudentsQueryData>(STUDENTS_IN_GROUP)

  const [selectedDate, setDate] = React.useState<Date | null>(
    new Date()
  )
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>()
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>()
  const [selectedLessonNo, setSelectedLessonNo] = React.useState(1)
  const [selectedStudents, setSelectedStudents] = React.useState<StudentsMap>({})

  useEffect(() => {
    if (!selectedGroupId) return
    queryStudents({
      variables: { groupId: selectedGroupId },
    })
  }, [selectedGroupId])

  const toggleStudentSelection = (reason: Reasons, studentId: string) => {
    setSelectedStudents(prevState => ({
      ...prevState,
      [studentId]: prevState[studentId] === reason ? undefined : reason,
    }))
  }

  const [saveAttendance] = useMutation(CREATE_ATTENDANCE, {
    variables: {
      groupId: selectedGroupId,
      subjectId: selectedSubjectId,
      lessonNo: selectedLessonNo,
      date: selectedDate,
      absentStudentIds: Object.entries(selectedStudents)
        .filter(([_, reason]) => reason !== undefined)
        .map(([studentId, absenceReason]) => ({ studentId, absenceReason })),
    },
  })

  const onSubmit = React.useCallback(() => {
    saveAttendance()
  }, [
    selectedDate,
    selectedSubjectId,
    selectedLessonNo,
    selectedStudents,
    selectedGroupId
  ])

  const handleDateChange = (date: Date | null) => {
    setDate(date)
  }

  if (loading) return <CircularProgress/>

  return (
    <Grid container>
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ukLocale}>
          <DatePicker
            format="dd.MM.yyyy"
            value={selectedDate}
            onChange={handleDateChange}/>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup
          color="primary">
          {
            lessonsNo.map((lessonNo, idx) =>
              (
                <Button
                  key={idx}
                  color={lessonNo === selectedLessonNo ? 'primary' : 'default'}
                  onClick={() => setSelectedLessonNo(lessonNo)}>
                  {lessonNo}
                </Button>
              ),
            )
          }
        </ButtonGroup>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <InputLabel id="select-subject-label">предмет</InputLabel>
          <Select
            labelId="select-subject-label"
            value={selectedSubjectId}
            onChange={event => setSelectedSubjectId(event.target.value as string)}
          >
            {
              subjects.map(subject => (
                <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <InputLabel id="select-group-label">Клас</InputLabel>
          <Select
            labelId="select-group-label"
            value={selectedGroupId}
            onChange={event => setSelectedGroupId(event.target.value as string)}
          >
            {
              groups.map(group => (
                <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <List className={classes.root}>
          {students.map((student, idx) => {
            return (
              <ListItem key={idx}>
                <ListItemText primary={`${student.person.lastName} ${student.person.firstName}`}/>
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={() => toggleStudentSelection(Reasons.UNKNOWN, student.id)}
                    checked={selectedStudents[student.id] === Reasons.UNKNOWN}
                  />
                  <Checkbox
                    edge="end"
                    onChange={() => toggleStudentSelection(Reasons.ILLNESS, student.id)}
                    checked={selectedStudents[student.id] === Reasons.ILLNESS}
                  />
                  <Checkbox
                    edge="end"
                    onChange={() => toggleStudentSelection(Reasons.OTHER, student.id)}
                    checked={selectedStudents[student.id] === Reasons.OTHER}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      </Grid>
    </Grid>
  )
}
