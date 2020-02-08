import { times, flatMapDeep } from 'lodash'
import faker from 'faker'
import { eachDayOfInterval, isWeekend, sub, add } from 'date-fns'

import { connectToDb } from '../src/db'
import {
  StudentsModel,
  PersonsModel,
  TeachersModel,
  ParentsModel,
  GroupsModel,
  LessonsModel,
  SubjectsModel,
  Group, Teacher, Subject
} from '../src/models'

const url = process.env.MONGODB_URI

const seed = async () => {
  const groupYears = [2020, 2019, 2018, 2017, 2016, 2015]
  const groupNames = [
    '1-А', '1-Б',
    '2-А', '2-Б',
    '3-А', '3-Б',
    '4-А', '4-Б',
    '5-А', '5-Б',
    '6-А', '6-Б',
    '7-А', '7-Б',
    '8-А', '8-Б',
    '9-А', '9-Б',
  ]
  const numberOfGroups = groupYears.length * groupNames.length
  const studentsPerGroup = 30
  const numberOfTeachers = 40
  const lessonsNo = [1, 2, 3, 4, 5, 6]

  const subjectNames = [
    'Українська мова',
    'Українська література',
    'Зарубіжна література',
    'Математика',
    'Алгебра',
    'Геометрія',
    'Англ мова',
    'Фізичне виховання',
    'Правознавство',
    'Малювання',
  ]

  const subjectModels = subjectNames.map(name => {
    const subjectModel = new SubjectsModel({
      name
    })
    return subjectModel.save()
  })

  const subjects = await Promise.all(subjectModels)

  const studentPersonModels = times(numberOfGroups * studentsPerGroup).map(_ => {
    const personModel = new PersonsModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
    })
    return personModel.save()
  })

  const studentPersons = await Promise.all(studentPersonModels)

  const teacherPersonModels = times(numberOfTeachers).map(_ => {
    const personModel = new PersonsModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
    })
    return personModel.save()
  })

  const teacherPersons = await Promise.all(teacherPersonModels)

  const parentPersonModels = times(numberOfGroups * studentsPerGroup * 2).map(_ => {
    const personModel = new PersonsModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
    })
    return personModel.save()
  })

  const parentPersons = await Promise.all(parentPersonModels)

  const studentModels = studentPersons.map((person) => {
    const studentModel = new StudentsModel({
      person
    })
    return studentModel.save()
  })

  const students = await Promise.all(studentModels)

  const groupData = groupNames.map(name => groupYears.map(year => [name, year]))
    .reduce((acc, i) => [...acc, ...i], [])

  const groupModels = groupData.map(([name, year], idx) => {
    const groupModel = new GroupsModel({
      name,
      year,
      students: students.slice(idx * studentsPerGroup, idx * studentsPerGroup + studentsPerGroup).map(s => s._id)
    })
    return groupModel.save()
  })

  const groups = await Promise.all(groupModels)

  const parentModels = parentPersons.map((person) => {
    const parentModel = new ParentsModel({
      person
    })
    return parentModel.save()
  })

  const parents = await Promise.all(parentModels)

  const teacherModels = teacherPersons.map((person) => {
    const teacherModel = new TeachersModel({
      person,
      positions: ['teacher']
    })
    return teacherModel.save()
  })

  const teachers = await Promise.all(teacherModels)


  // Lessons from 2 last weeks up for today
  const today = new Date()
  const twoMonthsAgo = sub(today, { months: 2 })
  const twoMonthsNext = add(today, { months: 2 })
  const workingDays = eachDayOfInterval({ start: twoMonthsAgo, end: twoMonthsNext }).filter(day => !isWeekend(day))

  const lessonModels = workingDays.map(day => {
    return groups.map(group => {
      return lessonsNo.map(lessonNo => {
        return new LessonsModel({
          order: lessonNo,
          date: day,
          group: group._id,
          teacher: faker.random.arrayElement(teachers),
          subject: faker.random.arrayElement(subjects),
        })
        // return lessonModel.save()
      })
    })
  })

  const lessons = await LessonsModel.collection.insertMany(flatMapDeep(lessonModels))
}

connectToDb(url)
  .then(async (connection) => {
    await seed()
    return connection.disconnect()
  })