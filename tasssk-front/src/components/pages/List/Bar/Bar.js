import { Dropdown } from "primereact/dropdown";
import * as signalR from "@microsoft/signalr";
import { useState, useEffect, useContext } from "react";

import FirstListButton from "../../../../UI/FirstListButton";
import Spinner from "../../../../UI/Spinner";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import Delete from "./Actions/Delete";
import Edit from "./Actions/Edit";
import New from "./Actions/New";
import { File } from "./File/File";
import Privilages from "./Actions/Privilages";

function Bar({ selectedData, setSelectedData, fetchData }) {

  return (
    <div className="Bar" style={{ marginBottom: "1rem" }}>
      {selectedData === null ? (
        <Spinner />
      ) : selectedData.allLists.length === 0 ? (
        <FirstListButton addButton={<New fetchData={fetchData} />} />
      ) : (
        <Actions />
      )}
    </div>
  );

  function Actions() {
    return (
      <div
        style={{
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <div>
          <File selectedData={selectedData.selectedList} />
          {selectedData.selectedList.isOwner && (
            <Privilages selectedList={selectedData.selectedList} />
          )}
        </div>
        <div>
          <Dropdown
            value={selectedData.selectedList}
            style={{ marginRight: "1rem", borderRadius: "2rem" }}
            panelStyle={{
              padding: ".5rem 0",
              borderRadius: "2rem",
              overflow: "hidden",
            }}
            optionLabel="name"
            placeholder={"Select list"}
            options={selectedData.allLists}
            onChange={(e) => {
              setSelectedData({
                ...selectedData,
                selectedList: e.value,
              });
            }}
          />
          <New fetchData={fetchData} />
          <Edit
            fetchData={fetchData}
            selectedData={selectedData.selectedList}
          />
          <Delete
            fetchData={fetchData}
            selectedData={selectedData.selectedList}
          />
        </div>
      </div>
    );
  }
}

export default Bar;
