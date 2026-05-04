import MainHead from "@/components/PublicCompontents/MainHead";
import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Span,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Field, Input } from "@chakra-ui/react";
import useWallet from "./Hooks/useWallet";




export interface Transaction {
  walletAddress: string;
  transactionID: string;
}

const Wallet = () => {


  const {addProductsToMyPurchases,cartItems,data,decreaseStock,getTotalPrice,navigate,setTransactionData,transactionData} = useWallet()





  return (
    <>
      <Toaster />
      <MainHead head={data.head} />
      <Box paddingTop={0}>
        <Box bg={"#f3f4f6"} padding={10}>
          <VStack>
            <Image src={data.img} />
            <Heading
              marginTop={{ base: 2, sm: 3, md: 4, lg: 5 }}
              marginBottom={{ base: 2, sm: 3, md: 4, lg: 5 }}
              fontSize={{ base: "17px", sm: "24px", md: "35px", lg: "50px" }}
            >
              {data.title}
            </Heading>
          </VStack>
          <Text
            fontSize={{ base: "10px", sm: "14px", md: "18px", lg: "22px" }}
            color={"#777"}
          >
            {data.description}
          </Text>
          <Box marginTop={6}>
            <Box
              fontWeight={"bold"}
              fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}
            >
              <Text>
                Total amount of purchases :
                <Span color={"#957cd6"}>{getTotalPrice(cartItems)} $</Span>
              </Text>
              <Text>
                Shipping fees :<Span color={"#957cd6"}>10 $</Span>
              </Text>
              <Text>
                Final cost :
                <Span color={"#957cd6"}>{getTotalPrice(cartItems) + 10} $</Span>
              </Text>
            </Box>

            <Box
              fontWeight={"bold"}
              fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}
            >
              Minimum :<Span color={"#957cd6"}>No Minimum</Span>
            </Box>
            <Box
              fontWeight={"bold"}
              fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}
            >
              Fees : <Span color={"#957cd6"}>0% </Span>
            </Box>
            <Box
              fontWeight={"bold"}
              fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}
            >
              Rate 1 Credit =<Span color={"#957cd6"}>129 </Span>SYP
            </Box>
          </Box>

          <Box marginTop={10}>
            <form>
              <HStack position={"relative"}>
                <Field.Root>
                  <Field.Label
                    fontSize={{
                      base: "12px",
                      sm: "14px",
                      md: "18px",
                      lg: "23px",
                    }}
                  >
                    Wallet Address:
                  </Field.Label>
                  <Input
                    disabled
                    value={transactionData.walletAddress}
                    border={"1px solid #a800b7"}
                  />

                  <Field.ErrorText></Field.ErrorText>
                </Field.Root>
                <Button
                  right={0}
                  top={"42%"}
                  position={"absolute"}
                  size={"sm"}
                  bg={"#7008e7"}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      transactionData.walletAddress
                    );
                    toaster.create({
                      title: `Wallet Address has copied `,
                      type: "success",
                      duration: 5000,
                    });
                  }}
                >
                  <FiCopy />
                </Button>
              </HStack>
              <Field.Root marginTop={3}>
                <Field.Label
                  fontSize={{
                    base: "12px",
                    sm: "14px",
                    md: "18px",
                    lg: "23px",
                  }}
                >
                  Transaction ID:
                </Field.Label>
                <Input
                  type="number"
                  required
                  value={transactionData.transactionID}
                  onChange={(e) => {
                    setTransactionData({
                      ...transactionData,
                      transactionID: e.target.value,
                    });
                  }}
                  border={"1px solid #a800b7"}
                  placeholder="Enter Transaction ID"
                />
                <Field.ErrorText></Field.ErrorText>
              </Field.Root>
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setTransactionData({ ...transactionData, transactionID: "" });
                  decreaseStock(cartItems);
                  addProductsToMyPurchases(cartItems, new Date());
                  navigate("/mypurchases");
                }}
                marginTop={4}
                fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}
                width={"100%"}
                bg={"#7008e7"}
              >
                Recharge
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Wallet;
