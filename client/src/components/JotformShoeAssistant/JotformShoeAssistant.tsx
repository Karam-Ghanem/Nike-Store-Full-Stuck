import { Box, Button, CloseButton, Heading, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    jotformEmbedHandler?: (
      selector: string,
      origin: string,
    ) => void;
  }
}

const JOTFORM_IFRAME_ID =
  "JotFormIFrame-01a01f16f79070008b548ce63c5f97237f3b";
const JOTFORM_ORIGIN = "https://eu.jotform.com";
const JOTFORM_AGENT_URL =
  `${JOTFORM_ORIGIN}/agent/01a01f16f79070008b548ce63c5f97237f3b` +
  "?embedMode=iframe&autofocus=0&background=1&shadow=1";
const JOTFORM_SCRIPT_SRC =
  "https://cdn.jotfor.ms/s/umd/76e215718e2/for-form-embed-handler.js";

const JotformShoeAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const runEmbedHandler = () => {
      window.jotformEmbedHandler?.(
        `iframe[id='${JOTFORM_IFRAME_ID}']`,
        JOTFORM_ORIGIN,
      );
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${JOTFORM_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      runEmbedHandler();
      return;
    }

    const script = document.createElement("script");
    script.src = JOTFORM_SCRIPT_SRC;
    script.async = true;
    script.onload = runEmbedHandler;
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      scriptRef.current?.remove();
      scriptRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <Button
        aria-label="Open shoe assistant"
        position="fixed"
        right={{ base: 4, md: 8 }}
        bottom={{ base: 4, md: 8 }}
        zIndex={1000}
        colorPalette="purple"
        borderRadius="full"
        boxShadow="lg"
        onClick={() => setIsOpen(true)}
      >
        Shoe Assistant
      </Button>

      {isOpen && (
        <Box
          role="dialog"
          aria-modal="true"
          aria-labelledby="shoe-assistant-title"
          position="fixed"
          inset={0}
          zIndex={1100}
          background="rgba(0, 0, 0, 0.68)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={{ base: 3, md: 6 }}
          onClick={() => setIsOpen(false)}
        >
          <Box
            position="relative"
            width="100%"
            maxW="960px"
            height={{ base: "calc(100vh - 24px)", md: "760px" }}
            background="white"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <CloseButton
              aria-label="Close shoe assistant"
              position="absolute"
              top={3}
              right={3}
              zIndex={2}
              background="white"
              onClick={() => setIsOpen(false)}
            />

            <Box paddingTop={{ base: 4, md: 5 }} paddingX={4}>
              <Heading
                id="shoe-assistant-title"
                textAlign="center"
                fontSize={{ base: "lg", md: "xl" }}
                marginBottom={1}
              >
                Shoe Assistant
              </Heading>
              <Text
                textAlign="center"
                color="gray.500"
                fontSize={{ base: "sm", md: "md" }}
                marginBottom={2}
              >
                Find the Nike shoes that best match your style and needs.
              </Text>
            </Box>

            <iframe
              id={JOTFORM_IFRAME_ID}
              title="Ula: مساعد اختيار أحذية"
              src={JOTFORM_AGENT_URL}
              allow="geolocation; microphone; camera; fullscreen"
              frameBorder="0"
              scrolling="no"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "100%",
                height: "688px",
                border: "none",
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default JotformShoeAssistant;
