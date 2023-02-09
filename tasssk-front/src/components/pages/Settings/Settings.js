import React from "react";

import { TabView, TabPanel } from "primereact/tabview";
import "./Settings.scss";

import Profile from "./Tabs/Profile/Profile";
import App from "./Tabs/App/App";

function Settings() {
  return (
    <div className="Settings">
      <TabView className="TabView">
        <TabPanel header="Profile" leftIcon="pi pi-user-edit">
          <Profile />
        </TabPanel>
        <TabPanel header="App" leftIcon="pi pi-cog">
          <App />
        </TabPanel>
      </TabView>
    </div>
  );
}

export default Settings;
