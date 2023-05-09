import { GetLists } from "services/ListService";
import React, { createContext, useContext, useState, useEffect } from "react";

export const ListContext = createContext(null);

export function useListContext() {
  return useContext(ListContext);
}

export function ListContextProvider({ children }) {
  const [selectedData, setSelectedData] = useState(null);
  const fetchData = (id = null) => {
    console.log("fetching data");
    GetLists(id).then((res) => {
      let selected = res.data.lists.find((x) => x.isSelected === true);
      setSelectedData({
        ...selectedData,
        allLists: res.data.lists,
        selectedList: selected ? selected : res.data.lists[0],
      });
      return selected ? selected : res.data.lists[0];
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ListContext.Provider
        value={{
          selectedData: [selectedData, setSelectedData],
          fetchData: [fetchData],
        }}
      >
        {children}
      </ListContext.Provider>
    </>
  );
}
