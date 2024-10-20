import { extendTheme } from "@chakra-ui/react";

const darkTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.800",
        color: "white",
      },
    },
  },
});

export default darkTheme;