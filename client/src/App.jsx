import { useSelector } from "react-redux";
import AppLayout from "./layout";
import "sweetalert2/dist/sweetalert2.min.css";
import './App.css'

const App = () => {
  const darkMode = useSelector((x) => x.app.darkMode);
  return (
    <div data-theme={`${darkMode ? "dark" : "cupcake"}`}>
      <AppLayout />
    </div>
  );
};

export default App;
