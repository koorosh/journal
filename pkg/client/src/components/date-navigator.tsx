import React, { useCallback } from 'react'
import { Button } from '@material-ui/core'
import { add, sub, format } from 'date-fns'
import { uk } from 'date-fns/locale'

export interface DateNavigatorProps {
  date: Date
  onChange: (date: Date) => void
}

export const DateNavigator: React.FC<DateNavigatorProps> = (props: DateNavigatorProps) => {
  const { date, onChange } = props
  const handleBack = useCallback(() => onChange(sub(date, { days: 1 })), [date])
  const handleForward = useCallback(() => onChange(add(date, { days: 1 })), [date])
  return (
    <div>
      <Button onClick={handleBack}>Назад</Button>
      <span>{format(date, 'dd MMMM yy', { locale: uk })}</span>
      <Button onClick={handleForward}>Далі</Button>
    </div>
  )
}