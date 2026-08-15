import { Box, SimpleGrid } from "@chakra-ui/react";
import MainTitle from "@/components/PublicCompontents/MainTitle";

import CheckOutForm from "./CheckOutForm";
import CheckOutSubmitButton from "./CheckOutSubmitButton";
import CheckOutTable from "./CheckOutTable";
import useCheckoutStore, { type CheckoutAddress } from "./checkoutStore";
import MyMap from "./MyMap";

export interface AdressForm extends CheckoutAddress {}

export interface CheckOutForm {
  addressForm: AdressForm | undefined;
  address: string;
}

const CheckOut = () => {
  const setAddressForm = useCheckoutStore((state) => state.setAddressForm);
  const setLocation = useCheckoutStore((state) => state.setLocation);

  return (
    <>
      <MainTitle title="CHECK OUT" />
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} gap="40px">
        <Box>
          <CheckOutForm sendAdressForm={setAddressForm} />
          <MyMap sendAddress={setLocation} />
        </Box>
        <Box>
          <CheckOutTable />
        </Box>
        <CheckOutSubmitButton />
      </SimpleGrid>
    </>
  );
};

export default CheckOut;
