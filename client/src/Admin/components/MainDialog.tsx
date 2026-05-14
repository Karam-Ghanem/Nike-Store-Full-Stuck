/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Product } from "@/components/Products/Products Data/productsList";
import { Button, CloseButton, Dialog, Portal, Span, Text } from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import { Toaster,toaster } from "@/components/ui/toaster";
import { Field, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  theProces: string;
  completeTheProcess: (parameter: any) => void;
  parameter: string | Product;
  children:ReactNode;
  id:string;
}
const MainDialog = ({theProces,completeTheProcess,parameter,children,id}:Props) => {

const url = window.location.href;
const isInMyPurchase = url.includes('mypurchase') ? true : false;
const unArchived = url.includes("archive") ? true : false;
const addedToArchive = url.includes("edit_delete_product") ? true : false;
const navigate = useNavigate()

  const [returnCause,setReturnCause] = useState('')
  return (
    <>
      <Toaster />
      <Dialog.Root>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title
                  color={"black"}
                >{`Confirm The ${theProces} Process`}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {addedToArchive ? (
                  <Span color={"green.500"} marginBottom={8} fontSize={11}>
                    Click the Discount button if you want to apply a discount to
                    this shoe instead of archiving it.
                  </Span>
                ) : (
                  ""
                )}
                <Text color={"black"}>
                  {`Are You Sure To ${theProces} This Shoese ?`}
                </Text>

                {isInMyPurchase && (
                  <Field.Root marginTop={2}>
                    <Input
                      placeholder="Please tell us why you returned the shoese"
                      value={returnCause}
                      onChange={(e) => {
                        setReturnCause(e.target.value);
                      }}
                      border={"1px solid #a800b7"}
                    />

                    <Field.ErrorText></Field.ErrorText>
                  </Field.Root>
                )}
              </Dialog.Body>
              <Dialog.Footer>



                {addedToArchive && (
                    <Dialog.ActionTrigger asChild>
                      <Button
                        onClick={() => {
                          navigate(`/admin/sale/${id}`);
                        }}
                        bg={"green.500"}
                      >
                        Discount
                      </Button>
                    </Dialog.ActionTrigger>
                )}
                <Dialog.ActionTrigger asChild>
                  <Button bg={"#E53935"} color={"white"}>
                    No
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button
                    bg={"#7008e7"}
                    onClick={() => {
                      completeTheProcess(parameter);
                      toaster.create({
                        title: `One Shoese ${
                          isInMyPurchase
                            ? "Returned"
                            : addedToArchive
                            ? "Archived"
                            : unArchived
                            ? "UnArchived"
                            : "Deleted"
                        } successfully!`,
                        type: "success",
                        duration: 5000,
                      });
                    }}
                  >
                    Yes
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>

              
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};


export default MainDialog;
