import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

import { useAuthContext } from "../../../context/AuthContext";
import { useAuthUpdateContext } from "../../../context/AuthContext";

import "./Home.scss";

import { HubConnectionBuilder } from "@microsoft/signalr";

function Home() {
  const setAuth = useAuthUpdateContext();
  const auth = useAuthContext();

  useEffect(() => {
    let connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/notifications")
      .build();
    try {
      connection.start();
      console.log("dziala");
    } catch (error) {
      console.log("catch", error);
    }
  }, []);

  return (
    <div className="Home">
      <h1>Welcome on my page! </h1>

      <div className="Cards">
        <Card
          header={<i className="pi pi-list" />}
          title={"To Do List"}
          className="Card"
          footer={
            <Link to="/ToDoList">
              <Button
                label="Check To Do List"
                className="p-button-rounded p-button-secondary"
              >
                {" "}
              </Button>
            </Link>
          }
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          ullamcorper rutrum sagittis. Praesent neque mauris, molestie ut
          condimentum et, feugiat eget sem. Duis dictum ipsum sed neque porta
          scelerisque. Ut convallis enim ligula, at pharetra mauris egestas
          vitae. Vivamus fringilla sollicitudin pretium. Proin euismod, ante et
          porttitor pretium, ante nisi lobortis massa, vitae commodo tellus
          libero at nibh. Donec placerat est mauris, in interdum tellus
          ullamcorper ac. Duis a erat viverra enim luctus facilisis. Sed
          fringilla metus sit amet orci tincidunt dignissim. Vestibulum viverra
          neque quis sapien imperdiet ultrices. Proin sed tellus egestas,
          molestie libero non, tincidunt erat. Nam dictum eu nisi at tincidunt.
          Mauris convallis nisl nisl, eu ultricies metus porta ac. Maecenas et
          consectetur lectus. Etiam sagittis mattis tellus quis interdum.
        </Card>
        <Card
          header={<i className="pi pi-calendar-times" />}
          title={"Events"}
          className="Card"
          footer={
            <Link to="/Events">
              <Button
                label="Check Events"
                className="p-button-rounded p-button-secondary"
              >
                {" "}
              </Button>
            </Link>
          }
        >
          Suspendisse potenti. Aliquam quis suscipit lorem, sit amet pulvinar
          diam. Nullam molestie, augue eu porta consequat, mauris dolor eleifend
          leo, sed hendrerit enim lacus eu mi. In sit amet consectetur lorem,
          nec vulputate dui. Nulla varius, felis ut euismod suscipit, lorem
          lectus venenatis felis, et viverra lectus justo placerat lorem. Nunc
          tempor urna sit amet leo porta mattis. Duis pharetra congue dui, sed
          rutrum lectus porta vel. Duis vehicula ante eros, sed facilisis libero
          consectetur molestie. Suspendisse ac tincidunt leo. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Sed vitae felis pellentesque orci rhoncus fermentum et
          eget est. Suspendisse ac commodo arcu, eu fermentum ante. Ut ac
          aliquam odio. Nulla eros leo, hendrerit tristique laoreet in, egestas
          vel nunc. Integer commodo tortor bibendum, venenatis justo quis,
          mattis nisl. Nulla pharetra, leo eget rutrum semper, magna libero
          posuere nisi, at sollicitudin mi massa quis mauris. In non hendrerit
          sapien. Proin euismod blandit vehicula. Etiam eget interdum eros, eu
          bibendum nulla. Duis nulla augue, bibendum viverra auctor at,
          fringilla vel elit. Donec eu est urna. Nunc congue felis arcu, vel
          aliquam leo sollicitudin eu. Aenean egestas id sapien a dapibus. Donec
          bibendum eget tellus ut dictum.
        </Card>
        <Card
          header={<i className="pi pi-info-circle" />}
          title={"About us"}
          className="Card"
          footer={
            <Link to="/Info">
              <Button
                disabled
                label="Check Info"
                className="p-button-rounded p-button-secondary"
              />
            </Link>
          }
        >
          Nullam in finibus neque. Vivamus porta, nisi et feugiat luctus, nisl
          orci eleifend augue, at molestie est nisl vitae odio. In sit amet
          elementum mi. Donec et mauris ex. In consequat euismod augue id
          ornare. Proin interdum nisl eget maximus consequat. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Aenean ipsum lorem, imperdiet ut leo quis, tristique
          efficitur mi
        </Card>
      </div>
    </div>
  );
}

export default Home;
