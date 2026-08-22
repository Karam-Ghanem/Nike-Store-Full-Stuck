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
import { Field, Input } from "@chakra-ui/react";

import { commerceApi } from "@/api/commerce";
import useAuthStore from "@/auth/authStore";
import { Toaster, toaster } from "@/components/ui/toaster";
import useCartStore from "@/Pages/Cart/cartStore";

import useCheckoutStore from "./checkoutStore";
import MainTitle from "@/components/PublicCompontents/MainTitle";
import useWallet from "./Hooks/useWallet";

export interface Transaction {
  walletAddress: string;
  transactionID: string;
}

const Wallet = () => {
  const { data, navigate, setTransactionData, transactionData } = useWallet();
  const cartItems = useCartStore((state) => state.cartItems);
  const couponCode = useCartStore((state) => state.couponCode);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getFinalPrice = useCartStore((state) => state.getFinalPrice);
  const clearCartAfterOrder = useCartStore((state) => state.clearCartAfterOrder);
  const loadPurchases = useCartStore((state) => state.loadPurchases);
  const addressForm = useCheckoutStore((state) => state.addressForm);
  const location = useCheckoutStore((state) => state.location);
  const resetCheckout = useCheckoutStore((state) => state.reset);
  const user = useAuthStore((state) => state.user);

  const submitOrder = async () => {
    if (!user) {
      toaster.create({ title: 'Please log in before completing your order.', type: 'info', duration: 3500 });
      navigate('/auth');
      return;
    }
    if (!addressForm) {
      toaster.create({ title: 'Please complete your billing address first.', type: 'error', duration: 4000 });
      navigate('/checkout');
      return;
    }
    if (!cartItems.length) {
      toaster.create({ title: 'Your cart is empty.', type: 'error', duration: 4000 });
      navigate('/cart');
      return;
    }

    const items = cartItems.map((item) => {
      const size = item.product.sizesAndQuantities.find((candidate) => candidate.Size === item.currentShoseSize);
      if (!size?.apiSizeId) throw new Error('This product is not available for checkout yet. Please reload your cart.');
      return {
        product_id: Number(item.product.id),
        product_size_id: size.apiSizeId,
        quantity: item.currentShoseQuantity,
      };
    });

    try {
      await commerceApi.createOrder({
        full_name: addressForm.name,
        email: addressForm.email,
        phone: addressForm.phone,
        message: [addressForm.saySomething, location ? `Location: ${location}` : ''].filter(Boolean).join('\n'),
        coupon_code: couponCode || undefined,
        items,
      });
      setTransactionData({ ...transactionData, transactionID: '' });
      await clearCartAfterOrder();
      resetCheckout();
      await loadPurchases();
      toaster.create({ title: 'Your order has been created successfully.', type: 'success', duration: 4000 });
      navigate('/mypurchases');
    } catch (error) {
      toaster.create({
        title: error instanceof Error ? error.message : 'Unable to create your order.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Toaster />
      <MainTitle title={data.head} />
      <Box paddingTop={0}>
        <Box bg="#f3f4f6" padding={10}>
          <VStack>
            <Image src={data.img} />
            <Heading marginTop={{ base: 2, sm: 3, md: 4, lg: 5 }} marginBottom={{ base: 2, sm: 3, md: 4, lg: 5 }} fontSize={{ base: "17px", sm: "24px", md: "35px", lg: "50px" }}>
              {data.title}
            </Heading>
          </VStack>
          <Text fontSize={{ base: "10px", sm: "14px", md: "18px", lg: "22px" }} color="#777">
            {data.description}
          </Text>
          <Box marginTop={6}>
            <Box fontWeight="bold" fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}>
              <Text>Total amount of purchases :<Span color="#957cd6">{getTotalPrice(cartItems).toFixed(2)} $</Span></Text>
              <Text>Shipping fees :<Span color="#957cd6">10 $</Span></Text>
              <Text>Final cost :<Span color="#957cd6">{(getFinalPrice() + 10).toFixed(2)} $</Span></Text>
            </Box>
            <Box fontWeight="bold" fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}>
              Minimum :<Span color="#957cd6">No Minimum</Span>
            </Box>
            <Box fontWeight="bold" fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}>
              Fees : <Span color="#957cd6">0% </Span>
            </Box>
            <Box fontWeight="bold" fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}>
              Rate 1 Credit =<Span color="#957cd6">129 </Span>SYP
            </Box>
          </Box>

          <Box marginTop={10}>
            <form>
              <HStack position="relative">
                <Field.Root>
                  <Field.Label fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}>Wallet Address:</Field.Label>
                  <Input disabled value={transactionData.walletAddress} border="1px solid #a800b7" />
                  <Field.ErrorText />
                </Field.Root>
                <Button
                  right={0}
                  top="42%"
                  position="absolute"
                  size="sm"
                  bg="#7008e7"
                  onClick={() => {
                    navigator.clipboard.writeText(transactionData.walletAddress);
                    toaster.create({ title: 'Wallet Address has copied ', type: 'success', duration: 5000 });
                  }}
                >
                  <FiCopy />
                </Button>
              </HStack>
              <Field.Root marginTop={3}>
                <Field.Label fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}>Transaction ID:</Field.Label>
                <Input
                  type="number"
                  required
                  value={transactionData.transactionID}
                  onChange={(event) => setTransactionData({ ...transactionData, transactionID: event.target.value })}
                  border="1px solid #a800b7"
                  placeholder="Enter Transaction ID"
                />
                <Field.ErrorText />
              </Field.Root>
              <Button
                type="submit"
                onClick={(event) => {
                  event.preventDefault();
                  void submitOrder();
                }}
                marginTop={4}
                fontSize={{ base: "12px", sm: "14px", md: "18px", lg: "23px" }}
                width="100%"
                bg="#7008e7"
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
