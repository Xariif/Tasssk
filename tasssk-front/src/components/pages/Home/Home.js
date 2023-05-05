import React from "react";
import { Link } from "react-router-dom";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import PrimeReact from "primereact/api";
import "./Home.scss";
import { Divider } from "primereact/divider";

function Home() {
  return (
    <div className="Home">
      <h1
        style={{ textShadow: "1px 1px 2px teal", color: "var(--text-color)" }}
      >
        Welcome in TASSSK!
      </h1>
      <div className="Cards">
        <Card
          header={<i className="pi pi-list" />}
          title={<div style={{ textAlign: "center" }}>To Do List</div>}
          className="Card"
          footer={
            <Link to="/ToDoList">
              <Button
                label="Check To Do List"
                className="p-button-rounded p-button-secondary"
              ></Button>
            </Link>
          }
        >
          This module is an essential part of any productivity application. It
          provides a platform for users to organize their tasks and manage their
          time effectively. The module includes various functions such as
          adding, editing, and deleting tasks, as well as setting deadlines and
          marking them as completed. Additionally, it offers the ability to
          manage files, including adding, deleting, and downloading them. The
          to-do list module also allows users to control access to their lists
          by adding privileges to other users. Overall, the module helps users
          increase productivity, reduce stress, and stay on top of their daily
          tasks.
        </Card>
        <Card
          header={<i className="pi pi-calendar-times" />}
          title={<div style={{ textAlign: "center" }}>Events</div>}
          className="Card"
          footer={
            <Link to="/Events">
              <Button
                label="Check Events"
                className="p-button-rounded p-button-secondary"
              ></Button>
            </Link>
          }
        >
          The Events module allows users to visualize their tasks in a calendar
          view. The module displays each list name and its corresponding
          deadline on the calendar, providing users with a comprehensive
          overview of their tasks.Clicking on a task in the calendar will take
          the user to the corresponding To-Do list, where they can manage the
          task further. The Events module is a useful tool for users who prefer
          a visual representation of their tasks and want to plan their schedule
          effectively.
        </Card>
        <Card
          header={<i className="pi pi-info-circle" />}
          title={<div style={{ textAlign: "center" }}>About me</div>}
          className="Card"
          footer={
            <>
              You can also check my GitHub, Linkedin or just mail me! &#128516;
              <br></br>
              <a
                href="https://github.com/Xariif"
                style={{
                  textDecoration: "inherit",

                  color: "inherit",
                }}
              >
                <i className="pi pi-github" />
              </a>
              <a
                href="https://www.linkedin.com/in/jakub-filiks-4537b9225/"
                style={{
                  textDecoration: "inherit",

                  color: "inherit",
                }}
              >
                <i className="pi pi-linkedin" />
              </a>
              <a
                href="mailto: jakubfiliks7@gmail.com"
                style={{
                  textDecoration: "inherit",

                  color: "inherit",
                }}
              >
                <i className="pi pi-at" />
              </a>
            </>
          }
        >
          Hello! I'm Jakub Filiks, the creator of this app. I'm a software
          engineer with a passion for building useful tools that make people's
          lives easier. In my free time, I enjoy hiking, riding motorcycle, and
          experimenting with new technologies. I built this app as a way to help
          myself and others stay organized and on top of their to-do lists. I
          hope you find it helpful, and please don't hesitate to reach out if
          you have any questions or feedback!
        </Card>
      </div>
    </div>
  );
}

export default Home;
