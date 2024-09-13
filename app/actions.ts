'use server'
import { createClient } from "@/app/utils/supabase/client"
import { create } from "domain"

export async function signIn(zodiac: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("users")
    .upsert({
      zodiac: zodiac,
    })
    .select()

  if (error) {
    console.error(error)
    return
  }
  return data![0]["id"]
}

export async function findOrCreateRoom(userId: string, zodiac: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("rooms").select("*").eq("zodiac", zodiac)
  if (error) {
    console.log(error)
    return "error occured"
  }
  if (data.length > 0) {
    const availableRooms = data.filter((d) => d["users"].length === 1)
    if (availableRooms.length > 0) {
      const rand_number = Math.floor(Math.random() * availableRooms.length);
      const selectedRoom = availableRooms[rand_number]
      const new_users = [...selectedRoom["users"], userId]
      console.log("Your room name is: ", data[rand_number]["room_name"])
      const { error: updateError } = await supabase.from("rooms").update({ users: new_users }).eq("room_name", selectedRoom["room_name"])
      if (updateError) {
        return updateError
      }
      return selectedRoom["room_name"]
    }
  }
  const { data: upsertData, error: upsertError } = await supabase.from("rooms").upsert({
    room_name: userId+"_"+zodiac,
    users: [userId],
    zodiac: zodiac
  })
  console.log(upsertData)
  if (upsertError) {
    console.log(upsertError)
    return "error occured"
  }
  return userId+"_"+zodiac;
}

export async function getMessages(roomId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("messages").select("*").eq("room", roomId)
  if (error) {
    return error
  }
  return data
}

export async function sendMessage(roomId: string, userId: string, message: string) {
  const supabase = createClient();
  const { error } = await supabase.from("messages").insert({user: userId, room: roomId, message: message})
  if (error) {
    return error
  }
  return
}

export async function checkRoomStatus(roomId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("rooms").select("*").eq('room_name', roomId)
  if (error) {
    return error
  }
  if (data && data.length > 0) {
    const room = data[0]
    if (room.users.length === 2) {
      return true
    }
  }
  return false
}