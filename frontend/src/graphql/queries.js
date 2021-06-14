import { gql } from 'apollo-boost'

export const CHATS_QUERY = gql`
  query getChatByName(
    $name: String!
  ){
    getChatByName(name:$name){
      sender
      receiver
      body
    }
  }
`
