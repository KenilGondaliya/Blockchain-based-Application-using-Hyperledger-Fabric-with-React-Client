import { useState } from "react";
import axios from "axios";

function App() {
  const [id, setId] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [owner, setOwner] = useState("");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const create = async () => {
    await axios.post("http://localhost:3001/create", {
      id,
      color,
      size,
      owner,
      value,
    });
    alert("Created");
  };

  const read = async () => {
    const res = await axios.get(`http://localhost:3001/read/${id}`);
    setResult(JSON.stringify(res.data, null, 2));
  };

  const update = async () => {
    await axios.put("http://localhost:3001/update", {
      id,
      color,
      size,
      owner,
      value,
    });
    alert("Updated");
  };

  const del = async () => {
    await axios.delete(`http://localhost:3001/delete/${id}`);
    alert("Deleted");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Fabric CRUD App</h2>

      <input placeholder="ID" onChange={e => setId(e.target.value)} /><br />
      <input placeholder="Color" onChange={e => setColor(e.target.value)} /><br />
      <input placeholder="Size" onChange={e => setSize(e.target.value)} /><br />
      <input placeholder="Owner" onChange={e => setOwner(e.target.value)} /><br />
      <input placeholder="Value" onChange={e => setValue(e.target.value)} /><br /><br />

      <button onClick={create}>Create</button>
      <button onClick={read}>Read</button>
      <button onClick={update}>Update</button>
      <button onClick={del}>Delete</button>

      <pre>{result}</pre>
    </div>
  );
}

export default App;