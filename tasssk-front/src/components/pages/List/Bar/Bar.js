import { Dropdown } from "primereact/dropdown";

import New from "./Actions/New";
import Delete from "./Actions/Delete";
import Edit from "./Actions/Edit";

import { File } from "./File/File";

import useLocalStorage from "../../../../hooks/useLocalStorage";
import EmptyArr from "../../../../UI/EmptyArr";
import { GetListById } from "../../../../services/ToDoService";
import Spinner from "../../../../UI/Spinner";

function Bar({
  list,
  setList,
  loadData,
  listNames,
  selectedListDropdown,
  setSelectedListDropdown,
}) {
  const [listStorage, setListStorage] = useLocalStorage("selectedList");
  var dateNow = new Date();
  dateNow.setDate(dateNow.getDate());
  dateNow.setMonth(dateNow.getMonth());
  dateNow.setFullYear(dateNow.getFullYear());

  return (
    <div className="ListBar" style={{ marginBottom: "1rem" }}>
      {listNames ? (
        listNames.length === 0 ? (
          <EmptyArr addButton={<New dateNow={dateNow} loadData={loadData} />} />
        ) : (
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <div> {list && <File list={list} loadData={loadData} />}</div>
            <div>
              <Dropdown
                value={selectedListDropdown}
                style={{ marginRight: "1rem", borderRadius: "2em" }}
                panelStyle={{
                  borderRadius: "2em",
                  overflow: "hidden",
                }}
                optionLabel="name"
                placeholder={"Select list"}
                options={listNames}
                onChange={(e) => {
                  GetListById(e.value.id).then((res) => {
                    setList((prev) => res.data);
                  });
                  setSelectedListDropdown(
                    listNames.find((x) => x.name === e.value.name)
                  );
                  setListStorage(e.value.name);
                }}
              />
              <New dateNow={dateNow} loadData={loadData} />
              {list && (
                <>
                  <Edit list={list} loadData={loadData} />
                  <Delete list={list} loadData={loadData} />
                </>
              )}
            </div>
          </div>
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
  exports.loadData = loadData;
}

export default Bar;
