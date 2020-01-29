import React, { MouseEvent, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, List, ListItem, ListItemText } from '@material-ui/core'
import { useLazyQuery, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { groupBy } from 'lodash'

import { Header } from '../../layout'
import { DateNavigator } from '../../components/date-navigator'
import { Lesson } from '../../interfaces'
import { useCurrentTeacher } from '../../hooks/use-current-teacher'

interface HomeProps {

}

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

export const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const history = useHistory()
  const [date, setDate] = useState<Date>(new Date())
  const [teacher] = useCurrentTeacher()

  const [queryLessonsByTeacherId, { loading, data }] = useLazyQuery<LessonsByTeacherResponse>(
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

  const handleLessonClick = (lesson: Partial<Lesson>) => (e: MouseEvent<HTMLElement>) => {
    if (lesson.id) {
      history.push(`/lesson/${lesson.id}`)
    } else {
      history.push(`/lesson/new`, { initialLesson: lesson })
    }
  }

  if (!data) return null

  const lessonsByOrder = groupBy(data.lessonsByTeacher, lesson => lesson.order)
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
      />
      <>
        <DateNavigator
          date={date}
          onChange={setDate}
        />
        <List component="nav">
          {
            lessonsList.map(lesson => {
              if (lesson.id) {
                return (
                  <ListItem
                    key={lesson.order}
                    button
                    onClick={handleLessonClick(lesson)}
                  >
                    <ListItemText primary={`${lesson.order} - ${lesson?.subject?.name} - ${lesson?.group?.name}`} />
                  </ListItem>
                )
              } else {
                return (
                  <ListItem
                    key={lesson.order}
                    button
                    onClick={handleLessonClick(lesson)}
                  >
                    <ListItemText primary={lesson.order} />
                  </ListItem>
                )
              }
            })
          }
        </List>
      </>
    </>
  )
}
