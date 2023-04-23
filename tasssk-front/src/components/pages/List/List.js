import { useState, useEffect, useContext } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import Bar from "./Bar/Bar";
import Table from "./Table/Table";
import { GetLists } from "services/ListService";

const List = () => {
  const [selectedData, setSelectedData] = useState(null);
  const fetchData = (id = null) => {
    GetLists(id)
      .then((res) => {
        let selected = res.data.lists.find((x) => x.isSelected === true) ;
        setSelectedData({
          ...selectedData,
          allLists: res.data.lists,
          selectedList: selected ? selected : res.data.lists[0],
        });
        return selected ? selected : res.data.lists[0];
      })    
  };


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="ToDoList">
      <Bar
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        fetchData={fetchData}
      />
      {selectedData && selectedData.selectedList && (
        <Table selectedData={selectedData.selectedList} fetchData={fetchData} />
      )}
    </div>
  );
};

export default List;
