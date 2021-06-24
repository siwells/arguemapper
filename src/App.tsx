import { faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Stack,
  Tab,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import React, { useState } from "react";
import Cytoscape from "./components/Cytoscape";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./style.scss";

function ScrollableTabsButtonAuto({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (v: string) => void;
}) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <TabContext value={activeTab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList
          onChange={handleChange}
          aria-label="resource list"
          variant="scrollable"
          scrollButtons={false}
        >
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
            <Tab key={key} label={key} value={key} sx={{ minWidth: 50 }} />
          ))}
        </TabList>
      </Box>
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
        <TabPanel key={key} value={key}>
          <Stack spacing={2}>
            <Typography variant="h5">Resource {key}</Typography>
            <TextField fullWidth multiline minRows={5} label="Text"></TextField>
          </Stack>
        </TabPanel>
      ))}
    </TabContext>
  );
}

export default function App() {
  const isMobile = useMediaQuery(useTheme().breakpoints.down("md"));
  const [leftOpen, setLeftOpen] = useState(false);
  const toggleLeft = () => setLeftOpen(!leftOpen);
  const [rightOpen, setRightOpen] = useState(false);
  const toggleRight = () => setRightOpen(!rightOpen);
  const drawerWidth = 300;
  const [activeTab, setActiveTab] = React.useState("1");

  return (
    <Stack direction="row" sx={{ height: "100vh" }}>
      <Sidebar
        side="left"
        drawerWidth={drawerWidth}
        isMobile={isMobile}
        isOpen={leftOpen}
        setIsOpen={setLeftOpen}
      >
        <ScrollableTabsButtonAuto
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Sidebar>
      <Stack sx={{ flexGrow: 1 }}>
        <Header
          drawerWidth={drawerWidth}
          toggleLeft={toggleLeft}
          toggleRight={toggleRight}
        />
        <Box sx={{ position: "relative", height: 1 }}>
          <Cytoscape />
        </Box>
        {/* <Box sx={{ position: "relative", height: 1 }}>
          <ReactFlowProvider>
            <Graph />
          </ReactFlowProvider>
        </Box> */}
      </Stack>
      <Sidebar
        side="right"
        drawerWidth={drawerWidth}
        isMobile={isMobile}
        isOpen={rightOpen}
        setIsOpen={setRightOpen}
      >
        <Toolbar>
          <Stack
            justifyContent="space-around"
            direction="row"
            sx={{ width: 1 }}
          >
            <Button
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={faSave} />}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<FontAwesomeIcon icon={faBan} />}
            >
              Cancel
            </Button>
          </Stack>
        </Toolbar>
      </Sidebar>
    </Stack>
  );
}
