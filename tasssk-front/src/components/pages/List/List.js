import { useState, useEffect, useContext } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import Bar from "./Bar/Bar";
import Table from "./Table/Table";
import { GetLists } from "services/ListService";
import Spinner from "UI/Spinner";
import FirstListButton from "UI/FirstListButton";
import New from "./Bar/Actions/New";
import { Skeleton } from "primereact/skeleton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const List = () => {
  const [selectedData, setSelectedData] = useState(null);
  const fetchData = (id = null) => {
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

  console.log(selectedData);

  return (
    <div className="ToDoList">
      {selectedData === null ? (
        <MySkeleton />
      ) : selectedData.allLists.length === 0 ? (
        <FirstListButton addButton={<New fetchData={fetchData} />} />
      ) : (
        <>
          <Bar
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            fetchData={fetchData}
          />
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
const items = Array.from({ length: 5 }, (v, i) => i);

const MySkeleton = () => {
  const bodyTemplate = () => {
    return <Skeleton className="mt-3 mb-3"></Skeleton>;
  };
  return (
    <>
      <div
        style={{
          justifyContent: "space-between",
          display: "flex",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex" }}>
          <Skeleton width="86px" height="41px" borderRadius="2rem" />
          <Skeleton
            width="121px"
            height="41px"
            borderRadius="2rem"
            className="ml-3"
          />
        </div>
        <div style={{ display: "flex" }}>
          <Skeleton width="5rem" height="41px" borderRadius="2rem" />
          <Skeleton
            width="87px"
            height="41px"
            borderRadius="2rem"
            className="ml-3"
          />{" "}
          <Skeleton
            width="83px"
            height="41px"
            borderRadius="2rem"
            className="ml-3"
          />{" "}
          <Skeleton
            width="100px"
            height="41px"
            borderRadius="2rem"
            className="ml-3"
          />
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
          }}
        >
          <Skeleton width="10rem" height="4rem" />
          <Skeleton width="15rem" height="4rem" />
        </div>
        <DataTable value={items} className="p-datatable-striped">
          <Column field="name" header="Name" body={bodyTemplate}></Column>
          <Column
            field="created_at"
            header="Created at"
            style={{ width: "10%" }}
            body={bodyTemplate}
          ></Column>
          <Column
            field="finished"
            header="Finished"
            style={{ width: "5%" }}
            body={bodyTemplate}
          ></Column>
          <Column
            field="actions"
            header="Actions"
            style={{ width: "126px" }}
            body={bodyTemplate}
          ></Column>
        </DataTable>
      </div>
    </>
  );
};
