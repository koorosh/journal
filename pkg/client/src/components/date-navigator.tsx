import React, { useCallback } from 'react'
import { Button, ButtonGroup, createStyles, IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import { format, startOfWeek, addDays, isSameDay, isWeekend, subDays } from 'date-fns'
import { uk } from 'date-fns/locale'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'

export interface DateNavigatorProps {
  date: Date
  onChange: (date: Date) => void
  hideWeekends?: boolean
  showNavigationButtons?: boolean
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

const workingDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
const weekends = ['Сб', 'Нд']
const daysOfWeek = [...workingDays, ...weekends]

export const DateNavigator: React.FC<DateNavigatorProps> = (props: DateNavigatorProps) => {
  const classes = useStyles()
  const {
    date,
    onChange,
    hideWeekends,
    showNavigationButtons,
  } = props
  const firstDayOfWeek = startOfWeek(date, { weekStartsOn: 1 })

  const calendarDays = hideWeekends ? workingDays : daysOfWeek

  const weekDays = calendarDays.map((weekDayName, idx) => {
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

  const handleNextDayClick = useCallback((direction: boolean) => () => {
    let nextDay = addDays(date, direction ? 1 : -1)
    if (hideWeekends && isWeekend(nextDay)) {
      nextDay = addDays(nextDay, direction ? 2 : -2)
    }
    onChange(nextDay)
  }, [date])

  // const handlePrevDayClick = useCallback(() => {
  //   onChange(subDays(date, 1))
  // }, [date])

  return (
    <>
      {
        showNavigationButtons &&
        <IconButton onClick={handleNextDayClick(false)}>
          <KeyboardArrowLeftIcon />
        </IconButton>
      }

      <ButtonGroup
        className={classes.root}
        classes={{
          groupedTextHorizontal: classes.groupedTextHorizontal,
        }}
        variant="text"
        color="primary">
        {weekDays}
      </ButtonGroup>
      {
        showNavigationButtons &&
        <IconButton onClick={handleNextDayClick(true)}>
          <KeyboardArrowRightIcon/>
        </IconButton>
      }
    </>
  )
}

DateNavigator.defaultProps = {
  hideWeekends: true,
  showNavigationButtons: false
}