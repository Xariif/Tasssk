import useLocalStorage from "hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { GetItems } from "services/ItemService";
import { GetLists } from "services/ListService";

import Bar from "./Bar/Bar";
import Table from "./Table/Table";

const List = () => {
  const [listStorage] = useLocalStorage("selectedList");
  const [selectedData, setSelectedData] = useState({
    list: {},
    items: [],
  });

  const [lists, setLists] = useState();

  const fetchData = (type) => {
    console.log("fecz", listStorage, type);
    GetLists().then((res) => {
      console.log(res.data);

      setLists((lists) => res.data);
      let list = res.data.find((x) => x.name === listStorage);
      if (list) {
        GetItems(list.id).then((resItem) => {
          setSelectedData({
            list: list,
            items: resItem.data,
          });
        });
      } else if (type === "new") {
        GetItems(res.data.at(-1).id).then((resItem) => {
          setSelectedData({
            list: res.data.at(-1),
            items: resItem.data,
          });
        });
      } else if (type === "update") {
        GetItems(selectedData.list.id).then((resItem) => {
          setSelectedData({
            list: res.data.find((x) => x.id === selectedData.list.id),
            items: resItem.data,
          });
        });
      } else if (type === "delete") {
        if (res.data.length > 0) {
          GetItems(res.data[0].id).then((resItem) => {
            setSelectedData({
              list: res.data[0],
              items: resItem.data,
            });
          });
        } else {
          setSelectedData({
            list: {},
            items: [],
          });
        }
      } else if (res.data.length > 0) {
        GetItems(res.data[0].id).then((resItem) => {
          setSelectedData({
            list: res.data[0],
            items: resItem.data,
          });
        });
      } else {
      }
    });
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
        lists={lists}
      />
      {selectedData.list.name && (
        <Table selectedData={selectedData} fetchData={fetchData} />
      )}
    </div>
  );
};

export default List;
