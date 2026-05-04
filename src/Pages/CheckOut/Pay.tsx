import MainHead from "@/components/PublicCompontents/MainHead";
import { Box, Button, Card, Container, Image, SimpleGrid } from "@chakra-ui/react";
import paymentMethod from "./Data/PaymentMethod";
import { Link } from "react-router-dom";


const Pay  = () => {

  return (
    <>
      <MainHead head="PAYMENT" />
      <Container>
        <SimpleGrid columns={{base:1,sm:1,md:2,lg:2}} gap={20}>
          {paymentMethod.map((payment) => (
            <Card.Root
              key={payment.value}
              flexDirection="row"
              overflow="hidden"
              // maxW="96"
            >
              <Image
                width={{base:'100px',sm:'200px',md:'130px',lg:'180px'}}
                objectFit="cover"
                src={payment.logo}
                alt="Pay Method"
              />
              <Box>
                <Card.Body>
                  <Card.Title mb="2">{payment.label}</Card.Title>
                  <Card.Description>{payment.description}</Card.Description>
                </Card.Body>
                <Card.Footer>
                  <Button bg={"#7008e7"} width={{base:'120px',sm:"150px" ,md:"120px" ,lg:"160px" }} >
                    <Link to={`wallet/${payment.value}`}>Continue To Pay</Link>
                  </Button>
                </Card.Footer>
              </Box>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};


export default Pay;