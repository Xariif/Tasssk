import React, { useState, useEffect, useReducer } from "react";
import {
  GetListById,
  GetLists,
  GetListsNames,
} from "../../../services/ToDoService";
import Table from "./Table/Table";
import Bar from "./Bar/Bar";
import { useCallback } from "react";
import { useToastContext } from "../../../context/ToastContext";
import Spinner from "../../../UI/Spinner";
import useLocalStorage from "../../../hooks/useLocalStorage";

const List = (props) => {
  const toastRef = useToastContext();
  const [list, setList] = useState();
  const [listStorage, setListStorage] = useLocalStorage("selectedList");
  const [listNames, setListNames] = useState();
  const [selectedListDropdown, setSelectedListDropdown] = useState();
  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    GetListsNames().then((res) => {
      setListNames((prev) => res.data);
      if (
        res.data.find((x) => x.name === localStorage.getItem("selectedList"))
      ) {
        GetListById(
          res.data.find((x) => x.name === localStorage.getItem("selectedList"))
            .id
        ).then((res) => setList((prev) => res.data));
        setSelectedListDropdown(
          res.data.find((x) => x.name === localStorage.getItem("selectedList"))
        );
      } else if (res.data.length > 0) {
        GetListById(res.data[0].id).then((res) => setList((prev) => res.data));
        setSelectedListDropdown(res.data[0]);
      } else {
        setList();
        setSelectedListDropdown();
      }
    });
  }
  return (
    <div className="ToDoList">
      <Bar
        list={list}
        setList={setList}
        loadData={loadData}
        listNames={listNames}
        selectedListDropdown={selectedListDropdown}
        setSelectedListDropdown={setSelectedListDropdown}
      />
      {list && <Table list={list} loadData={loadData} />}
    </div>
  );
};

export default List;
