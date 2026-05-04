import { Box,Flex } from "@chakra-ui/react";


import ProductFilteration from "./ProductFilteration";
import ProductSearching from "./ProductSearching";


export interface Query {
  selectedCategory: string;
  selectedGender: string;
}

interface Props{
  isAnimating:(animate:boolean)=>void,
}


const ProductControls = ({isAnimating}:Props) => {
  return (
    <>
        <Flex justifyContent={"center"}>
          <Box
            display={"flex"}
            width={{md:'80%'}}
            padding={2}
            className="bg-linear-65 from-purple-200 to-pink-200 shadow-xl shadow-blue-500/50"
            justifyContent={"space-between"}
            flexDirection={{ base: "column", md: "column", lg: "row" }}
          >
            {/* Search */}
            <ProductSearching isAnimating={(animate) => isAnimating(animate)} />
            {/* Filter */}
            <ProductFilteration
              isAnimating={(animate) => isAnimating(animate)}
            />
          </Box>
        </Flex>
    </>
  );
};

export default ProductControls;
