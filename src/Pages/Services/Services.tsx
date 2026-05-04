import { Heading, SimpleGrid, Box, Text } from "@chakra-ui/react";
import MainHead from "@/components/PublicCompontents/MainHead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ServicesData from "./ServicesData";
import {components} from "./ServicesData";

const Services = () => {


  return (
    <Box>
      <MainHead head="OUR SERVICES" />
      <SimpleGrid
        columns={{ base: 1, sm: 1, md: 3, lg: 3, xl: 3 }}
        gap="0px"
        textAlign={"center"}
      >
        {ServicesData.map((item) => {
          return (
            <Box key={item.name} marginBottom={"70px"}>
              <Box marginBottom={"30px"}>
                <FontAwesomeIcon
                  icon={components[item.img as keyof typeof components]}
                  size="4x"
                  color="#ffa500"
                />
              </Box>
              <Heading
                size={{
                  base: "2xl",
                  sm: "3xl",
                  md: "2xl",
                  lg: "2xl",
                  xl: "3xl",
                }}
                marginBottom={"30px"}
              >
                {item.name}
              </Heading>
              <Text
                fontSize={{ base: 16, sm: 18, md: 14, lg: 15, xl: 18 }}
                color={"777"}
              >
                {item.description}
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Services;
