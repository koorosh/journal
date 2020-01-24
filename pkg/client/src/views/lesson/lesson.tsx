import React, { useCallback } from 'react'
import { Button } from '@material-ui/core'
import { useParams, useHistory } from 'react-router-dom'

import { Header } from '../../layout'

interface LessonParams {
  id: string
}

export const Lesson: React.FC = () => {

  const params = useParams<LessonParams>()
  const history = useHistory()

  const handleAttendanceClick = useCallback(
    () => history.push(`/lesson/${params.id}/attendance`),
    [params])

  return (
    <>
      <Header
        title="Створити урок"
        actionControl={
          <Button
            disabled={false}
            color="inherit"
            onClick={history.goBack}
          >
            Назад
          </Button>
        }
      />

      <Button
        onClick={handleAttendanceClick}
      >
        Відвідуваність
      </Button>
    </>
  )
}