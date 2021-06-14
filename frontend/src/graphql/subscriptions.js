import { gql } from 'apollo-boost'

export const CHATS_SUBSCRIPTION = gql`
  subscription user($name: String!){
    user(name: $name) {
      mutation
      data {
        sender
        receiver
        body
      }
    }
  }
`
