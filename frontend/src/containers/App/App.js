import './App.css'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import {
  CHATS_QUERY,
  CREATE_CHAT_MUTATION,
  DELETE_CHAT_MUTATION,
  CHATS_SUBSCRIPTION
} from '../../graphql'
import { Button, Input, message, Tag } from 'antd'

const App = () => {
  const [firstlogin, setFirstlogin] = useState(true)
  const [login, setLogin] = useState(false)
  const [thissender, setThisSender] = useState('')

  const [receiver, setReceiver] = useState('')
  const [body, setBody] = useState('')

  const bodyRef = useRef(null);

  const [getChat, { loading, data, refetch, subscribeToMore}] = useLazyQuery(CHATS_QUERY);
  const [addChat] = useMutation(CREATE_CHAT_MUTATION)
  const [deleteChat] = useMutation(DELETE_CHAT_MUTATION)

  
  useEffect(() => {
    console.log("useeffect",thissender)
    if (login && subscribeToMore) {
      
    subscribeToMore({
      document: CHATS_SUBSCRIPTION,
      variables: { name: thissender },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newChat = subscriptionData.data.user.data
        return {
          ...prev,
          getChatByName: [...prev.getChatByName, newChat]
          
        }
      }
    })
  }}, [subscribeToMore])


  const handleChatSubmit = useCallback(
    () => {

      if (!thissender || !receiver || !body) return

      addChat({
        variables: {
          sender: thissender,
          receiver: receiver,
          body: body
        }
      })

      setReceiver('')
      setBody('')
    },
    [addChat, thissender, receiver, body]
  )
  

  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s
      const content = {
        content: msg,
        duration: 0.5
      }

      switch (type) {
        case 'success':
          message.success(content)
          break
        case 'info':
          message.info(content)
          break
        case 'danger':
        default:
          message.error(content)
          break
      }
    }
  }

  const login_f = () => {
    console.log(firstlogin);
    setLogin(true);
    if (firstlogin){
      getChat({ variables: { name: thissender } })
      setFirstlogin(false);
    }
    else {
      refetch({ variables: { name: thissender } });
    }
  }

  const logout_f = () => {
    console.log("Bye", thissender);
    setThisSender('');
    setLogin(false);
  }

  const sendChat = () =>{
    handleChatSubmit();
    displayStatus({
      type: 'success',
      msg: `Send message ${body} to ${receiver}`
    })
    console.log(data);
  }

  const delete_all = () => {
    deleteChat({
      variables: {
        name: thissender
      }
    })
    refetch({
      variables: {
        name: thissender
      }
    })
  }

  const empty = (
    <div></div>
  )

  const clear_bottom = (
    <div>
    <Button type="primary" danger onClick={() => delete_all()}>
      Clear
    </Button>
    <Button type="primary" onClick={() => logout_f()}>
      Logout
    </Button>
    </div>
  )

  const login_main = (
    <Input.Search
      rows={4}
      value={thissender}
      ref={bodyRef}
      enterButton="Login"
      onChange={(e) => {
        setThisSender(e.target.value);
      }}
      placeholder="Your Name"
      onSearch={(msg) => {
        if (!msg) {
          displayStatus({
            type: 'error',
            msg: 'Please enter YOUR NAME.'
          })
          return
        }
        login_f();
      }}
    ></Input.Search>
  )

  const show_chat = () => {
    if (data) {
      if (data.getChatByName.length === 0) {
        return <p>No messages</p>
      }
      else {
      console.log(data.getChatByName)
      console.log("this", thissender)
      return (data.getChatByName.map(({ sender, receiver, body }, i) => (
        <p className="App-message" key={i}>
          {(thissender === sender) ? (<Tag color="red">To {receiver}</Tag>) : (<Tag color="blue">From {sender}</Tag>)}
        {body}
        </p>)))}
    } else {
        return <p>Loading...</p>
    }
  }

  return (
    <div className="App">
      <div className="App-title">
        <h1>Simple Chat</h1>
        {login ? clear_bottom : empty} 
      </div>
      <div>
      {login ? (
    <div>
      <p>Hello {thissender}</p>
      <div className="App-messages">
        {show_chat()}
        </div>
        <Input
          placeholder="Receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          style={{ marginBottom: 10 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              bodyRef.current.focus()
            }
          }}
        ></Input>
        <Input.Search
          rows={4}
          value={body}
          ref={bodyRef}
          enterButton="Send"
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message here..."
          onSearch={(msg) => {
            if (!msg || !receiver) {
              displayStatus({
                type: 'error',
                msg: 'Please enter a username and a message body.'
              })
              return
            }
            sendChat()
          }}
        ></Input.Search>
    </div>
  ) : login_main} 
      </div>
    </div>
  )
}

export default App