import { Link } from "react-router-dom";

const Sidebar = ()=>{
    return(
    <div>
       <aside className="w-64 bg-white shadow-md h-screen">
         <div className="p-4 font-bold text-xl border-b">Flow CRM</div>
            <nav className="p-4 space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-blue-600">
                  Dashboard
              </Link>
              <Link to="/customers" className="block text-gray-700 hover:text-blue-600">
                Customers
              </Link>
              <Link to="/invoices" className="block text-gray-700 hover:text-blue-600">
                Invoices
              </Link>
            </nav>
        </aside>
    </div>
    )
}
export default Sidebar;