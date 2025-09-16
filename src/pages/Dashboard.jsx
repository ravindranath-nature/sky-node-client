import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import FileTable from "../component/Filetable";

export default function Dashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Shared Files</h2>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <FileTable />
          </div>
        </div>
      </div>
    </div>
  );
}
