import { SelecetedDataContext } from "context/SelectedDataContext";
import { useState, useEffect, useContext } from "react";

import Bar from "./Bar/Bar";
import Table from "./Table/Table";

const List = () => {
  const { selected, fetchData } = useContext(SelecetedDataContext);
  const [selectedData, setSelectedData] = selected;
  const [lists, setLists] = useState([]);

  return (
    <div className="ToDoList">
      <Bar
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        fetchData={fetchData}
      />

      {selectedData.selectedList && (
        <>
          <Table
            selectedData={selectedData.selectedList}
            fetchData={fetchData}
          />
        </>
      )}
    </div>
  );
};

export default List;
