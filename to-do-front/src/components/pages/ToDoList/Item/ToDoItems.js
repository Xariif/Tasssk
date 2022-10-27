import React, { useEffect, useState } from "react";

import { Add as AddNewItem } from "./Actions/Add";
import { Add as AddNewFile } from "./Files/Add";
import Countdown from "react-countdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { UpdateItem } from "../../../../services/ToDoService";
import moment from "moment";
import { Edit } from "./Actions/Edit";

import { Delete } from "./Actions/Delete";

function ToDoItem({ list, fetchData }) {
  const [sortedList, setSortedList] = useState([]);
  var finishDate = new Date(list.finishDate);

  console.log(list);

  useEffect(() => {
    setSortedList(
      list.items.sort((a, b) => {
        const date1 = new Date(a.createdAt);
        const date2 = new Date(b.createdAt);
        return date1 - date2;
      })
    );
  }, [list]);

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

  return (
    <>
      <div className="ToDoItem">
        <DataTable
          emptyMessage={
            "Your list is empty! Add somethning using button bellow"
          }
          value={list.items}
          header={<Topbar />}
          footer={<Footer />}
          responsiveLayout="scroll"
          rowHover
          /*
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[8, 25, 50]}
          rows={8}
          */
        >
          <Column
            field="name"
            header="Name"
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
            }}
          />
          <Column
            header="Finished"
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
    </>
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
        <h1>{list.name.toUpperCase()}</h1>
        <h3 style={{ textAlign: "center", display: "flex" }}>
          <Countdown
            date={finishDate}
            renderer={(e) => {
              if (e.days >= 1) {
                return (
                  <div style={{ color: "var(--green-500)" }}>
                    Time left:&nbsp;
                    {e.days} Days {e.hours} hours {e.minutes} minutes
                  </div>
                );
              } else if (e.days < 1 && e.total > 0) {
                return (
                  <div style={{ color: "var(--yellow-500)" }}>
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <AddNewFile list={list} />
        <AddNewItem fetchData={fetchData} list={list} />
      </div>
    );
  }
}

export default ToDoItem;
