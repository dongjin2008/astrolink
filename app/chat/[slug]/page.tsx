"use client"
import { useUserIdStore, useBirthSignStore } from "@/lib/store";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, checkRoomStatus, breakRoom } from "@/app/actions";
import { createClient } from "@/app/utils/supabase/client";

interface ChatParmas {
  slug: string;
}

type Message = {
  id: Number,
  created_at: string,
  user: string,
  room: string,
  message: string
}

type Room = {
  id: Number,
  created_at: string,
  room_name: string,
  users: string[]
  zodiac: string
}


export default function Chat({params}: {params: ChatParmas}) {
  const { slug } = params
  const { sign } = useBirthSignStore();
  const { userId } = useUserIdStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUserJoined, setIsUserJoined] = useState(false);
  const supabase = createClient()
  const chatEndRef = useRef<HTMLDivElement>(null);

  function handleSubmit() {
    sendMessage(slug, userId, message)
    setMessage('')
  }

  useEffect(() => {
    const handleBeforeUnload = (e: Event) => {
      e.preventDefault();
      breakRoom(slug)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect (() => {
    const channel1 = supabase.channel("realtime message").on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, (payload) => {
      const newMessage = payload.new as Message
      console.log("hello")
      if (newMessage.room === slug) {
        console.log(newMessage)
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }
    }).subscribe()

    return () => {
      console.log("bye")
      supabase.removeChannel(channel1)
    }
  }, [supabase, messages, setMessages, slug])

  useEffect(() => {
    const channel2 = supabase.channel("user joined").on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
    }, (payload) => {
      const userJoined = payload.new as Room
      console.log("hello")
      console.log(userJoined)
      if (userJoined.users.length === 2 && userJoined.users.includes(userId)) {
        setIsUserJoined(true)
      }
    }).subscribe()
    return () => {
      console.log("bye")
      supabase.removeChannel(channel2)
    }
  }, [supabase, userId, setIsUserJoined])

  useEffect(() => {
    checkRoomStatus(slug).then((status) => {
      if (status) {
        setIsUserJoined(true)
      }
    })
  }, [slug, setIsUserJoined])

  return (
    <div>
      <div className="flex flex-col justify-between h-screen">
        <div className="flex flex-col p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
            key={String(msg.id)}
            className={`flex ${
              msg.user === userId ? "justify-end" : "justify-start"
            }`}>
              <div
                className={`max-w-xs p-3 rounded-lg bg-secondary ${
                  msg.user === userId
                    ? "text-right"
                    : "text-left"
                }`}>
                  <p>{msg.message}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}/>
        </div>
        <div className="flex flex-row w-full sticky bottom-0">
          <Input className="ml-3" type="text" placeholder="Enter the message..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={handleSubmit}>Send</Button>
        </div>
      </div>
    </div>

  );
}