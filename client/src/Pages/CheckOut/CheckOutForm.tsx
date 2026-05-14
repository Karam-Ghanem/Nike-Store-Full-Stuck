import {Button, Textarea} from "@chakra-ui/react";
import { Accordion, Span } from "@chakra-ui/react";
import { Field, Input, Stack } from "@chakra-ui/react";
import type { AdressForm } from "./CheckOut";
import useCheckOut from "./Hooks/useCheckOut";


interface Props{
  sendAdressForm:(adress:AdressForm)=>void;
}


const CheckOutForm = ({sendAdressForm}:Props) => {


  const {adress,setAdress,adressValue,setAdressValue,} = useCheckOut();
  
  return (
    <Accordion.Root collapsible>
      <Accordion.Item value="form" bg="#f3f1f1" padding={3}>
        <Accordion.ItemTrigger>
          <Span
            flex="1"
            bg="#7008e7"
            color="white"
            padding={2}
            fontSize={{ base: "15px", sm: "22px", md: "25px", lg: "27px" }}
          >
            Billing Adress
          </Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <form action="">
              <Stack gap="4" align="flex-start" maxW="xl">
                <Field.Root>
                  {/* <Field.Label fontSize={"20px"}> Name</Field.Label> */}
                  <Input
                    value={adressValue.name}
                    onChange={(e) => {
                      setAdress({ ...adress, name: e.target.value });
                      setAdressValue({ ...adressValue, name: e.target.value });
                    }}
                    border={"1px solid #a800b7"}
                    placeholder="Name"
                  />
                  <Field.ErrorText></Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  {/* <Field.Label fontSize={"20px"}>Email</Field.Label> */}
                  <Input
                    type="email"
                    value={adressValue.email}
                    onChange={(e) => {
                      setAdress({ ...adress, email: e.target.value });
                      setAdressValue({ ...adressValue, email: e.target.value });
                    }}
                    border={"1px solid #a800b7"}
                    placeholder="Email"
                  />
                  <Field.ErrorText></Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  {/* <Field.Label fontSize={"20px"}>Phone</Field.Label> */}
                  <Input
                    value={adressValue.phone}
                    onChange={(e) => {
                      setAdress({ ...adress, phone: e.target.value });
                      setAdressValue({ ...adressValue, phone: e.target.value });
                    }}
                    border={"1px solid #a800b7"}
                    placeholder="Phone"
                  />
                  <Field.ErrorText></Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  {/* <Field.Label fontSize={"20px"}>Password</Field.Label> */}
                  {/* <Input border={"1px solid #a800b7"} /> */}
                  <Textarea
                    placeholder="Say Something"
                    outline="1px solid #a800b7"
                    value={adressValue.saySomething}
                    onChange={(e) => {
                      setAdress({ ...adress, saySomething: e.target.value });
                      setAdressValue({
                        ...adressValue,
                        saySomething: e.target.value,
                      });
                    }}
                  ></Textarea>
                  <Field.ErrorText></Field.ErrorText>
                </Field.Root>
                <Button
                  type="submit"
                  bg={"#7008e7"}
                  onClick={(e) => {
                    e.preventDefault();
                    sendAdressForm(adress);
                    setAdressValue({
                      email: "",
                      name: "",
                      phone: "",
                      saySomething: "",
                    });
                  }}
                >
                  Ok
                </Button>
              </Stack>
            </form>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default CheckOutForm;
