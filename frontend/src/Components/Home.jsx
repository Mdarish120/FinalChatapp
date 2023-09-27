import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";

//import Login from "../components/Authentication/Login";
//import Signup from "../components/Authentication/Signup";

function Homepage() {
  

  return (
    <Container maxW="xl" centerContent>
      <Box
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"

        style={{display:"flex",justifyContent:"center"}}
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Chat- Sync
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
             <Login/>
            </TabPanel>
            <TabPanel>
            <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;