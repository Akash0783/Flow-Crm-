import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";


function App() {
  return (
    <Router>
    <div className="flex h-screen bg-gray-100">
    <Sidebar />

     <div className="flex-1 flex flex-col">

      <main className="p-6 flex-1 overflow-y-auto">
       <Routes>
       <Route path="/"/>
       <Route path="/customers"/>
       <Route path="Invoices" />
       </Routes>
       </main>
      </div>
    </div>
    </Router>
  );
}

export default App;
