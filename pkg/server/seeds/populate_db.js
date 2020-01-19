const uuid = require('uuid')
const faker = require('faker')
const _ = require('lodash')

const studentsCount = 240
const maxParentsPerStudent = 5

exports.seed = function(knex) {
  const persons = Array(studentsCount).fill(1)
    .map(() => ({
      id: uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      phone: faker.phone.phoneNumber()
    }))

  const parentPersons = Array(studentsCount * 5).fill(1)
    .map(() => ({
      id: uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      phone: faker.phone.phoneNumber()
    }))

  const teacherPersons = Array(50).fill(1)
    .map(() => ({
      id: uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      phone: faker.phone.phoneNumber()
    }))

  const teachers = teacherPersons.map(person => ({
    id: uuid(),
    person_id: person.id,
  }))

  const students = persons.map((person) => ({
    id: uuid(),
    person_id: person.id,
  }))

  const parents = parentPersons.map(person => ({
    id: uuid(),
    person_id: person.id
  }))

  // iterate over children and combine with parents
  const parentChildren = _.chain(persons)
    .flatMap(person => {
      const numberOrRelatives = faker.random.number({
        min: 1,
        max: maxParentsPerStudent,
        precision: 1
      })
      return _.times(numberOrRelatives, () => person)
    })
    .zip(parents)
    .filter(([studentPerson, parent]) => !!(studentPerson && parent))
    .map(([studentPerson, parent]) => {
      return {
        parent_id: parent.id,
        child_person_id: studentPerson.id
      }
    })
    .value()

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

  const studentsPerGroupCount = Math.ceil(students.length / groups.length)

  const groupStudents = students.reduce((acc, value, idx) => {
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

  const populateTable = (tableName, data) => {
    return knex(tableName).del()
      .then(() => knex(tableName).insert(data))
  }

  return Promise.all([
    populateTable('persons', [
      ...persons,
      ...parentPersons,
      ...teacherPersons,
    ])
      .then(() => populateTable('students', students))
      .then(() => populateTable('groups', groups))
      .then(() => populateTable('group_students', groupStudents))
      .then(() => populateTable('parents', parents))
      .then(() => populateTable('parent_children', parentChildren))
      .then(() => populateTable('teachers', teachers)),
    populateTable('subjects', subjects),
  ])
}
