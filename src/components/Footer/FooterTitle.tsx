import { Heading } from "@chakra-ui/react";

interface Props{
  head:string;
}

const FooterTitle = ({head}:Props) => {
  return (
    <>
      <Heading marginBottom={4} size={"3xl"} color={"#1d0180"}>
        {head}
      </Heading>
    </>
  );
}

export default FooterTitle;
