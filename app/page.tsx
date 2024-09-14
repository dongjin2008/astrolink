"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { starSign } from "@/lib/starSign";
import { useBirthSignStore, useUserIdStore } from "@/lib/store";
import { useEffect, useState } from "react";
import  { useRouter } from "next/navigation";
import { findOrCreateRoom, signIn } from "./actions";

export default function Home() {
  const { setSign } = useBirthSignStore();
  const { setUserId } = useUserIdStore();
  const [input_data, setInput_Data] = useState(Date);
  const router = useRouter();

  async function onSubmit1(data: string) {
    try {
      const birth_date = new Date(data);
      const birth_sign = starSign(birth_date);
      console.log("Birth sign:", birth_sign);
      const userId = await signIn(birth_sign);
      setUserId(userId);
      console.log("User ID:", userId);
      if (!userId) {
        throw new Error("Failed to sign in");
      }
      const selected_room = await findOrCreateRoom(userId, birth_sign);
      console.log("Available rooms:", selected_room);
      setSign(birth_sign);
      router.push(`/chat/${selected_room}`);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  }

  function handleKeypress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      onSubmit1(input_data);
    }
  }

  return (
    <div className="my-52">
      <h1 className="text-6xl text-center mb-24">Connect with other based on <br/> Your Star Sign</h1>
      <div className="w-full flex justify-center">
        <div className="flex flex-col justify-center w-96">
          <Input className="w-full" type="date" onKeyDown={handleKeypress} onChange={(e) => setInput_Data(e.target.value)}/>
          <Button onClick={() => onSubmit1(input_data)} className="w-64 mt-4 mx-auto">Submit</Button>
        </div>
      </div>
    </div>
  );
}