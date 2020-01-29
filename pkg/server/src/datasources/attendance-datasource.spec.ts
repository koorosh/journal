import 'mocha'
import { assert } from 'chai'
import { AttendanceDataSource } from './attendance-datasource'
import { connectToDb } from '../db'

describe('AttendanceDataSource', function () {
  let connection

  before(async() => {
    //TODO: Connect to test instance and populate data.
    connection = await connectToDb()
  })

  after(() => {
    connection.disconnect()
  })

  describe('findByGroupAndDate', function () {
    it('returns attendance model if it exists', async () => {
      const attendanceDataSource = new AttendanceDataSource()
      const results = await attendanceDataSource.findByGroupAndDate('5e2cc79ce347240acabfbca1', new Date(2020, 0, 25))
      assert.lengthOf(results, 1)
    })
  })
})