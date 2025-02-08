"use client";

import Grade from "@/components/grade/Grade";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

export default function Home() {
  // const [counter, setCounter] = useState(0);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {/* <h1 className="text-7xl">Hello World</h1>
      <h2 className="text-4xl">{counter}</h2>
      <Button variant="default" onClick={() => setCounter(c => c + 1)}>Click</Button> */}
      <Grade />
    </div>
  );
}
