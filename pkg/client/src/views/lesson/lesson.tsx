import React, { useCallback } from 'react'
import { Button, ButtonBase, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import { useParams, useHistory } from 'react-router-dom'

import { Header } from '../../layout'
import { useAttendancesByLessonId } from '../../hooks/use-attendance'
import { Attendance } from '../../interfaces'

interface LessonParams {
  id: string
}

interface AbsentStudentsListProps {
  attendances: Attendance[]
}

const AbsentStudentsList: React.FC<AbsentStudentsListProps> = (props: AbsentStudentsListProps) => {
  const { attendances } = props
  const count = attendances.length
  if (count === 0) return null

  return (
    <List dense subheader={<ListSubheader>{`Відсутні учні (${count}):`}</ListSubheader>}>
      {
        attendances.map(attendance => (
          <ListItem key={attendance.id}>
            <ListItemText
              primary={`${attendance.student.person.lastName} ${attendance.student.person.firstName}`}
              // secondary={secondary ? 'Secondary text' : null}
            />
          </ListItem>
        ))
      }
    </List>
  )
}

export const Lesson: React.FC = () => {
  const params = useParams<LessonParams>()
  const history = useHistory()
  const lessonId = params.id

  const [attendances] = useAttendancesByLessonId(lessonId)

  const handleAttendanceClick = useCallback(
    () => history.push(`/lesson/${lessonId}/attendance`),
    [params])

  const createAttendanceButtonText = attendances?.length === 0 ?
    'Заповнити відвідуваність' :
    'Редагувати відвідуваність'

  return (
    <>
      <Header
        title="Урок"
      />

      <Button
        variant="contained"
        color="default"
        onClick={handleAttendanceClick}
      >
        {createAttendanceButtonText}
      </Button>
      <AbsentStudentsList attendances={attendances || []} />
    </>
  )
}