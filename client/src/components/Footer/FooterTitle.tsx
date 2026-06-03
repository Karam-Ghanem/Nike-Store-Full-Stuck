import { Heading } from "@chakra-ui/react";

interface Props{
  title:string;
}

const FooterTitle = ({title}:Props) => {
  return (
    <>
      <Heading marginBottom={4} size={"3xl"} color={"#1d0180"}>
        {title}
      </Heading>
    </>
  );
}

export default FooterTitle;
