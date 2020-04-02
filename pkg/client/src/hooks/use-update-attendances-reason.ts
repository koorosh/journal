import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

interface QueryResponse {
  status: boolean
}

interface AttendanceOptions {
  attendanceIds: string[]
  reason: string
}

const UPDATE_ATTENDANCES_REASON = gql`
  mutation updateAttendancesReason($attendanceIds: [ID]!, $reason: String!) {
    updateAttendancesReason(attendanceIds: $attendanceIds, reason: $reason) {
      status
    }
  }
`

export function useUpdateAttendancesReason() {
  return useMutation<QueryResponse, AttendanceOptions>(UPDATE_ATTENDANCES_REASON)
}