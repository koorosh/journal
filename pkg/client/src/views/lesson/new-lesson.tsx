import React, { MouseEventHandler, useEffect, useState } from 'react'
import {
  Button,
  ButtonGroup,
  CircularProgress,
  createStyles, Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
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

import { Group, Student, Subject } from '../../interfaces'
import { Header } from '../../layout'
import { useCurrentTeacher } from '../../hooks/use-current-teacher'

interface NewLessonProps {

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

const CREATE_LESSON = gql`
  mutation createLesson(
    $subjectId: ID!
    $groupId: ID!
    $teacherId: ID!
    $order: Int!
    $date: Date!
  ) {
      createLesson(
        subjectId: $subjectId
        groupId: $groupId
        teacherId: $teacherId
        order: $order
        date: $date
      ) {
        id
      }
    }
`

const lessonsNo = [1, 2, 3, 4, 5, 6, 7]

type DrawerContentView = 'date' | 'lessons' | 'subjects' | 'groups'

export const NewLesson: React.FC<NewLessonProps> = (props: NewLessonProps) => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  const {
    error,
    loading,
    data,
  } = useQuery<InitialQueryData>(INITIAL_DATA)

  const [teacher] = useCurrentTeacher()
  const teacherId = teacher?.id

  const { subjects = [], groupsThisYear: groups = [] } = (data || {})

  const [selectedDate, setDate] = React.useState<Date | null>(
    new Date()
  )
  const [selectedSubject, setSelectedSubject] = React.useState<Subject>()
  const [selectedGroup, setSelectedGroup] = React.useState<Group>()
  const [selectedLessonNo, setSelectedLessonNo] = React.useState(1)

  const [createLesson] = useMutation(
    CREATE_LESSON,
    {
      variables: {
        subjectId: selectedSubject?.id,
        groupId: selectedGroup?.id,
        teacherId,
        order: selectedLessonNo,
        date: selectedDate
      }
    })

  useEffect(() => {
    const isCompletedForm = Boolean(selectedDate)
      && Boolean(selectedSubject)
      && Boolean(selectedLessonNo)
      && Boolean(selectedGroup)
      && Boolean(teacherId)

    setCanSubmit(isCompletedForm)
  }, [
    selectedDate,
    selectedSubject,
    selectedLessonNo,
    selectedGroup,
    teacherId
  ])

  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  const onSubmit = React.useCallback(async () => {
    const {data} = await createLesson()
    history.push(`/lesson/${data.createLesson.id}`)
  }, [
    selectedDate,
    selectedSubject,
    selectedLessonNo,
    selectedGroup,
    teacher,
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
              groups.map((group: Group) => {
                return (
                  <ListItem
                    button
                    onClick={() => {
                      setSelectedGroup(group)
                      toggleDrawer(false)()
                    }}
                    key={group.id}
                  >
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
      default:
        return null
    }
  }

  if (loading) return <CircularProgress/>

  return (
    <>
      <Header
        title="Створити урок"
        actionControl={
          <Button
            disabled={!canSubmit}
            color="inherit"
            onClick={onSubmit}
          >
            Створити
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
            primary={selectedSubject?.name || ''}
            className={classes.listItemValue}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={toggleDrawer(true, 'groups')}>
          <ListItemText primary="Група" />
          <ListItemText
            primary={selectedGroup?.name || ''}
            primaryTypographyProps={{ align: 'right'}}
            className={classes.listItemValue}
          />
        </ListItem>
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
