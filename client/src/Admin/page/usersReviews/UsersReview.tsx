import MainHead from "@/components/PublicCompontents/MainHead";
import useReviewStore from "@/Pages/Review/reviewStore";
import {
  Box,
  Text,
  SimpleGrid,
  Badge,
  Accordion,
  Span,
} from "@chakra-ui/react";

import type { CheckBoxItem, RadioItem } from "@/Pages/Review/Data/Qustions";

const UsersReview = () => {
  const { checkEvalutes, radioEvalutes } = useReviewStore();

  return (
    <>
      <MainHead
        head="USERS REVIEWS"
      />

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
