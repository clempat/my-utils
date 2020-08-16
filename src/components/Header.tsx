import React from "react";
import { Box, Heading, Flex, Link } from "@chakra-ui/core";
import { Link as RouterLink } from "react-router-dom";

const MenuItems = ({
  children,
  to,
}: React.PropsWithChildren<{ to: string }>) => (
  <Link as={RouterLink} mt={[4, null, 0]} mr={6} display="block" to={to}>
    {children}
  </Link>
);

const Header = () => {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
      mb={2}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          <span role="img" aria-labelledby="Toolbox icon">
            🧰
          </span>{" "}
          My Tools Box
        </Heading>
      </Flex>

      <Box display={["block", null, "none"]} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={show ? ["block", null, "flex"] : ["none", null, "flex"]}
        width={["full", null, "auto"]}
        alignItems="center"
        flexGrow={1}
        justifyContent="flex-end"
      >
        <MenuItems to={"/ynab"}>YNAB Converter</MenuItems>
      </Box>
    </Flex>
  );
};

export default Header;
