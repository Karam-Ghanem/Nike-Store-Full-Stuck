import { Box, Button } from "@chakra-ui/react";
import useCheckOut from "./Hooks/useCheckOut";

const CheckOutSubmitButton = () => {

    const {addressForm,navigate,setCheckOutForm,site} = useCheckOut()

  return (
    <>
    <Box marginTop={10}>
        <Button
            fontSize={{ base: "15px", sm: "22px", md: "25px", lg: "25px" }}
            bg={"#7008e7"}
            onClick={() => {
              setCheckOutForm({
                addressForm: addressForm,
                address: site,
              });

              navigate("pay");
            }}
          >
            Submit
        </Button>
    </Box>
    </>
  )
}

export default CheckOutSubmitButton
