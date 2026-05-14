import { Button } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Button onClick={toggleColorMode} bg={colorMode==="dark" ? "white" : "#7008e7"} >
        {colorMode === "dark" ? <MdOutlineLightMode/> : <MdDarkMode />}
      </Button>
    </>
  );
}

export default ColorModeToggle;
