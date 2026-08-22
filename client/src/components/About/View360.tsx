import { Box, Image, Stack, HStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import webImgs from "./WebImgs";
import aboutShoese1 from "../../assets/shoese/red_shoes1.png";

interface Props {
  images?: Array<string | undefined>;
}

const View360 = ({ images = [] }: Props) => {
  const galleryImages = useMemo(() => {
    const productImages = images.filter((image): image is string => Boolean(image));
    return productImages.length ? productImages : webImgs.map((item) => item.src);
  }, [images]);
  const [selectedImage, setSelectedImage] = useState(galleryImages[0] ?? aboutShoese1);

  useEffect(() => {
    setSelectedImage(galleryImages[0] ?? aboutShoese1);
  }, [galleryImages]);

  return (
    <HStack
      justifyContent="center"
      alignItems="flex-start"
      gap={{ base: 4, md: 8 }}
      marginBottom={10}
      flexWrap={{ base: "wrap", md: "nowrap" }}
    >
      <Stack
        direction={{ base: "row", md: "column" }}
        justifyContent="space-between"
        gap={3}
        maxW={{ base: "100%", md: "120px" }}
      >
        {galleryImages.map((image, index) => (
          <Box
            key={`${image}-${index}`}
            cursor="pointer"
            border={selectedImage === image ? "3px solid #701ad1" : "1px solid #facfeb"}
            borderRadius="md"
            width={{ base: "65px", md: "100px" }}
            height={{ base: "65px", md: "100px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={image}
              alt={`Product view ${index + 1}`}
              width="100%"
              height="100%"
              objectFit="contain"
              onClick={() => setSelectedImage(image)}
            />
          </Box>
        ))}
      </Stack>
      <Box
        border="3px solid #701ad1"
        borderRadius={10}
        boxShadow="0 0 8px #c72092"
        width={{ base: "100%", md: "400px" }}
        height={{ base: "300px", md: "400px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src={selectedImage}
          alt="Selected product view"
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </Box>
    </HStack>
  );
};

export default View360;
