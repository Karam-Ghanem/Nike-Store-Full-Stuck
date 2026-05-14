import MainHead from "@/components/PublicCompontents/MainHead";
import {
  Box,
  Button,
  Container,
  Field,
  HStack,
  Input,
  Menu,
  Portal,
  Span,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Toaster, toaster } from "@/components/ui/toaster";
import useSalesAdmin from "./Hook/useSalesAdmin";

const Sale = () => {
  const {
    id,
    applyDiscount,
    applyDiscountOnShoese,
    categoriesAndGenders,
    selectedPercentage,
    selectedType,
    setSelectedPercentage,
    setSelectedType,
    shoeseName,
  } = useSalesAdmin();

  return (
    <Container maxW="container.lg" px={{ base: 2, md: 4 }}>
      <Toaster />

      <Box mt={{ base: 2, md: -10 }}>
        <MainHead head="Sales" />
      </Box>

      {/* TYPE SELECTOR */}
      {!id && (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant="outline"
              size="sm"
              bg="white"
              width={'100%'}
              mt={4}
              fontSize={{ base: "12px", sm: "14px", md: "16px", lg: "18px" }}
            >
              {selectedType === "" ? "Choose product type ▼" : selectedType}
            </Button>
          </Menu.Trigger>

          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {categoriesAndGenders.map((catgen) => (
                  <Menu.Item
                    value="new-txt"
                    onClick={() => setSelectedType(catgen.label)}
                    key={catgen.value}
                    fontSize={{ base: "12px", sm: "14px", md: "16px" }}
                  >
                    {catgen.label}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )}

      {/* PERCENTAGE INPUT */}
      <Field.Root mt={8}>
        <VStack align="" width="100%">
          <Field.Label
            fontSize={{ base: "12px", sm: "14px", md: "16px", lg: "18px" }}
            width={'fit-content'}
          >
            Make percentage discounts : 
          </Field.Label>

          <HStack width="100%" flexWrap="wrap" align="center">
            <Input
              type="number"
              min={1}
              max={100}
              value={selectedPercentage}
              width={{ base: "40%", sm: "25%", md: "15%" }}
              onChange={(e) => setSelectedPercentage(parseInt(e.target.value))}
              border="1px solid #a800b7"
              placeholder="%"
              fontSize={{ base: "12px", sm: "14px", md: "16px", lg: "18px" }}
            />
            <Text fontSize={{ base: "14px", sm: "16px", md: "18px" }}>%</Text>
          </HStack>

          {selectedPercentage > 100 && (
            <Text
              color="red"
              fontSize={{ base: "11px", sm: "13px", md: "15px", lg: "16px" }}
            >
              Please Enter Number Between 1 And 100
            </Text>
          )}
        </VStack>
      </Field.Root>

      {/* RESULT BOX */}
      <Box
        border="1px solid #a800b7"
        p={4}
        mt={10}
        // width={{ base: "100%", sm: "70%", md: "40%", lg: "25%" }}
        width={'100%'}
        borderRadius="md"
      >
        <VStack textAlign="center">
          <HStack
            fontSize={{ base: "12px", sm: "14px", md: "16px", lg: "18px" }}
            flexWrap="wrap"
            justify="center"
          >
            <Text>Apply</Text>
            <Span color="#7008e7">
              {selectedPercentage <= 1 || isNaN(selectedPercentage)
                ? "......"
                : selectedPercentage}
              %
            </Span>

            {!id && (
              <Text>
                discount on{" "}
                <Span>
                  {selectedType === "" ? "......" : selectedType + "'"}s
                  products
                </Span>
              </Text>
            )}

            {id && (
              <Text>
                discount on{" "}
                <Span fontWeight="bold" color="#7008e7">
                  "{shoeseName}"
                </Span>
              </Text>
            )}
          </HStack>

          {/* BUTTONS */}
          {selectedPercentage > 1 &&
            selectedPercentage <= 100 &&
            (id || selectedType !== "") && (
              <HStack justify="center" flexWrap="wrap">
                <Button
                  bg="#7008e7"
                  color="white"
                  width={{ base: "40%", sm: "30%" }}
                  fontSize={{
                    base: "12px",
                    sm: "14px",
                    md: "16px",
                    lg: "18px",
                  }}
                  onClick={() => {
                    if (id) {
                      applyDiscountOnShoese(id, selectedPercentage);
                    } else {
                      applyDiscount(selectedType, selectedPercentage);
                      setSelectedType("");
                    }
                    setSelectedPercentage(0);

                    toaster.create({
                      title: `A ${selectedPercentage}% discount has been applied.`,
                      type: "success",
                      duration: 5000,
                    });
                  }}
                >
                  Ok
                </Button>

                <Button
                  bg="red"
                  color="white"
                  width={{ base: "40%", sm: "30%" }}
                  fontSize={{
                    base: "12px",
                    sm: "14px",
                    md: "16px",
                    lg: "18px",
                  }}
                  onClick={() => {
                    setSelectedPercentage(0);
                    setSelectedType("");
                  }}
                >
                  Cancel
                </Button>
              </HStack>
            )}
        </VStack>
      </Box>
    </Container>
  );
};

export default Sale;
