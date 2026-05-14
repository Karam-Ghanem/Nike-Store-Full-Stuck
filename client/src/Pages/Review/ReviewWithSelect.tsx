import { Box, Button, Checkbox, SimpleGrid, Text } from "@chakra-ui/react";
import { RadioGroup } from "@chakra-ui/react";
import { Accordion, Span } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import useCheckRadioReview from "./Hook/useCheckRadioReview";


const ReviewWithSelect = () => {

  const {addCheckBoxEvalute,addRadioEvalute,checkBoxState,radioState,setCheckBoxState,setRadioState} = useCheckRadioReview()



  return (
    <>
      <Toaster />
      <Accordion.Root
        collapsible
        marginBottom={4}
        className="bg-linear-65 from-purple-200 to-pink-200"
      >
        <Accordion.Item key={""} value={""}>
          <Accordion.ItemTrigger>
            <Span
              padding={2}
              fontSize={{base:11,sm:15,md:22,lg:30}}
              color={"blue"}
              flex="1"
              cursor={"pointer"}
            >
              Your Feedback Helps Us Improve the Website
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <form>
                <Box
                  className="bg-linear-65 from-purple-200 to-pink-200"
                  marginBottom={4}
                  padding={4}
                >
                  <SimpleGrid columns={{base:1,sm:1,md:2,lg:2}} gap={10}>
                    {/* CHECKBOX SECTION */}
                    <Box>
                      {checkBoxState.map((cba) => (
                        <Box marginBottom={4} key={cba.qustion}>
                          <Text marginBottom={2} fontSize={{base:12,sm:15,md:16,lg:18}}>{cba.qustion}</Text>

                          {cba.answers.map((answer) => (
                            <Box key={answer} >
                              <Checkbox.Root
                                colorPalette={"green"}
                                variant={"solid"}
                                checked={cba.answersSelected.includes(answer)}
                                onCheckedChange={(checked) => {
                                  setCheckBoxState((prev) =>
                                    prev.map((item) => {
                                      if (item.qustion !== cba.qustion)
                                        return item;

                                      const current = item.answersSelected;

                                      return {
                                        ...item,
                                        answersSelected: checked
                                          ? [...current, answer]
                                          : current.filter((a) => a !== answer),
                                      };
                                    })
                                  );
                                }}
                              >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control bg={"#7f7fe9"} />
                                <Checkbox.Label fontSize={{base:10,sm:12,md:13,lg:15}}>{answer}</Checkbox.Label>
                              </Checkbox.Root>
                              <br />
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>

                    {/* RADIO SECTION */}
                    <Box>
                      {radioState.map((ra) => (
                        <Box marginBottom={4} key={ra.qustion}>
                          <Text marginBottom={2} fontSize={{base:12,sm:15,md:16,lg:18}}>{ra.qustion}</Text>

                          <RadioGroup.Root
                            value={ra.selected}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const value = e.target.value;

                              setRadioState((prev) =>
                                prev.map((item) =>
                                  item.qustion === ra.qustion
                                    ? { ...item, selected: value }
                                    : item
                                )
                              );
                            }}
                            variant={"subtle"}
                          >
                            {ra.answers.map((answer) => (
                              <Box key={answer} >
                                <RadioGroup.Item value={answer}>
                                  <RadioGroup.ItemHiddenInput />
                                  <RadioGroup.ItemIndicator bg={"#7f7fe9"} />
                                  <RadioGroup.ItemText fontSize={{base:10,sm:12,md:13,lg:15}}>
                                    {answer}
                                  </RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <br />
                              </Box>
                            ))}
                          </RadioGroup.Root>
                        </Box>
                      ))}
                    </Box>
                  </SimpleGrid>

                  {/* SUBMIT BUTTON */}
                  <Button
                    marginTop={4}
                    bg={"#7f7fe9"}
                    transition={"0.3s"}
                    _hover={{ backgroundColor: "blue" }}
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();

                      addCheckBoxEvalute(checkBoxState);
                      addRadioEvalute(radioState);

                      // RESET STATES AFTER SUBMIT
                      setCheckBoxState((prev) =>
                        prev.map((item) => ({
                          ...item,
                          answersSelected: [],
                        }))
                      );

                      setRadioState((prev) =>
                        prev.map((item) => ({
                          ...item,
                          selected: "",
                        }))
                      );

                      toaster.create({
                        title: "Your review has been submitted successfully",
                        type: "success",
                        duration: 5000,
                      });
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export default ReviewWithSelect;
