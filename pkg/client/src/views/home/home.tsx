import React, { MouseEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, List, ListItem, ListItemText } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { groupBy } from 'lodash'

import { Header } from '../../layout'
import { DateNavigator } from '../../components/date-navigator'
import { Lesson } from '../../interfaces'

interface HomeProps {

}

const LESSONS_PER_DAY_COUNT = 7

const TEACHER_LESSONS_FOR_DAY_QUERY = gql`
  query lessonsByTeacher($teacherId: ID!, $date: Date!) {
    lessonsByTeacher(teacherId: $teacherId, date: $date) {
      id
      orderNo
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

export const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const history = useHistory()
  const [date, setDate] = useState<Date>(new Date())
  const teacherId = '59069b67-8c2e-401d-aecd-e9e892bf6707'

  const { error, loading, data } = useQuery<{ lessonsByTeacher: Array<Lesson> }>(
    TEACHER_LESSONS_FOR_DAY_QUERY,
    { variables: {
        teacherId,
        date
      }})

  const handleLessonClick = (lesson: Partial<Lesson>) => (e: MouseEvent<HTMLElement>) => {
    if (lesson.id) {
      history.push(`lesson/${lesson.id}`)
    } else {
      history.push(`lesson/new`, { initialLesson: lesson })
    }
  }

  if (loading) return null
  if (error) return null
  if (!data) return null
  
  const emptyLesson: Partial<Lesson> = {
    date,
  }

  const lessonsByOrder = groupBy(data.lessonsByTeacher, lesson => lesson.orderNo)
  const lessonsList = new Array(LESSONS_PER_DAY_COUNT)
    .fill(emptyLesson)
    .map((item: Partial<Lesson>, idx) => lessonsByOrder[idx][0] || item) // fix
  
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
            lessonsList.map((lesson: Lesson, idx) => {
              if (lesson.id) {
                return (
                  <ListItem
                    key={lesson.orderNo}
                    button
                    onClick={handleLessonClick(lesson)}
                  >
                    <ListItemText primary={lesson.orderNo} />
                  </ListItem>
                )
              } else {
                return (
                  <ListItem
                    key={lesson.orderNo}
                    button
                    onClick={handleLessonClick(lesson)}
                  >
                    <ListItemText primary={lesson.orderNo} />
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
