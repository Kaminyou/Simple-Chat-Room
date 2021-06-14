import { gql } from 'apollo-boost'

export const CREATE_CHAT_MUTATION = gql`
  mutation addChat(
    $sender: String!
    $receiver: String!
    $body: String!
  ) {
    addChat(
      sender: $sender
      receiver: $receiver
      body: $body
    ) {
      sender
      receiver
      body
    }
  }
`
export const DELETE_CHAT_MUTATION = gql`
  mutation deleteChatByName(
    $name: String!
  ) {
    deleteChatByName(
      name: $name
    )
  }
`
