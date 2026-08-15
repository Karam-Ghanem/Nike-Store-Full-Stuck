import MainTitle from "@/components/PublicCompontents/MainTitle";
import useReviewStore from "@/Pages/Review/reviewStore";
import {
  Box,
  Button,
  Card,
  Text,
  SimpleGrid,
  Badge,
  Accordion,
  Span,
} from "@chakra-ui/react";

import type { CheckBoxItem, RadioItem } from "@/Pages/Review/Data/Qustions";
import { useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";

const UsersReview = () => {
  const { checkEvalutes, radioEvalutes, reviews, loadReviews, removeReview } = useReviewStore();

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const deleteReview = async (reviewId: number) => {
    try {
      await removeReview(reviewId);
      toaster.create({ title: 'Review deleted successfully.', type: 'success', duration: 3500 });
    } catch (error) {
      toaster.create({ title: error instanceof Error ? error.message : 'Unable to delete review.', type: 'error', duration: 4500 });
    }
  };

  return (
    <>
      <Toaster />
      <MainTitle
        title="USERS REVIEWS"
      />

      <Text color="#7008e7" fontWeight="bold" fontSize={{ base: '18px', md: '24px' }} marginTop={6} marginBottom={4}>Published Reviews</Text>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 2 }} gap={5} padding={{ base: 3, sm: 4, md: 5 }}>
        {reviews.map((review) => (
          <Card.Root key={review.id || `${review.name}-${review.description}`} border="1px solid #e5d1f5" padding={4}>
            <Card.Title color="#7008e7">{review.name}</Card.Title>
            <Card.Description marginTop={2}>{review.description}</Card.Description>
            {review.id && <Button size="sm" colorPalette="red" alignSelf="flex-end" marginTop={3} onClick={() => void deleteReview(review.id!)}>Delete</Button>}
          </Card.Root>
        ))}
      </SimpleGrid>

      <Text color="#7008e7" fontWeight="bold" fontSize={{ base: '18px', md: '24px' }} marginTop={8} marginBottom={2}>Survey Responses</Text>
      <SimpleGrid
        columns={{ base: 1, sm: 1, md: 2, lg: 2 }}
        gap={{ base: 4, sm: 6, md: 8, lg: 10 }}
        padding={{ base: 3, sm: 4, md: 5 }}
      >
        {checkEvalutes.map((checkGroup: CheckBoxItem[], index: number) => (
          <Accordion.Root
            key={index}
            collapsible
            defaultValue={[]}
            padding={0}
            width="100%"
            color={'#7008e7'}
          >
            <Accordion.Item value={`review-${index}`}>
              {/* TRIGGER */}
              <Accordion.ItemTrigger
                style={{
                  background: "#f3f3f3",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Span
                  flex="1"
                  fontSize={{
                    base: "14px",
                    sm: "16px",
                    md: "18px",
                    lg: "20px",
                  }}
                  fontWeight="bold"
                >
                  Review #{index + 1}
                </Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>

              {/* CONTENT */}
              <Accordion.ItemContent>
                <Accordion.ItemBody
                  style={{
                    borderWidth: "1px",
                    borderRadius: "8px",
                    padding: "16px",
                    marginTop: "4px",
                    borderBottom: "none",
                  }}
                >
                  {/* CHECKBOX SECTION */}
                  <Box marginBottom={5} marginTop={3}>
                    {checkGroup.map((q: CheckBoxItem) => (
                      <Box key={q.qustion} marginBottom={3}>
                        <Text
                          fontWeight="bold"
                          fontSize={{
                            base: "13px",
                            sm: "15px",
                            md: "17px",
                            lg: "18px",
                          }}
                        >
                          {q.qustion}
                        </Text>

                        {q.answersSelected.length > 0 ? (
                          <Box marginTop={1}>
                            {q.answersSelected.map((ans: string) => (
                              <Badge
                                key={ans}
                                colorScheme="purple"
                                marginRight={2}
                                marginTop={1}
                                fontSize={{
                                  base: "11px",
                                  sm: "12px",
                                  md: "14px",
                                }}
                              >
                                {ans}
                              </Badge>
                            ))}
                          </Box>
                        ) : (
                          <Text
                            fontSize={{
                              base: "11px",
                              sm: "12px",
                              md: "14px",
                            }}
                            color="gray.500"
                          >
                            No answers selected
                          </Text>
                        )}
                      </Box>
                    ))}
                  </Box>

                  {/* RADIO SECTION */}
                  <Box>
                    {radioEvalutes[index] &&
                      radioEvalutes[index].map((r: RadioItem) => (
                        <Box key={r.qustion} marginBottom={3}>
                          <Text
                            fontWeight="bold"
                            fontSize={{
                              base: "13px",
                              sm: "15px",
                              md: "17px",
                              lg: "18px",
                            }}
                          >
                            {r.qustion}
                          </Text>

                          <Badge
                            colorScheme="green"
                            marginTop={1}
                            fontSize={{
                              base: "11px",
                              sm: "12px",
                              md: "14px",
                            }}
                          >
                            {r.selected || "No answer"}
                          </Badge>
                        </Box>
                      ))}
                  </Box>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        ))}
      </SimpleGrid>
    </>
  );
};

export default UsersReview;
