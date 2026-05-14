import useStarsReview from "@/Pages/Review/Hook/useStarsReview";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";

const ReviewWithStars = () => {
  const { FillStars, ResetStars, currentStars, hiddenBtn, setHiddenBtn } = useStarsReview();

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      padding={5}
      className="bg-linear-65 from-purple-200 to-pink-200"
      marginBottom={"100px"}
      boxShadow={"10px 10px 5px #c69df6"}
    >
      <Box>
        <Text color={"#7008e7"} fontSize={"20px"}>
          We appreciate your time, and we would be delighted if you could rate
          your experience with us to help us continuously improve our services.
        </Text>
        <HStack justifyContent={"center"} marginTop={5}>
          {currentStars.map((star, index) => (
            <AiFillStar
              key={index}
              color={star.color}
              size={star.size}
              cursor={star.cursor}
              onClick={() => {
                FillStars(star.id);
                setHiddenBtn(false);
              }}
            />
          ))}
        </HStack>
        <Box textAlign={"center"} display={hiddenBtn ? "none" : "block"}>
          <Button
            marginTop={6}
            bg={"#a353e9"}
            color={"white"}
            onClick={() => {
              setHiddenBtn(true);
            }}
            transition={"0.5s"}
            _hover={{ bg: "green", color: "white", fontSize: "17px" }}
          >
            Submit
          </Button>
          <Button
            marginTop={6}
            marginStart={6}
            bg={"#a353e9"}
            color={"white"}
            onClick={() => {
              ResetStars();
              setHiddenBtn(true);
            }}
            transition={"0.5s"}
            _hover={{ bg: "transparent", color: "red", fontSize: "17px" }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewWithStars;
