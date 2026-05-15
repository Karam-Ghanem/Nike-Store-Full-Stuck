import { Button, Card, Heading, Input, Text, VStack } from "@chakra-ui/react"

const CartCoupon = () => {
  return (
    <>
        <Card.Root
        border="1px solid #e2e2e2"
        p={{ base: 4, md: 5 }}
        bg="#fafafa"
        >
        <Heading
        fontSize={{
            base: "7px",
            sm: "12px",
            md: "16px",
            lg: "20px",
        }}
        mb={3}
        >
        Apply Coupon
        </Heading>
        <Text
        fontSize={{ base: 8, sm: 10, md: 12, lg: 15 }}
        color="gray.500"
        mb={3}
        >
        Enter your coupon code if you have one.
        </Text>
        <VStack gap={3}>
        <Input
            placeholder="Coupon"
            bg="white"
            size="sm"
            borderRadius="full"
        />
        <Button
            bg="#ba1e9a"
            color="white"
            borderRadius="full"
            px={6}
            fontSize={{ base: 13, sm: 14, md: 14, lg: 15 }}
            _hover={{ bg: "#7008e7" }}
        >
            APPLY
        </Button>
        </VStack>
    </Card.Root>
    </>
  )
}

export default CartCoupon
