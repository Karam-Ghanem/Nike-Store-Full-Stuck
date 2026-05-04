import FooterTitle from "./FooterTitle";
import { FaHouse } from "react-icons/fa6";
import { FaPhone, FaEnvelope } from "react-icons/fa6";
import { List, Box, Link } from "@chakra-ui/react";
import { Emails } from "./DataFooter";

const FooterContact = () => {


  return (
    <Box marginBottom={{ base: 6, sm: 6, lg: 0 }}>
      <FooterTitle head="Contact" />
      <List.Root gap="2" variant="plain" align="center">
        <List.Item>
          <List.Indicator asChild color="#ba1e9a">
            <FaHouse />
          </List.Indicator>
          Syria / Latakia
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="#ba1e9a">
            <FaPhone />
          </List.Indicator>
          <Link target="_blank" href="https://wa.me/963939309217">
            +963 938309217
          </Link>
        </List.Item>
        {Emails.map((email) => (
          <List.Item>
            <List.Indicator asChild color="#ba1e9a">
              <FaEnvelope />
            </List.Indicator>
            <Link target="_blank" href={email.href}>
              {email.email}
            </Link>
          </List.Item>
        ))}
      </List.Root>
    </Box>
  );
};

export default FooterContact;
