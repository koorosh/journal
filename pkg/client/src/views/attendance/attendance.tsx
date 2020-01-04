import React from 'react'
import { Link } from 'react-router-dom'
import { Grid } from '@material-ui/core'

interface AttendanceProps {

}

export const Attendance: React.FC<AttendanceProps> = (props: AttendanceProps) => {
  return (
    <Grid>
      <Link to={'/'}>Home</Link>

    </Grid>
  )
}
