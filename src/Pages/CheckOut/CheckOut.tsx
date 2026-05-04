import MainHead from "@/components/PublicCompontents/MainHead";
import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import CheckOutForm from "./CheckOutForm";
import MyMap from "./MyMap";
import CheckOutTable from "./CheckOutTable";
import useCheckOut from "./Hooks/useCheckOut";


export interface AdressForm {
  name: string;
  email: string;
  phone: string;
  saySomething: string;
}

export interface CheckOutForm {
  addressForm: AdressForm | undefined;
  address: string;
}
export interface AdressForm{
  name:string;
  email:string;
  phone:string;
  saySomething:string;
}
const CheckOut = () => {


const {addressForm,navigate,setAdressForm,setCheckOutForm,setSite,site} = useCheckOut()


  return (
    <>
      <MainHead head="CHECK OUT" />
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} gap="40px">
        <Box>
          <CheckOutForm sendAdressForm={(adress) => setAdressForm(adress)} />
          <MyMap sendAddress={(address) => setSite(address)} />
        </Box>
        <Box>
          <CheckOutTable />
        </Box>
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
      </SimpleGrid>
    </>
  );
};

export default CheckOut;
