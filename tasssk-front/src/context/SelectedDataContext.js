import useListSignalR from "hooks/useListSignalR";
import useLocalStorage from "hooks/useLocalStorage";
import React, { createContext, useContext, useState, useEffect } from "react";
import { GetLists } from "services/ListService";

export const SelecetedDataContext = createContext(null);

export function useSelectedDataContext() {
  return useContext(SelecetedDataContext);
}

export function SelectedDataContextProvider({ children }) {
  const [listStorage, setListStorage] = useLocalStorage("selectedList");

  const [data, setData] = useState({
    allLists: [],
    selectedList: null,
  });

  const [SignalRlistupdate, SignalRsendlistupdate] = useListSignalR(
    data.selectedList?.id
  );

  const fetchData = (selectedItem = null) => {
    GetLists(selectedItem).then((res) => {
      let selected = res.lists.find((x) => x.isSelected === true);
      setData({
        ...data,
        allLists: res.lists,
        selectedList: selected ? selected : res.lists[0],
      });
    });
  };
  console.log(data);
  useEffect(() => {
    fetchData();
  }, [SignalRlistupdate]);

  return (
    <SelecetedDataContext.Provider
      value={{
        selected: [data, setData],
        fetchData: fetchData,
      }}
    >
      {children}
    </SelecetedDataContext.Provider>
  );
}
