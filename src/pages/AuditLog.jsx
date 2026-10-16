import { auditLogs, users } from "../data/mockData";
import { useLocalState } from "../data/store";
import { ScrollText, Filter } from "lucide-react";

export default function AuditLog() {
  const [logs] = useLocalState("obe_audit_logs", auditLogs);
  const [userList] = useLocalState("obe_users", users);

  const getActorName = (id) => userList.find((u) => u.id === id)?.name || "—";

  const getActionColor = (action) => {
    switch (action) {
      case "INSERT": return "bg-green-100 text-green-700";
      case "UPDATE": return "bg-blue-100 text-blue-700";
      case "DELETE": return "bg-red-100 text-red-700";
      case "COMPUTE": return "bg-purple-100 text-purple-700";
      case "SNAPSHOT": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Audit Log</h1>
          <p className="text-sm text-gray-500">Track all system modifications for data integrity</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Entity</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Entity ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actor</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-sm text-gray-400 font-mono">{log.id}</td>
                <td className="px-5 py-3 text-sm text-gray-600 font-mono">{log.timestamp}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ScrollText size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{log.entity_type}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600 font-mono">{log.entity_id}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600">{getActorName(log.actor_id)}</td>
                <td className="px-5 py-3 text-sm text-gray-500 font-mono">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
