import React, { useCallback } from 'react'
import {
  Button,
  createStyles,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary, Grid,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams, useHistory } from 'react-router-dom'
import { isBefore, isToday } from 'date-fns'

import { Header } from '../../layout'
import { useAttendancesByLessonId } from '../../hooks/use-attendance'
import { Attendance } from '../../interfaces'
import { useLesson } from '../../hooks/use-lesson'

interface LessonParams {
  id: string
}

interface AbsentStudentsListProps {
  attendances: Attendance[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filledComment: {
      color: theme.palette.success.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    notFilledComment: {
      color: theme.palette.warning.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    notFilledPastComment: {
      color: theme.palette.error.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    verticalDivider: {
      padding: theme.spacing(),
    },
    summaryPanel: {
      display: 'flex',
      flexDirection: 'column',
    }
  }),
)

const AbsentStudentsList: React.FC<AbsentStudentsListProps> = (props: AbsentStudentsListProps) => {
  const { attendances } = props
  const count = attendances.length
  if (count === 0) return null

  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      {
        attendances.map(attendance => (
          <Grid item>
            <Typography>
              {`${attendance.student.person.lastName} ${attendance.student.person.firstName}`}
            </Typography>
          </Grid>
        ))
      }
    </Grid>
  )
}

export const Lesson: React.FC = () => {
  const classes = useStyles()
  const params = useParams<LessonParams>()
  const history = useHistory()
  const lessonId = params.id

  const [lesson] = useLesson(lessonId)
  const [attendances] = useAttendancesByLessonId(lessonId)

  const handleAttendanceClick = useCallback(
    () => history.push(`/lesson/${lessonId}/attendance`),
    [lessonId, history])

  let commentText

  const hasFilledAttendance = !!(lesson?.lastAttendanceCheck)

  if (hasFilledAttendance) {
    commentText = (
      <>
        <Typography
          component="span"
          variant="body1"
          className={classes.filledComment}
        >
          <span role="img" aria-label="Проведено">✅</span> Проведено
        </Typography>
        <span className={classes.verticalDivider}>{'|'}</span>
        <Typography component="span" variant="body1">{`${attendances?.length} відсутні`}</Typography>
      </>
    )
  } else if (isToday(lesson?.date|| new Date()) || !isBefore((lesson?.date || new Date()), new Date())) {
    commentText = (
      <Typography
        component="span"
        variant="subtitle2"
        className={classes.notFilledComment}
      >
        <span role="img" aria-label="Не заповнено">🟠</span> Не заповнено
      </Typography>
    )
  } else {
    commentText = (
      <Typography
        component="span"
        variant="subtitle2"
        className={classes.notFilledPastComment}
      >
        <span role="img" aria-label="Не заповнено">🔴</span> Не заповнено
      </Typography>
    )
  }

  return (
    <>
      <Header
        title={`${lesson?.group.name} - ${lesson?.subject.name}`}
      />
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <div
            className={classes.summaryPanel}
          >
            <div>
              <Typography variant="h5">Відвідуваність</Typography>
              {commentText}
            </div>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AbsentStudentsList attendances={attendances || []} />
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button onClick={handleAttendanceClick} color="primary">
            Заповнити
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </>
  )
}