import { getMonth } from 'date-fns'

const SEPTEMBER_MONTH = 8

export function getEducationYear(date: Date): number {
  const currentMonth = getMonth(date)
  const currentYear = date.getFullYear()

  if (currentMonth >= SEPTEMBER_MONTH) {
    return currentYear
  }
  return currentYear - 1
}

export function getCurrentEducationYear() {
  return getEducationYear(new Date())
}