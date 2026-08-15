import { Button, Card, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { commerceApi } from "@/api/commerce";
import useAuthStore from "@/auth/authStore";
import { toaster } from "@/components/ui/toaster";

import useCartStore from "./cartStore";

const CartCoupon = () => {
  const [coupon, setCoupon] = useState<string>('');
  const [endCoupon, setEndCoupon] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState(false);
  const { setCoupon: saveCoupon, isDiscounted, getTotalPrice, cartItems } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const applyCoupon = async () => {
    if (!user) {
      toaster.create({ title: 'Please log in before applying a coupon.', type: 'info', duration: 3500 });
      navigate('/auth');
      return;
    }
    if (!coupon.trim() || isDiscounted) return;
    setIsApplying(true);
    try {
      const result = await commerceApi.validateCoupon(coupon.trim(), getTotalPrice(cartItems));
      saveCoupon(result.code, Number(result.discount_amount));
      setEndCoupon(true);
      toaster.create({
        title: `Coupon applied. You saved ${Number(result.discount_amount).toFixed(2)} $.`,
        type: 'success',
        duration: 4000,
      });
    } catch (error) {
      toaster.create({
        title: error instanceof Error ? error.message : 'Unable to apply this coupon.',
        type: 'error',
        duration: 4500,
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card.Root border="1px solid #e2e2e2" p={{ base: 4, md: 5 }} bg="#fafafa">
      <Heading
        fontSize={{ base: "7px", sm: "12px", md: "16px", lg: "20px" }}
        mb={3}
      >
        Apply Coupon
      </Heading>
      <Text fontSize={{ base: 8, sm: 10, md: 12, lg: 15 }} color="gray.500" mb={3}>
        Enter your coupon code if you have one to get a 50% discount.
      </Text>
      <VStack gap={3}>
        <Input
          value={endCoupon ? '' : coupon}
          onChange={(event) => setCoupon(event.target.value)}
          placeholder="Coupon"
          bg="white"
          size="sm"
          borderRadius="full"
        />
        <Button
          disabled={!coupon.trim() || endCoupon || isApplying}
          loading={isApplying}
          bg="#ba1e9a"
          color="white"
          borderRadius="full"
          px={6}
          fontSize={{ base: 13, sm: 14, md: 14, lg: 15 }}
          _hover={{ bg: "#7008e7" }}
          onClick={() => void applyCoupon()}
        >
          APPLY
        </Button>
      </VStack>
    </Card.Root>
  );
};

export default CartCoupon;
