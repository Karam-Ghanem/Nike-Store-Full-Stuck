import MainHead from "@/components/PublicCompontents/MainTitle";
import { Box, SimpleGrid } from "@chakra-ui/react";
import CheckOutForm from "./CheckOutForm";
import MyMap from "./MyMap";
import CheckOutTable from "./CheckOutTable";
import useCheckOut from "./Hooks/useCheckOut";
import CheckOutSubmitButton from "./CheckOutSubmitButton";


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


const {setAdressForm,setSite} = useCheckOut()


  return (
    <>
      <MainHead title="CHECK OUT" />
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} gap="40px">
        <Box>
          <CheckOutForm sendAdressForm={(adress) => setAdressForm(adress)} />
          <MyMap sendAddress={(address) => setSite(address)} />
        </Box>
        <Box>
          <CheckOutTable />
        </Box>
          <CheckOutSubmitButton/>
      </SimpleGrid>
    </>
  );
};

export default CheckOut;
