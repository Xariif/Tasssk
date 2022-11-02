import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

import New from "./Actions/New";
import Delete from "./Actions/Delete";
import Edit from "./Actions/Edit";

import { File } from "./File/File";

import useLocalStorage from "../../../../hooks/useLocalStorage";
import EmptyArr from "../../../../UI/EmptyArr";
import { GetListById, GetListsNames } from "../../../../services/ToDoService";

function Bar({ setList, list, dispatch }) {
  const [listsNames, setListsNames] = useState([]);
  const [listStorage, setListStorage] = useLocalStorage("selectedList");
  const [selectedListName, setSelectedListName] = useState(listStorage);

  var dateNow = new Date();
  dateNow.setDate(dateNow.getDate());
  dateNow.setMonth(dateNow.getMonth());
  dateNow.setFullYear(dateNow.getFullYear());
  useEffect(() => {
    GetListsNames().then((res) => {
      setListsNames(res.data);
    });

    if (listsNames.find((x) => x.name === listStorage)) {
      setList(listsNames.find((x) => x.name === listStorage));
    }
  }, []);
  return (
    <div className="ListBar" style={{ marginBottom: "1rem" }}>
      {listsNames.length === 0 ? (
        <EmptyArr addButton={<New dateNow={dateNow} />} />
      ) : (
        <div style={{ justifyContent: "space-between", display: "flex" }}>
          <div> {list && <File list={list} dispatch={dispatch} />} </div>
          <div>
            <Dropdown
              value={selectedListName}
              style={{ marginRight: "1rem", borderRadius: "2em" }}
              optionLabel="name"
              placeholder={"Select list"}
              options={listsNames}
              onChange={(e) => {
                setSelectedListName(e.value.name);
                setListStorage(e.value.name);
                GetListById(e.value.id).then((res) => setList(res.data));
              }}
            />
            <New dateNow={dateNow} />
            {list && (
              <>
                <Edit list={list} dispatch={dispatch} />
                <Delete list={list} dispatch={dispatch} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Bar;
