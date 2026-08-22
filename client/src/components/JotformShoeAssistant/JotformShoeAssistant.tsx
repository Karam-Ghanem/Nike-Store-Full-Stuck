import { Box, Heading, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

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
const JOTFORM_SCRIPT_SRC =
  "https://cdn.jotfor.ms/s/umd/76e215718e2/for-form-embed-handler.js";

const JotformShoeAssistant = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <Box
      as="section"
      aria-labelledby="shoe-assistant-title"
      width="100%"
      maxW="960px"
      marginX="auto"
      marginTop={{ base: 12, md: 16 }}
      marginBottom={{ base: 12, md: 16 }}
      paddingX={{ base: 0, md: 4 }}
    >
      <Heading
        id="shoe-assistant-title"
        textAlign="center"
        fontSize={{ base: "2xl", md: "3xl" }}
        marginBottom={2}
      >
        Shoe Assistant
      </Heading>
      <Text textAlign="center" color="gray.500" marginBottom={6}>
        Find the Nike shoes that best match your style and needs.
      </Text>
      <Box
        width="100%"
        minH="688px"
        overflow="hidden"
        borderRadius="lg"
        background="transparent"
      >
        <iframe
          id={JOTFORM_IFRAME_ID}
          title="Ula: مساعد اختيار أحذية"
          src={`${JOTFORM_ORIGIN}/agent/01a01f16f79070008b548ce63c5f97237f3b?embedMode=iframe&autofocus=0&background=1&shadow=1`}
          allow="geolocation; microphone; camera; fullscreen"
          frameBorder="0"
          scrolling="no"
          loading="lazy"
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
  );
};

export default JotformShoeAssistant;
