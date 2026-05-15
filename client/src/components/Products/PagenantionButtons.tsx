import { Box, Button, Flex } from "@chakra-ui/react";
interface Props{
    currentPage:number;
    setCurrentPage:(currentPage:number)=>void;
    needed:number;
}
const PagenantionButtons = ({currentPage,setCurrentPage,needed}:Props) => {
  return (
    <>
                  <Flex justifyContent={"center"} marginTop={8}>
                <Button
                  bg={"#7008e7"}
                  disabled={currentPage == 1}
                  _disabled={{ cursor: "menuitem" }}
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  Prev
                </Button>

                <Box margin={"10px 20px"}></Box>
                <Button
                  bg={"#7008e7"}
                  disabled={currentPage == needed}
                  _disabled={{ cursor: "menuitem" }}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  Next
                </Button>
              </Flex>
    </>
  )
}

export default PagenantionButtons
