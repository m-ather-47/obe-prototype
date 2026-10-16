import { auditLogs, users } from "../data/mockData";
import { useLocalState } from "../data/store";
import { ScrollText, ShieldCheck } from "lucide-react";

export default function AuditLog() {
  const [logs] = useLocalState("obe_audit_logs", auditLogs);
  const [userList] = useLocalState("obe_users", users);

  const getActorName = (id) => userList.find((u) => u.id === id)?.name || "—";

  const getActionBadge = (action) => {
    switch (action) {
      case "INSERT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "UPDATE":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "DELETE":
        return "bg-red-50 text-red-700 border-red-200/60";
      case "COMPUTE":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "SNAPSHOT":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200/60";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">System Audit Log</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Immutable ledger tracking institutional data modifications and evaluations.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-white border border-gray-200/90 rounded-full px-4 py-2 shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" /> Tamper-evident ledger
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Log ID</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entity</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entity ID</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actor</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Network Origin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-3.5 text-xs text-gray-400 font-mono font-bold">#{log.id}</td>
                <td className="px-6 py-3.5 text-xs text-gray-600 font-mono font-medium">{log.timestamp}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-gray-50 border border-gray-200/60 rounded-xl flex items-center justify-center text-gray-500 shadow-2xs">
                      <ScrollText size={13} />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{log.entity_type}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-xs text-gray-500 font-mono">{log.entity_id}</td>
                <td className="px-6 py-3.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getActionBadge(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-xs font-semibold text-gray-800">{getActorName(log.actor_id)}</td>
                <td className="px-6 py-3.5 text-xs text-gray-400 font-mono">{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
