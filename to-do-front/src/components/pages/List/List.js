import React, { useState, useEffect, useReducer } from "react";
import { GetLists, GetListsNames } from "../../../services/ToDoService";
import Table from "./Table/Table";
import Bar from "./Bar/Bar";
import { useToastContext } from "../../../context/ToastContext";
import Spinner from "../../../UI/Spinner";
import useLocalStorage from "../../../hooks/useLocalStorage";

const List = (props) => {
  const toastRef = useToastContext();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState();
  const [state, dispatch] = useReducer(listsActions, list);
  function listsActions(state, action) {
    console.log(state, action);
    switch (action.type) {
      case "DeleteFile":
        setList((prev) => ({
          ...prev,
          files: prev.files.filter((x) => x.fileId != action.fileId),
        }));
        break;

      case "AddFile":
        console.log(action.filesArr.files);

        setList((prev) => ({
          ...prev,
          files: prev.files.concat(action.filesArr),
        }));
        break;
    }
  }

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className="ToDoList">
        <>
          <Bar setList={setList} list={list} dispatch={dispatch} />

          {/*selectedList && (
            <Table
              dispatch={dispatch}
              list={lists.find((x) => x.name === selectedList.name)}
              // fetchData={fetchData}
            />
          ) */}
        </>
      </div>
    );
  }
};

export default List;
