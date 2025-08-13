"use client";

import { Button } from "@/components/ui/button";
import { use, useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, []);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
