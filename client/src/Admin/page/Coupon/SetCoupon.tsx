import MainTitle from "@/components/PublicCompontents/MainTitle";
import { Container, Table, Box, Flex, Text} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import useCouponStore from "./couponStore";
import AddCoupon from "./AddCoupon";

const SetCoupon = () => {

    const {coupons,removeCoupon} = useCouponStore()

  // 🎨 ألوان تتغير حسب الثيم
  const cardBg = useColorModeValue("white", "#1a1a1a");
  const borderColor = useColorModeValue("#e2e2e2", "#333");
  const headerBg = useColorModeValue("#fafafa", "#222");
  const headerColor = useColorModeValue("gray.700", "gray.300");
  const cellColor = useColorModeValue("gray.800", "gray.200");
  const hoverBg = useColorModeValue("#f7e6fa", "#2a2a2a");

  return (
    <Container maxW="600px" mt={10}>
      <MainTitle title="COUPON" />

      <Box
        border="1px solid"
        borderColor={borderColor}
        borderRadius="12px"
        overflow="hidden"
        bg={cardBg}
        boxShadow="sm"
      >
        <Table.Root size="md">
          <Table.Header bg={headerBg}>
            <Table.Row>
              <Table.ColumnHeader
                textAlign="center"
                fontSize="20px"
                color={headerColor}
                fontWeight={'bold'}
              >
                Coupon Code
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {coupons.map((coupon) => (
              <Table.Row
                key={coupon.id}
                _hover={{ bg: hoverBg }}
                transition="0.2s"
              >
                <Table.Cell
                  textAlign="center"
                  fontSize="15px"
                  py={4}
                  fontWeight="500"
                  color={cellColor}
                >
                  <Flex justifyContent={'space-between'}>
                      {coupon.coupon}
                              <Text
                              _hover={{
                                cursor: "pointer",
                                bg: "red",
                                color: "white",
                                border: "none",
                              }}
                              transition="0.3s"
                              px={2}
                              marginLeft={{ base: -4 }}
                              border="1px solid #333"
                              fontSize={{
                                base: "7px",
                                sm: "12px",
                                md: "16px",
                                lg: "18px",
                              }}
                              onClick={() => {
                                  removeCoupon(coupon.id)
                              }}
                            >
                              X
                            </Text>
                    </Flex>
                  
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      {/* add coupon */}
      <AddCoupon/>

    </Container>
  );
};

export default SetCoupon;
