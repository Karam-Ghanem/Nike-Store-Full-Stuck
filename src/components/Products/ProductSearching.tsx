import useFilterAndSearch from "@/components/Products/Hooks/useFilterAndSearch";
import { Button, HStack, Input, Span } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

interface Props {
  isAnimating: (animate: boolean) => void;
}

const ProductSearching = ({ isAnimating }: Props) => {
  const {
    startSearching,
    ResetSearching,
    setSearchText,
    searchText,
    setQuery,
  } = useFilterAndSearch(isAnimating);

  return (
    <>
      <HStack
        width={{ base: "100%", md: "100%", lg: "40%" }}
        position={"relative"}
        marginBottom={{ base: "30px", md: "30px", lg: "0" }}
        className="bg-linear-30 from-purple-50 to-pink-200"
      >
        <Button
          bg={"#7008e7"}
          color={"white"}
          _hover={{ backgroundColor: "red", color: "white" }}
          disabled={searchText ? false : true}
          onClick={() => {
            ResetSearching();
            setSearchText("");
          }}
        >
          X
        </Button>
        <Input
          onBlur={(e) => (e.target.value = "")}
          type="search"
          _focus={{ outline: "1px solid #7008e7" }}
          placeholder="Search"
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              startSearching();
            }
          }}
        ></Input>
        <Span position={"absolute"} right={0}>
          <FiSearch
            cursor={"pointer"}
            size={30}
            color="#7008e7"
            onClick={() => {
              startSearching();
              setQuery({ selectedCategory: "", selectedGender: "" });
            }}
          />
        </Span>
      </HStack>
    </>
  );
};

export default ProductSearching;
