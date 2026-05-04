import useTextReview from "@/Pages/Review/Hook/useTextReview";
import { SimpleGrid, Card, Avatar } from "@chakra-ui/react";

const TextReview = () => {
  const { reviews } = useTextReview();

  return (
    <SimpleGrid
      columns={{ base: 1, sm: 1, md: 3, lg: 3, xl: 3 }}
      gap="40px"
      justifyContent="space-between"
      marginTop={100}
    >
      {reviews.map((item) => (
        <Card.Root key={item.name} boxShadow={"0 0 12px #7008e7"}>
          <Card.Body
            gap="2"
            className="bg-linear-65 from-purple-200 to-pink-200"
          >
            <Avatar.Root
              width={20}
              height={20}
              borderRadius="50%"
              overflow={"hidden"}
              size="lg"
              shape="rounded"
            >
              <Avatar.Image src={item.img} alt="karam" />
              <Avatar.Fallback name="person img" />
            </Avatar.Root>
            <Card.Title mb="2">{item.name}</Card.Title>
            <Card.Description
              fontSize={{
                base: "12px",
                sm: "15px",
                md: "12px",
                lg: "14px",
                xl: "16px",
              }}
            >
              {item.description}
            </Card.Description>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
};
export default TextReview;
