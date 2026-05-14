import { Accordion, Span, Box, Text } from "@chakra-ui/react";
import { LocationPicker } from "./LocationPicker";
import { useState } from "react";

async function getAddress(lat: number, lng: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();
  return data.display_name;
}
interface Props{
  sendAddress:(address:string)=>void
}
const MyMap = ({sendAddress}:Props) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("");

  return (
    <Accordion.Root collapsible>
      <Accordion.Item value="address" marginTop={20} bg="#f3f1f1" padding={3}>
        <Accordion.ItemTrigger>
          <Span
            flex="1"
            fontSize={{ base: "15px", sm: "22px", md: "25px", lg: "27px" }}
          >
            Set Your Delivery Point
          </Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>

        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <LocationPicker
              onChange={async (coords) => {
                setLocation(coords);

                // تحويل الإحداثيات لعنوان
                const addr = await getAddress(coords.lat, coords.lng);
                setAddress(addr);
                sendAddress(address);
              }}
            />

            {location && (
              <Box mt={4} p={3} bg="white" borderRadius="md" boxShadow="sm">
                <Text fontWeight="bold">Selected Location:</Text>
                {address && (
                  <>
                    <Text mt={2} color="purple.600" fontWeight="bold">
                      Address: {address}
                    </Text>
                  </>
                )}
              </Box>
            )}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default MyMap;
