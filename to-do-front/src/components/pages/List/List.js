import React, { useState, useEffect, useReducer } from "react";
import { GetLists } from "../../../services/ToDoService";
import Table from "./Table/Table";
import Bar from "./Bar/Bar";
import { useToastContext } from "../../../context/ToastContext";
import Spinner from "../../../UI/Spinner";
import useLocalStorage from "../../../hooks/useLocalStorage";

const List = (props) => {
  const toastRef = useToastContext();
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState();

  const [lists, setLists] = useState([]);

  const [listStorage, setListStorage] = useLocalStorage("selectedList");

  function fetchData(par) {
    setLoading(true);

    return new Promise((resolve, reject) => {
      GetLists()
        .then((res) => {
          setLists(res.data);

          if (par === "new") {
            setSelectedList(res.data[res.data.length - 1]);
            setListStorage(res.data[res.data.length - 1].name);
          } else if (par === "del") {
            if (res.data.length > 0) {
              setSelectedList(res.data[0]);
              setListStorage(res.data[0].name);
            } else {
              setSelectedList();
              setListStorage();
            }
          }

          resolve(res.data);
        })
        .catch((err) => {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: err.message,
            life: 5000,
          });
          reject(err);
        })
        .finally(() => setLoading(false));
    });
  }

  const [state, dispatch] = useReducer(listsActions, selectedList);
  function listsActions(state, action) {
    switch (action.type) {
      case "DeleteFile":
        setSelectedList((prev) => ({
          ...prev,
          files: prev.files.filter((x) => x.fileId != action.fileId),
        }));
        break;

      case "AddFile":
        setSelectedList((prev) => ({
          ...prev,
          files: prev.files.concat(action.filesArr),
        }));
        break;
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className="ToDoList">
        <>
          <Bar
            fetchData={fetchData}
            lists={lists}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            dispatch={dispatch}
          />

          {selectedList && (
            <Table
              list={lists.find((x) => x.name === selectedList.name)}
              fetchData={fetchData}
            />
          )}
        </>
      </div>
    );
  }
};

export default List;
