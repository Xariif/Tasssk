const FirstListButton = ({ addButton }) => (
  <div style={{ width: "100%", textAlign: "center", padding: "10vh" }}>
    <h1>
      <p>
        Create your first to do list!
        <br /> Use button below
      </p>
    </h1>
    {addButton}
  </div>
);

export default FirstListButton;
