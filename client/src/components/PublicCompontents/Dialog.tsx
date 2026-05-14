"use client";

import { Button } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

const Demo = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        toaster.create({
          description: "File saved successfully",
          type: "info",
          closable: true,
        })
      }
    >
      Show Toast
    </Button>
  );
};

export default Demo