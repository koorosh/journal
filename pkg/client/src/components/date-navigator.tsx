import React from 'react'
import { Button, ButtonGroup, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { format, startOfWeek, addDays, isSameDay, isWeekend } from 'date-fns'
import { uk } from 'date-fns/locale'

export interface DateNavigatorProps {
  date: Date
  onChange: (date: Date) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100vw',
      justifyContent: 'center'
    },
    dateButton: {
      borderRadius: `${theme.spacing(2)}px!important`,
      paddingRight: theme.spacing(),
      paddingLeft: theme.spacing(),
    },
    buttonLabel: {
      display: 'flex',
      flexDirection: 'column',
    },
    groupedTextHorizontal: {
      borderRight: 'none!important'
    }
  }),
)


export const DateNavigator: React.FC<DateNavigatorProps> = (props: DateNavigatorProps) => {
  const classes = useStyles()
  const { date, onChange } = props
  const firstDayOfWeek = startOfWeek(date, { weekStartsOn: 1 })
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

  const weekDays = daysOfWeek.map((weekDayName, idx) => {
    const currDate = addDays(firstDayOfWeek, idx)
    const isSelectedDate = isSameDay(date, currDate)
    const todayIsWeekend = isWeekend(currDate)
    return (
      <Button
        variant={isSelectedDate ? 'contained' : 'text'}
        color={todayIsWeekend ? 'default' : 'primary'}
        className={classes.dateButton}
        classes={{ label: classes.buttonLabel }}
        onClick={() => onChange(currDate)}
      >
        {
          <>
            <Typography variant="subtitle2">{weekDayName}</Typography>
            <Typography variant="subtitle2">{format(currDate, 'dd', { locale: uk })}</Typography>
          </>
        }
      </Button>
    )
  })


  return (
    <ButtonGroup
      className={classes.root}
      classes={{
        groupedTextHorizontal: classes.groupedTextHorizontal,
      }}
      variant="text"
      color="primary">
      {weekDays}
    </ButtonGroup>
  )
}