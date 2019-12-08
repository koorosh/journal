import Knex from 'knex'
import uuid from 'uuid'
import faker from 'faker'

export async function seed(knex: Knex): Promise<any> {
  const persons = Array(240).fill(1)
    .map(() => ({
      id: uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      phone: faker.phone.phoneNumber()
    }))

  const students = persons.map(person => ({
    id: uuid(),
    person_id: person.id,
  }))

  const groupNames = [
    '1-Б',
    '1-Б',
    '7-В',
    '6-А',
    '2-Б',
    '2-В',
    '8-А',
    '5-Б',
  ]

  const groups = groupNames.map(gn => ({
    id: uuid(),
    name: gn,
    year: faker.random.arrayElement([2017, 2018, 2019])
  }))

  const subjectNames = [
    'Українська мова',
    'Українська література',
    'Історія України',
    'Алгебра',
    'Геометрія',
    'Малювання',
    'Фізичне виховання',
    'Трудове навчання',
    'Географія',
    'Біологія',
    'Політологія',
  ]

  const subjects = subjectNames.map(subject => ({
    id: uuid(),
    name: subject,
  }))

  type Person = typeof persons[0]
  type Student = typeof students[0]
  type Group = typeof groups[0]

  const studentsPerGroupCount = Math.ceil(students.length / groups.length)

  const groupStudents = students.reduce((acc: Array<Array<Student>>, value: Student, idx: number) => {
    const bucketIdx = Math.floor(idx / studentsPerGroupCount)
    if (!acc[bucketIdx]) {
      acc[bucketIdx] = []
    }
    acc[bucketIdx].push(value)
    return acc
  }, [])
    .map((studentsBucket, idx) => {
      return studentsBucket.map(student => ({
        group_id: groups[idx].id,
        student_id: student.id,
      }))
    })
    .reduce((acc, value) => acc.concat(value), [])

  const populateTable = (tableName: string, data: any[]): Promise<any> => {
    return knex(tableName).del()
      .then(() => knex(tableName).insert(data))
  }

  return Promise.all([
    populateTable('persons', persons)
      .then(() => populateTable('students', students))
      .then(() => populateTable('groups', groups))
      .then(() => populateTable('group_students', groupStudents)),
    populateTable('subjects', subjects),
  ])
}
