
import FooterTitle from "./FooterTitle";
import { List, Box } from "@chakra-ui/react";
import { GetHelpArray} from "./DataFooter";


const GetHelp = () => {
  return (
    <Box marginBottom={{ base: 6, sm: 6, lg: 0 }}>
      <FooterTitle head="Get Help" />
      <List.Root gap="2" variant="plain" align="center">
        {GetHelpArray.map((helpItem) => (
          <List.Item key={helpItem}>{helpItem}</List.Item>
        ))}
      </List.Root>
    </Box>
  );
}

export default GetHelp
