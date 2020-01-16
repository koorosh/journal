import React, { useEffect, useState } from 'react'
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
import { useHistory, useLocation } from 'react-router-dom'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import { deepOrange, green } from '@material-ui/core/colors'

import { Group, Reasons, Student, Subject } from '../../interfaces'
import { Header } from '../../layout'

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
    selectedOption: {
      color: '#fff',
      backgroundColor: green[500],
    },
    checkedStudentAvatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize: theme.typography.pxToRem(14),
    },
    studentAvatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize: theme.typography.pxToRem(14),
    },
    drawer: {
      padding: theme.spacing(1)
    },
    listItemValue: {
      flexGrow: 0
    }
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

type DrawerContentView = 'date' | 'lessons' | 'subjects' | 'groups' | 'absenceReason'

export const Attendance: React.FC<AttendanceProps> = (props: AttendanceProps) => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

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
  const [selectedSubject, setSelectedSubject] = React.useState<Subject>()
  const [selectedGroup, setSelectedGroup] = React.useState<Group>()
  const [selectedLessonNo, setSelectedLessonNo] = React.useState(1)
  const [selectedStudents, setSelectedStudents] = React.useState<StudentsMap>({})

  useEffect(() => {
    if (!selectedGroup) return
    setSelectedStudents({})
    queryStudents({
      variables: { groupId: selectedGroup.id },
    })
  }, [selectedGroup])

  useEffect(() => {
    const isCompletedForm = Boolean(selectedDate)
      && Boolean(selectedSubject)
      && Boolean(selectedLessonNo)
      && Boolean(selectedStudents)
      && Boolean(selectedGroup)

    setCanSubmit(isCompletedForm)
  }, [
    selectedDate,
    selectedSubject,
    selectedLessonNo,
    selectedStudents,
    selectedGroup
  ])

  const toggleStudentSelection = (studentId: string, reason: number) =>
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setSelectedStudents(prevState => ({
        ...prevState,
        [studentId]: checked ? reason : undefined,
      }))
    }

  const [saveAttendance] = useMutation(CREATE_ATTENDANCE, {
    variables: {
      groupId: selectedGroup ? selectedGroup.id : undefined,
      subjectId: selectedSubject ? selectedSubject.id : undefined,
      lessonNo: selectedLessonNo,
      date: selectedDate,
      absentStudentIds: Object.entries(selectedStudents)
        .filter(([_, reason]) => reason !== undefined)
        .map(([studentId, absenceReason]) => ({ studentId, absenceReason })),
    },
  })

  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  const onSubmit = React.useCallback(async () => {
    await saveAttendance()
    const date = (selectedDate || new Date()).toISOString()
    const groupId = selectedGroup ? selectedGroup.id : ''
    const searchParams = new URLSearchParams([
      ['groupId', groupId],
      ['date', date]
    ])
    location.pathname = '/attendance/report'
    location.search = searchParams.toString()
    history.push(location)
  }, [
    selectedDate,
    selectedSubject,
    selectedLessonNo,
    selectedStudents,
    selectedGroup
  ])

  const handleDateChange = (date: Date | null) => {
    setDate(date)
    toggleDrawer(false)()
  }

  const [isOpenDrawer, setDrawerState] = useState(false)

  const toggleDrawer = (open: boolean, drawerContentView?: DrawerContentView) => () => {
    drawerContentView && setDrawerContentView(drawerContentView)
    setDrawerState(open)
  }

  const [drawerContentView, setDrawerContentView] = useState<DrawerContentView>()

  const drawerContent = () => {
    switch (drawerContentView) {
      case 'date': {
        return (
          <>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ukLocale}>
              <DatePicker
                format="dd.MM.yyyy"
                variant="static"
                disableFuture
                value={selectedDate}
                disableToolbar
                onChange={handleDateChange}/>
            </MuiPickersUtilsProvider>
          </>
        )
      }
      case 'groups': {
        return (
          <List component="nav" aria-label="groups list">
            {
              groups.map(group => {
                return (
                  <ListItem button onClick={() => {
                    setSelectedGroup(group)
                    toggleDrawer(false)()
                  }}>
                    <ListItemText primary={group.name} />
                  </ListItem>
                )
              })
            }
          </List>
        )
      }
      case 'lessons':
        return (
          <ButtonGroup variant="contained">
            {
              lessonsNo.map((lessonNo, idx) =>
                (
                  <Button
                    key={idx}
                    color={lessonNo === selectedLessonNo ? 'primary' : 'default'}
                    onClick={() => {
                      setSelectedLessonNo(lessonNo)
                      toggleDrawer(false)()
                    }}>
                    {lessonNo}
                  </Button>
                ),
              )
            }
          </ButtonGroup>
        )
      case 'subjects':
        return (
          <List component="nav" aria-label="lessons no list">
            {
              subjects.map(subject => (
                <ListItem
                  button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject)
                    toggleDrawer(false)()
                  }}
                >
                  <ListItemText primary={subject.name} />
                </ListItem>
              ))
            }
          </List>
        )
      case 'absenceReason':
        return (
          <Paper >
            <Chip label="НБ" />
            <Chip label="Хвор" />
            <Chip label="Пов прич" />
          </Paper>
        )
      default:
        return null
    }
  }

  if (loading) return <CircularProgress/>

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

      <List component="nav">
        <ListItem button onClick={toggleDrawer(true, 'date')}>
          <ListItemText primary="Дата уроку" />
          <ListItemText
            primary={selectedDate ? selectedDate.toLocaleDateString() : ''}
            className={classes.listItemValue}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={toggleDrawer(true, 'lessons')}>
          <ListItemText primary="№ уроку" />
          <ListItemText
            primary={selectedLessonNo}
            className={classes.listItemValue}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={toggleDrawer(true, 'subjects')}>
          <ListItemText primary="Предмет" />
          <ListItemText
            primaryTypographyProps={{
              align:"right"
            }}
            primary={selectedSubject ? selectedSubject.name : ''}
            className={classes.listItemValue}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={toggleDrawer(true, 'groups')}>
          <ListItemText primary="Група" />
          <ListItemText
            primary={selectedGroup ? selectedGroup.name : undefined}
            primaryTypographyProps={{ align: 'right'}}
            className={classes.listItemValue}
          />
        </ListItem>
      </List>
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
          students.map(student => (
            <ListItem button onClick={toggleDrawer(true, 'absenceReason')}>
              <ListItemText primary={`${student.person.lastName} ${student.person.firstName[0]}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={selectedStudents[student.id] === 1}
                  icon={<Avatar variant="square" className={classes.studentAvatar}>НБ</Avatar>}
                  checkedIcon={<Avatar variant="square" className={classes.checkedStudentAvatar}>НБ</Avatar>}
                  edge="end"
                  onChange={toggleStudentSelection(student.id, 1)}
                />
                <Checkbox
                  checked={selectedStudents[student.id] === 2}
                  icon={<Avatar variant="square" className={classes.studentAvatar}>ХВ</Avatar>}
                  checkedIcon={<Avatar variant="square" className={classes.checkedStudentAvatar}>ХВ</Avatar>}
                  edge="end"
                  onChange={toggleStudentSelection(student.id, 2)}
                />
                <Checkbox
                  checked={selectedStudents[student.id] === 3}
                  icon={<Avatar variant="square" className={classes.studentAvatar}>Пов</Avatar>}
                  checkedIcon={<Avatar variant="square" className={classes.checkedStudentAvatar}>Пов</Avatar>}
                  edge="end"
                  onChange={toggleStudentSelection(student.id, 3)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
      </List>
      <Drawer
        className={classes.drawer}
        anchor="bottom"
        open={isOpenDrawer}
        onClose={toggleDrawer(false)}>
        { drawerContent() }
      </Drawer>
    </>
  )
}
