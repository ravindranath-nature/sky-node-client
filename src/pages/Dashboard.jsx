import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import FileTable from "../component/Filetable";

export default function Dashboard() {
  return (
    <div className="flex bg-dark min-h-screen text-white">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Shared Files</h2>
          <FileTable />
        </div>
      </div>
    </div>
  );
}
