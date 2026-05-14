

import Categories from "./Products Data/ProductCategories";
import Genders from "./Products Data/ProductsGender";
import { Button,Box, Menu, Portal } from "@chakra-ui/react";
import {  HStack } from "@chakra-ui/react";
import useFilterAndSearch from "@/components/Products/Hooks/useFilterAndSearch";


interface Props {
  isAnimating: (animate: boolean) => void;
  
}

const ProductFilteration = ({isAnimating}:Props) => {

    const {
      selectedCategory,
      setSelectedCategry,
      selectedGender,
      setSelectedGender,
      query,
      setQuery,
      Filteration,
      
    } = useFilterAndSearch(isAnimating);






  return (
    <>
      <HStack justifyContent={"space-around"}>
        <Box
          marginRight={10}
          className="bg-linear-30 from-purple-50 to-pink-200"
        >
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="outline"
                size="sm"
                color={selectedCategory ? "#a800b7" : "#333"}
              >
                {selectedCategory ? selectedCategory : "Category ▼"}
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {Categories.map((cat) => (
                    <Menu.Item
                      key={cat.value}
                      value={cat.value}
                      onClick={() => {
                        isAnimating(true);
                        setSelectedCategry(cat.value);
                        setSelectedGender(selectedGender);
                        setTimeout(() => {
                          setQuery(() => ({
                            ...query,
                            selectedCategory: cat.value,
                          }));

                          Filteration({
                            selectedCategory: cat.value,
                            selectedGender,
                          });
                          

                          isAnimating(false);
                          
                        }, 800);
                        
                        
                        
                      }}
                    >
                      {cat.label}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>

        
        <Box className="bg-linear-30 from-purple-50 to-pink-200">
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="outline"
                size="sm"
                color={selectedGender ? "#a800b7" : "#333"}
              >
                {selectedGender ? selectedGender : "Gender ▼"}
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {Genders.map((gender) => (
                    <Menu.Item
                      key={gender.value}
                      value={gender.value}
                      onClick={() => {
                        isAnimating(true);

                        setTimeout(() => {
                          setSelectedGender(gender.value);
                          setSelectedCategry(selectedCategory);

                          setQuery(() => ({
                            ...query,
                            selectedGender: gender.value,
                          }));
                          Filteration({
                            selectedCategory,
                            selectedGender: gender.value,
                          });
                          isAnimating(false);
                        }, 800);
                      }}
                    >
                    {gender.label}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </HStack>
    </>
  );
}

export default ProductFilteration
