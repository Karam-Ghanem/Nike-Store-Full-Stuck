import { Box, Button, Field, Input } from "@chakra-ui/react";
import useCouponStore from "./couponStore";
import { useState } from "react";



const AddCoupon = () => {


    const {addCoupon} = useCouponStore()
    const [newCoupon,setNewCoupon] = useState<string>(' ')
    
  return (
          <Box marginTop={20}>
            <Field.Root>
                <Input
                    value={newCoupon}
                    onChange={(e) => {
                        setNewCoupon(e.target.value)
                    }}
                    border={"1px solid #a800b7"}
                    placeholder="Enter New Coupon"
                />
                <Field.ErrorText></Field.ErrorText>
            </Field.Root>
            <Button 
            onClick={() => {
                const code = newCoupon.trim();
                if (!code) return;
                void addCoupon(code).then(() => setNewCoupon(''));
            }}
             bg={'blue'} marginTop={5}>Add Coupon</Button>
      </Box>
  )
}

export default AddCoupon
