import { Add } from "./Actions/Add";
import Countdown from "react-countdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Checkbox } from "primereact/checkbox";
import { UpdateItem } from "../../../../services/ToDoService";
import moment from "moment";
import { Edit } from "./Actions/Edit";

import { Delete } from "./Actions/Delete";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

function Table({ list, loadData: fetchData }) {
  var finishDate = new Date(list.finishDate);
  const finishedTemplate = (row) => {
    function ChangeItemState(item) {
      item.finished = !item.finished;
      const body = {
        listId: list.id,
        item: item,
      };

      UpdateItem(body)
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
        <Edit selectedItem={row} list={list} fetchData={fetchData} />

        <Delete
          style={{ marginLeft: "10px" }}
          selectedItem={row}
          list={list}
          fetchData={fetchData}
        />
      </>
    );
  };

  const createadAtTemplate = (row) => {
    return <>{moment(row.createdAt).format("L HH:mm:ss ")}</>;
  };

  const finishedSort = (event) => {
    list.items.sort((val1, val2) => {
      const f1 = val1[event.field];
      const f2 = val2[event.field];
      let result = null;

      return f1;
    });
  };

  return (
    <div className="ToDoItem">
      <DataTable
        emptyMessage={"Your list is empty! Add somethning using button bellow"}
        value={list.items}
        header={<Topbar />}
        footer={<Footer />}
        responsiveLayout="scroll"
        sortField="createdAt"
        sortOrder={-1}
        selec
        rowHover
        paginator
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  "
        rows={7}
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
          style={{ textAlign: "center", width: "58px" }}
        />
        <Column
          header="Finished"
          //   sortable
          // sortFunction={finishedSort}
          body={finishedTemplate}
          style={{ textAlign: "center", width: "58px" }}
        />
        <Column
          header="Actions"
          body={actionsTemplate}
          headerStyle={{ width: "95px" }}
          style={{
            textAlign: "center",
            width: "132px",
          }}
        />
      </DataTable>
    </div>
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
          {list.name.toUpperCase()}
        </h1>
        <h3 style={{ textAlign: "center", display: "flex" }}>
          <Countdown
            date={finishDate}
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
                    {moment(finishDate, "HH:mm a").calendar()}
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
      <div style={{ display: "flex", justifyContent: "right" }}>
        <Add fetchData={fetchData} list={list} />
      </div>
    );
  }
}

export default Table;
