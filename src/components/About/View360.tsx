import { Box, Image, Stack,HStack } from "@chakra-ui/react";

import webImgs from "./WebImgs";
import aboutShoese1 from "../../assets/shoese/red_shoes1.png";

import { useState } from "react";

const View360 = () => {
  const [aboutShoese, setAboutShoese] = useState(aboutShoese1);

  return (
    <HStack justifyContent={"center"} marginBottom={10}>
      <Stack
        marginRight={10}
        direction="column"
        bg=""
        justifyContent="space-between"
      >
        {webImgs.map((item) => (
          <Box
            key={item.src}
            marginBottom={3}
            className=" bg-linear-65 from-purple-500 to-pink-500"
            cursor="pointer"
            border={item.border}
            width={item.width}
          >
            <Image
              src={item.src}
              alt=""
              onClick={() => setAboutShoese(item.src)}
            />
          </Box>
        ))}
      </Stack>
      <Box
        border={"3px solid #701ad1"}
        borderRadius={10}
        boxShadow={"0 0 8px #c72092"}
      >
        <img width={400} src={aboutShoese} alt="" />
      </Box>
    </HStack>
  );
};

export default View360;
