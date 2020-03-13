import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { parseISO, formatISO } from 'date-fns'
import {
  createStyles,
  Divider, Drawer, IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles, Theme, Toolbar, Typography
} from '@material-ui/core'
import TodayIcon from '@material-ui/icons/Today';
import { useLazyQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { groupBy } from 'lodash'

import { Header } from '../../layout'
import { DateNavigator } from '../../components/date-navigator'
import { Lesson } from '../../interfaces'
import { useCurrentTeacher } from '../../hooks/use-current-teacher'
import DateFnsUtils from '@date-io/date-fns'
import ukLocale from "date-fns/locale/uk"
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    smallIcon: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    listItem: {
      color: theme.palette.text.disabled,
    },
    listItemPrefix: {
      flexGrow: 0,
      paddingRight: theme.spacing(3),
      alignSelf: 'center',
    },
    verticalDivider: {
      padding: theme.spacing(),
    },
    drawer: {
      padding: theme.spacing(1)
    },
    secondaryToolbar: {
      background: theme.palette.background.default,
      paddingTop: theme.spacing(),
      paddingBottom: theme.spacing(),
    }
  }),
)

const LESSONS_PER_DAY_COUNT = 7

const TEACHER_LESSONS_FOR_DAY_QUERY = gql`
  query lessonsByTeacher($teacherId: ID!, $date: Date!) {
    lessonsByTeacher(teacherId: $teacherId, date: $date) {
      id
      order
      group {
        id
        name
      }
      subject {
        id
        name
      }
      teacher {
        id
        person {
          firstName
          lastName
        }
      }
      date
    }
  }
`

interface LessonsByTeacherResponse {
  lessonsByTeacher: Array<Lesson>
}

export const Home: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const searchParams = new URLSearchParams(history.location.search)
  const dateStringFromParams = searchParams.get('date')
  const initialDate = dateStringFromParams ? parseISO(dateStringFromParams) : new Date()
  const [date, setDate] = useState<Date>(initialDate)
  const [teacher] = useCurrentTeacher()
  const [queryLessonsByTeacherId, { data }] = useLazyQuery<LessonsByTeacherResponse>(
    TEACHER_LESSONS_FOR_DAY_QUERY,
    {
      variables: {
        teacherId: teacher?.id,
        date
      }
    }
  )

  useEffect(() => {
    if (!!teacher?.id) {
      queryLessonsByTeacherId()
    }
  }, [teacher?.id, date])

  const [isOpenDrawer, setDrawerState] = useState(false)

  const onDateChange = useCallback((date: Date) => {
    setDate(date)
    const dateIso = formatISO(date, { representation: 'date' })
    const searchParams = new URLSearchParams(history.location.search)
    searchParams.set('date', dateIso)
    history.push({
      ...history.location,
      search: searchParams.toString(),
    })
  }, [])

  const toggleDrawer = (open: boolean) => () => setDrawerState(open)

  const handleLessonClick = (lesson: Partial<Lesson>) => (e: MouseEvent<HTMLElement>) => {
    if (lesson.id) {
      history.push(`/lesson/${lesson.id}`)
    } else {
      history.push(`/lesson/new`, { initialLesson: lesson })
    }
  }

  const handleDateChange = (nextDate: Date | null) => {
    if (nextDate === null) return
    setDate(nextDate)
    toggleDrawer(false)()
  }

  const lessonsByOrder = groupBy(data?.lessonsByTeacher, lesson => lesson.order)
  const lessonsList = new Array(LESSONS_PER_DAY_COUNT)
    .fill(1)
    .map((_, idx) => {
      const order = idx + 1
      if (lessonsByOrder[order] === undefined) {
        const emptyLesson: Partial<Lesson> = {
          order: order,
          date,
        }
        return emptyLesson
      } else {
        return lessonsByOrder[order][0]
      }
    })
  
  return (
    <>
      <Header
        title="Сьогодні"
        actionControl={
          <IconButton
            onClick={toggleDrawer(true)}
            edge="start"
            color="inherit"
            aria-label="calendar">
            <TodayIcon />
          </IconButton>
        }
      >
        <Toolbar
          className={classes.secondaryToolbar}
        >
          <DateNavigator
            date={date}
            onChange={onDateChange}
          />
        </Toolbar>
      </Header>
      <>
        <List>
          {
            data && lessonsList.map(lesson => {
              if (lesson.id) {
                return (
                  <>
                    <ListItem
                      key={lesson.order}
                      button
                      onClick={handleLessonClick(lesson)}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        className={classes.listItemPrefix}
                        primary={lesson?.order}
                        primaryTypographyProps={{variant: 'body1'}} />
                      <ListItemText
                        primary={lesson?.group?.name}
                        primaryTypographyProps={{variant: 'body1'}}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                            >
                              {lesson?.subject?.name}
                            </Typography>
                          </>
                        }
                        secondaryTypographyProps={{variant: 'subtitle2'}}
                      />
                    </ListItem>
                    <Divider variant={'middle'}/>
                  </>
                )
              } else {
                return (
                  <>
                    <ListItem
                      className={classes.listItem}
                      key={lesson.order}
                      button
                      onClick={handleLessonClick(lesson)}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        className={classes.listItemPrefix}
                        primary={lesson?.order}
                        primaryTypographyProps={{variant: 'body1'}} />
                      <ListItemText
                        primary={`Немає уроку ;(`}
                        primaryTypographyProps={{variant: 'body1'}}
                        secondary={`Натисніть тут щоб додати урок!`}
                      />
                    </ListItem>
                    <Divider variant={'middle'}/>
                  </>
                )
              }
            })
          }
        </List>
        <Drawer
          className={classes.drawer}
          anchor="bottom"
          open={isOpenDrawer}
          onClose={toggleDrawer(false)}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ukLocale}>
            <DatePicker
              format="dd.MM.yyyy"
              variant="static"
              value={date}
              disableToolbar
              onChange={handleDateChange}/>
          </MuiPickersUtilsProvider>
        </Drawer>
      </>
    </>
  )
}
