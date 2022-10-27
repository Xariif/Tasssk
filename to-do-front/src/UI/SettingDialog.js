const StyledDialog = () => {
  <Dialog
    style={{ borderRadius: "2rem", border: "none", overflow: "hidden" }}
    className=" text-white font-bold  text-2xl"
    visible={visible}
    draggable={false}
    headerStyle={{ display: "flex", justifyContent: "space-between" }}
    footer={
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {" "}
        <Countdown date={Date.now() + 10000} daysInHours>
          <Delete />
        </Countdown>
      </div>
    }
    onHide={() => setVisible(false)}
    header="Waring!"
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
        alignItems: "center",
      }}
    >
      <i className="pi pi-exclamation-triangle" style={{ fontSize: "3rem" }} />
      <p style={{ marginLeft: "1rem", textAlign: "center" }}>
        {" "}
        Are you sure you want to pernamentally delete your account?
        <br />
        You will lose all saved data!
      </p>
      c
    </div>
  </Dialog>;
};
