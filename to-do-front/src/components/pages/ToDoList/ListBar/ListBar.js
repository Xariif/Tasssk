import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

import New from "./Actions/New";
import Delete from "./Actions/Delete";
import Edit from "./Actions/Edit";

import { GetLists } from "../../../../services/ToDoService";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import Spinner from "../../../../UI/Spinner";
import { useToastContext } from "../../../../context/ToastContext";
import EmptyArr from "../../../../UI/EmptyArr";

function ListBar({ fetchData, lists, selectedList, setSelectedList }) {
  const [listStorage, setListStorage] = useLocalStorage("selectedList");
  var dateNow = new Date();
  dateNow.setDate(dateNow.getDate());
  dateNow.setMonth(dateNow.getMonth());
  dateNow.setFullYear(dateNow.getFullYear());

  useEffect(() => {
    if (lists.find((x) => x.name === listStorage)) {
      setSelectedList(lists.find((x) => x.name === listStorage));
    }
  }, []);
  return (
    <div className="ListBar" style={{ marginBottom: "1rem" }}>
      {lists.length === 0 ? (
        <EmptyArr addButton={<New fetchData={fetchData} dateNow={dateNow} />} />
      ) : (
        <div style={{ justifyContent: "right", display: "flex" }}>
          <Dropdown
            value={selectedList}
            style={{ marginRight: "1rem", borderRadius: "2em" }}
            optionLabel="name"
            placeholder={"Select list"}
            options={lists}
            onChange={(e) => {
              setSelectedList(e.value);
              setListStorage(e.value.name);
            }}
          />
          <New fetchData={fetchData} dateNow={dateNow} />
          {selectedList ? (
            <>
              <Edit selectedList={selectedList} fetchData={fetchData} />
              <Delete selectedList={selectedList} fetchData={fetchData} />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ListBar;
