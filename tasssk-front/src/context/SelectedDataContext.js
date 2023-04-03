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

  const [SignalRlistupdate, SignalRsendlistupdate] = useListSignalR();

  const fetchData = (selectedItem = null) => {
    console.log("fecz " + selectedItem);
    GetLists(selectedItem).then((res) => {
      console.log(res);
      let selected = res.data.lists.find((x) => x.isSelected === true);
      setData({
        ...data,
        allLists: res.data.lists,
        selectedList: selected ? selected : res.data.lists[0],
      });
    });
  };

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
