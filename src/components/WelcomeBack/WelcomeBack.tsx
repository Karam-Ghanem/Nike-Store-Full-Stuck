import { Box, Heading, HStack, Image } from "@chakra-ui/react";
import loginShoese from "@/assets/shoese/logshoes.png";
import logingShoeseBlur0 from "@/assets/shoese/logingShoeseBlur0.png";
import { Button, Field, Input, Stack } from "@chakra-ui/react";

const WelcomeBack = () => {
  return (
    <>
      <HStack>
        <Box display={{ base: "none", sm: "none", lg: "block" }}>
          <Image src={loginShoese} />
        </Box>
        <Box
          padding={{base:"2",sm:10}}
          className="w-2xl"
          style={{
            backgroundImage: `url(${logingShoeseBlur0})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Heading marginBottom={"40px"} size={{base:"2xl",sm:"3xl",md:"4xl",lg:"4xl"}}>
            Welcome Back!
          </Heading>
          <form action="">
            <Stack gap="4" align="flex-start" maxW="xl">
              <Field.Root>
                <Field.Label fontSize={"20px"}>User Name</Field.Label>
                <Input border={"1px solid #a800b7"} />
                <Field.ErrorText></Field.ErrorText>
              </Field.Root>

              <Field.Root>
                <Field.Label fontSize={"20px"}>Password</Field.Label>
                <Input border={"1px solid #a800b7"} />
                <Field.ErrorText></Field.ErrorText>
              </Field.Root>

              <Button fontSize={"15px"} bg={"#7008e7"} type="submit">
                Log In
              </Button>
            </Stack>
          </form>
        </Box>
      </HStack>
    </>
  );
};

export default WelcomeBack;
