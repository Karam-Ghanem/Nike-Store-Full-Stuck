import { Button, Card, Flex, GridItem, Heading, Separator, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import useCartStore from "./cartStore";
import CartCoupon from "./CartCoupon";

const CartTotalAndCoupon = () => {
  const { cartItems, couponDiscountAmount, getFinalPrice, getTotalPrice, isDiscounted } = useCartStore();
  const subtotal = getTotalPrice(cartItems);
  const total = getFinalPrice();

  return (
    <GridItem>
      <VStack align="stretch" gap={6}>
        <Card.Root border="1px solid #e2e2e2" p={{ base: 4, md: 5 }} bg="#fafafa">
          <Heading fontSize={{ base: "7px", sm: "12px", md: "15px", lg: "19px" }} mb={4}>
            Cart Totals
          </Heading>

          <VStack align="stretch" gap={3}>
            <Flex justify="space-between">
              <Text color="gray.600" fontSize={{ base: "7px", sm: "12px", md: "16px", lg: "20px" }}>
                Subtotal
              </Text>
              <Text fontWeight="semibold" fontSize={{ base: "xs", md: "sm" }}>
                {subtotal.toFixed(2)} $
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
                others
              </Text>
              <Text color="red.500" fontWeight="semibold" fontSize={{ base: "xs", md: "sm" }}>
                {isDiscounted ? `Discounted ${couponDiscountAmount.toFixed(2)} $` : '0 $'}
              </Text>
            </Flex>

            <Separator />

            <Flex justify="space-between">
              <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                Total
              </Text>
              <Text fontWeight="bold" color="#7008e7" fontSize={{ base: "sm", md: "md" }}>
                {total.toFixed(2)} $
              </Text>
            </Flex>
          </VStack>
          <Button
            mt={6}
            w="100%"
            className="storefront-checkout-button"
            bg="#ba1e9a"
            color="white"
            borderRadius="full"
            _hover={{ bg: "#7008e7" }}
            fontSize={{ base: 13, sm: 14, md: 14, lg: 15 }}
          >
            <Link to="/checkout">Check Out</Link>
          </Button>
        </Card.Root>

        <CartCoupon />
      </VStack>
    </GridItem>
  );
};

export default CartTotalAndCoupon;
