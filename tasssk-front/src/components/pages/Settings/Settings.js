import React from "react";

import { TabView, TabPanel } from "primereact/tabview";

import Profile from "./Tabs/Profile/Profile";
import App from "./Tabs/App/App";

function Settings() {
  return (
    <div className="Settings">
      <TabView className="TabView" >
      <TabPanel header="Profile" leftIcon={<i className="pi pi-user-edit" style={{ marginRight: "0.5rem" }} />}>
          <Profile />
        </TabPanel>
        <TabPanel header="App" leftIcon={<i className="pi pi-cog" style={{ marginRight: "0.5rem" }} />}>
          <App />
        </TabPanel>
      </TabView>
    </div>
  );
}

export default Settings;
