import {gql} from 'apollo-server'

const typeDefs = gql`
    type Query {
        students: [Student]
        student(id: ID!): Student
        groups: [Group]
        group(id: ID!): Group
    }

    type User {
        id: ID!
        email: String!
    }

    type Student {
        id: ID!
        firstName: String!
        lastName: String!
        phone: String
    }

    type Group {
        id: ID!
        name: String!
        year: Int!
    }

    type Mutation {
        createStudent(
            firstName: String!
            lastName: String!
            phone: String
        ): Student
        
        createGroup(
            name: String!
            year: Int!
        ): Group
    }

#    type StudentUpdateResponse {
#        success: Boolean!
#        message: String
#        students: [Student]
#    }
`

export default typeDefs
