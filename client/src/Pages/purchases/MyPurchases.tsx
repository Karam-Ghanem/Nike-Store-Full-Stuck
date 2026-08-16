import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CloseButton,
  Dialog,
  Field,
  Flex,
  HStack,
  Image,
  Popover,
  Portal,
  Table,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { MdInfoOutline } from "react-icons/md";

import useCartStore from "@/Pages/Cart/cartStore";
import useReturnStore from "@/Admin/page/Replacement/ReturnStore";
import { Toaster, toaster } from "@/components/ui/toaster";
import MainTitle from "@/components/PublicCompontents/MainTitle";

const MyPurchases = () => {
  const myPurchases = useCartStore((state) => state.myPurchases);
  const loadPurchases = useCartStore((state) => state.loadPurchases);
  const returnProduct = useCartStore((state) => state.returnProduct);
  const returnPeriod = useReturnStore((state) => state.returnPeriod);
  const loadReturnPolicy = useReturnStore((state) => state.loadReturnPolicy);
  const [allowed, setAllowed] = useState(false);
  const [returnTarget, setReturnTarget] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    void loadPurchases();
    void loadReturnPolicy();
  }, [loadPurchases, loadReturnPolicy]);

  const requestReturn = async (itemKey: string, reason = '') => {
    try {
      await returnProduct(itemKey, reason);
      toaster.create({ title: 'Your return request has been submitted.', type: 'success', duration: 4000 });
      return true;
    } catch (error) {
      toaster.create({
        title: error instanceof Error ? error.message : 'Unable to submit the return request.',
        type: 'error',
        duration: 5000,
      });
      return false;
    }
  };

  if (myPurchases.length < 1) {
    return (
      <Box minHeight={{ base: "auto", sm: "300px" }}>
        <MainTitle title="No Products To Show" />
      </Box>
    );
  }

  return (
    <>
      <Toaster />
      <Dialog.Root
        open={Boolean(returnTarget)}
        onOpenChange={({ open }) => {
          if (!open) {
            setReturnTarget(null);
            setReturnReason('');
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Request Product Return</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text mb={3}>You can tell us why you want to return this product, or leave the field empty.</Text>
                <Field.Root>
                  <Field.Label>Reason (optional)</Field.Label>
                  <Textarea
                    value={returnReason}
                    onChange={(event) => setReturnReason(event.target.value)}
                    placeholder="Tell us the reason for the return (optional)"
                    border="1px solid #a800b7"
                    rows={4}
                  />
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  bg="#7008e7"
                  color="white"
                  onClick={async () => {
                    if (!returnTarget) return;
                    const success = await requestReturn(returnTarget, returnReason);
                    if (success) {
                      setReturnTarget(null);
                      setReturnReason('');
                    }
                  }}
                >
                  Submit Return
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <MainTitle title="MY PURCHASES" />

      <Box maxW="1100px" mx="auto" p={{ base: 2, md: 6 }}>
        <Flex direction="column" gap={6}>
          <Card.Root borderRadius="lg" overflow="hidden" p={2}>
            <Table.Root w="100%">
              <Table.Header bg="#f6f6f6">
                <Table.Row>
                  {['Image', 'Product (Quantity)', 'Price', 'Date', 'Return'].map((label) => (
                    <Table.ColumnHeader
                      key={label}
                      color="#7008e7"
                      textAlign="center"
                      fontSize={{ base: "7px", sm: "12px", md: "15px", lg: "25px" }}
                    >
                      {label}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {myPurchases.map((purchase) => {
                  const orderedAt = purchase.orderedAt ? new Date(purchase.orderedAt) : new Date();
                  const deadline = new Date(orderedAt.getTime() + (returnPeriod || 7) * 24 * 60 * 60 * 1000);
                  const expired = new Date() > deadline;
                  const pending = purchase.returnStatus === 'requested';
                  const closed = purchase.returnStatus === 'approved' || purchase.returnStatus === 'rejected';

                  return (
                    <Table.Row key={purchase.orderItemId || purchase.currentShoeseID}>
                      <Table.Cell textAlign="center">
                        <Popover.Root>
                          <Popover.Trigger asChild>
                            <Image width={{ base: "50px", sm: "80px", md: "100px", lg: "100px" }} src={purchase.product.productImg} />
                          </Popover.Trigger>
                          <Portal>
                            <Popover.Positioner>
                              <Popover.Content>
                                <Popover.Arrow />
                                <Popover.Body>
                                  <Image width="100%" src={purchase.product.productImg} />
                                </Popover.Body>
                              </Popover.Content>
                            </Popover.Positioner>
                          </Portal>
                        </Popover.Root>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize={{ base: "7px", sm: "12px", md: "16px", lg: "20px" }}>
                          {`${purchase.product.productName} (${purchase.currentShoseQuantity})`}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize={{ base: "7px", sm: "12px", md: "16px", lg: "20px" }}>
                          {purchase.product.productPrice}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize={{ base: "7px", sm: "12px", md: "16px", lg: "20px" }}>
                          {`${orderedAt.getDate()}-${orderedAt.getMonth() + 1}-${orderedAt.getFullYear()}`}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {pending ? (
                          <Text color="#7008e7" fontSize={{ base: "8px", md: "14px" }}>Return requested</Text>
                        ) : closed ? (
                          <Text color={purchase.returnStatus === 'approved' ? 'green.600' : 'red.500'} fontSize={{ base: "8px", md: "14px" }}>
                            Return {purchase.returnStatus}
                          </Text>
                        ) : expired ? (
                          <HStack justify="center">
                            {allowed && <Text color="red" fontSize={{ base: "7px", sm: "12px", md: "16px" }}>{`Sorry You Can Not Replace After ${returnPeriod || 7} Days`}</Text>}
                            <Button variant="ghost" p={0} minW="auto" onClick={() => setAllowed(!allowed)}>
                              <MdInfoOutline size={22} color="red" />
                            </Button>
                          </HStack>
                        ) : (
                          <Button
                            width={{ base: "40px", sm: "60px", md: "80px", lg: "100px" }}
                            fontSize={{ base: "7px", sm: "12px", md: "16px", lg: "20px" }}
                            bg="#7008e7"
                            _hover={{ backgroundColor: "#E53935", color: "#333" }}
                            onClick={() => {
                              setReturnTarget(purchase.currentShoeseID);
                              setReturnReason('');
                            }}
                          >
                            Return
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Flex>
      </Box>
    </>
  );
};

export default MyPurchases;
