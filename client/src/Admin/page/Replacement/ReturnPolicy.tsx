import MainTitle from "@/components/PublicCompontents/MainTitle"
import { Box, Button, Container, Field, HStack, Input, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useReturnStore from "./ReturnStore";

const ReturnPolicy = () => {
  const [days,setDays] = useState<number|null>(0);
  const {setReturnPeriod, loadReturnPolicy} = useReturnStore()

  useEffect(() => {
    void loadReturnPolicy();
  }, [loadReturnPolicy]);
  return (
    <>
    <Container>
      <MainTitle title="Product return period"/>
            <Box marginTop={20}>
            <Field.Root >
              <HStack>
                  <Input
                  type="number"
                  min={1}
                    value={days!}
                    onChange={(e) => {
                      setDays(parseInt(e.target.value))
                    }}
                    border={"1px solid #a800b7"}
                    placeholder="Enter New Coupon"
                />
               <Text>Days</Text>
                </HStack>
                <Field.ErrorText></Field.ErrorText>
            </Field.Root>
            <Button 
            onClick={() => {
              if (!days || days < 1) return;
              void setReturnPeriod(days).then(() => setDays(null));
            }}
             bg={'blue'} marginTop={5}>Edit Product return period </Button>
      </Box>
    </Container>
    </>
  )
}

export default ReturnPolicy
