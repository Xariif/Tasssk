import Countdown from "react-countdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import Moment from "react-moment";

import { UpdateItem } from "services/ItemService";
import { Edit } from "./Actions/Edit";
import { Delete } from "./Actions/Delete";
import { Add } from "./Actions/Add";
import useLocalStorage from "hooks/useLocalStorage";
import Privilages from "../Bar/Actions/Privilages";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

function Table({ selectedData, fetchData }) {
  const [emailStorage] = useLocalStorage("email");

  var finishDate = new Date(selectedData.finishDate);

  const finishedSort = (event) => {
    event.data.sort((data1, data2) => {
      const val1 = data1[event.field];
      const val2 = data2[event.field];

      if (val1 === val2) {
        return 0;
      } else if (val1 === true && val2 === false) {
        return -1 * event.order || 1; // odwrócenie sortowania, jeśli order = -1
      } else {
        return 1 * event.order || 1; // zachowanie porządku sortowania, jeśli order = 1 lub niezdefiniowany
      }
    });
    return event.data;
  };
  const finishedTemplate = (row) => {
    function ChangeItemState(item) {
      item.finished = !item.finished;
      const body = {
        listId: selectedData.id,
        item: item,
      };

      UpdateItem(row)
        .then((res) => {
          fetchData();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    return (
      <Checkbox
        style={{ marginRight: "5px" }}
        key={row.id}
        checked={row.finished}
        onChange={() => {
          ChangeItemState(row);
        }}
      />
    );
  };
  const actionsTemplate = (row) => {
    return (
      <>
        <Edit selectedItem={row} fetchData={fetchData} />

        <Delete selectedItem={row} fetchData={fetchData} />
      </>
    );
  };

  const createadAtTemplate = (row) => {
    return <>{moment(row.createdAt).format("MMMM Do YYYY, HH:mm:ss ")}</>;
  };

  return (
    <DataTable
      emptyMessage={"Your list is empty! Add somethning using button bellow"}
      value={selectedData.items}
      header={<Topbar />}
      footer={<Footer />}
      responsiveLayout="scroll"
      sortField="createdAt"
      sortOrder={-1}
      rowHover
      paginator
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  "
      rows={7}
      editMode="cell"
      style={{ width: "100%" }}
    >
      <Column
        filter
        sortable
        field="name"
        header="Name"
        style={{
          wordBreak: "break-all",
          wordWrap: "break-word",
        }}
      />
      <Column
        header="Created at"
        field="createdAt"
        sortable
        body={createadAtTemplate}
        style={{ width: "10%" }}
      />
      <Column
        header="Finished"
        sortable
        sortField="finished"
        sortFunction={finishedSort}
        body={finishedTemplate}
        style={{ textAlign: "center", width: " 5%" }}
      />
      <Column
        header="Actions"
        body={actionsTemplate}
        style={{
          width: "126px",
        }}
      />
    </DataTable>
  );

  function Topbar() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "var(--green-300)" }}>
          <i className="pi pi-book" style={{ fontSize: " 2rem" }} />{" "}
          {selectedData.name.toUpperCase()}
        </h1>
        <h3 style={{ textAlign: "center", display: "flex" }}>
          <Countdown
            date={selectedData.finishDate}
            renderer={(e) => {
              if (e.days >= 1) {
                return (
                  <div style={{ color: "var(--green-300)" }}>
                    <i className="pi pi-clock" />
                    &nbsp;
                    {e.days} Days {e.hours} hours {e.minutes} minutes
                  </div>
                );
              } else if (e.days < 1 && e.total > 0) {
                return (
                  <div style={{ color: "var(--yellow-300)" }}>
                    Time left:&nbsp;
                    {e.days} Days {e.hours} hours {e.minutes} minutes
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "var(--red-500)",
                      textAlign: "right",
                    }}
                  >
                    Attention your list is overdone! <br />
                    Finish date:&nbsp;
                    {moment(selectedData.finishDate).format(
                      "MMMM Do YYYY, HH:mm:ss "
                    )}
                  </div>
                );
              }
            }}
          />
        </h3>
      </div>
    );
  }

  function Footer() {
    return (
      <div>
        <Add fetchData={fetchData} list={selectedData} />
      </div>
    );
  }
}

export default Table;
