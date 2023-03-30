import { Dropdown } from "primereact/dropdown";

import New from "./Actions/New";
import Delete from "./Actions/Delete";
import Edit from "./Actions/Edit";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import EmptyArr from "../../../../UI/EmptyArr";
import Spinner from "../../../../UI/Spinner";
import { GetItems } from "services/ItemService";
import { File } from "./File/File";

function Bar({ selectedData, setSelectedData, fetchData, lists }) {
  const [, setListStorage] = useLocalStorage("selectedList");

  return (
    <div className="Bar" style={{ marginBottom: "1rem" }}>
      {lists ? (
        lists.length === 0 ? (
          <EmptyArr addButton={<New fetchData={fetchData} />} />
        ) : (
          <div
            style={{
              justifyContent: "space-between",

              display: "flex",
            }}
          >
            <File selectedData={selectedData} />
            <div style={{ display: "flex" }}>
              <Dropdown
                value={selectedData.list}
                style={{ marginRight: "1rem", borderRadius: "2rem" }}
                panelStyle={{
                  padding: ".5rem 0",
                  borderRadius: "2rem",
                  overflow: "hidden",
                }}
                optionLabel="name"
                placeholder={"Select list"}
                options={lists}
                onChange={(e) => {
                  GetItems(e.value.id).then((resItem) => {
                    setSelectedData({
                      list: lists.find((x) => x.id === e.value.id),
                      items: resItem.data,
                    });
                    setListStorage(e.value.name);
                  });
                }}
              />
              <New fetchData={fetchData} />
              <Edit fetchData={fetchData} selectedData={selectedData} />
              <Delete fetchData={fetchData} selectedData={selectedData} />
            </div>
          </div>
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default Bar;
