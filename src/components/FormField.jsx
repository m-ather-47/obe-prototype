export function FormField({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full px-3.5 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200/90 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all shadow-2xs"
      />
    </div>
  );
}

export function SelectField({ label, children, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <select
        {...props}
        className="w-full px-3.5 py-2.5 bg-white hover:bg-gray-50 focus:bg-white border border-gray-200/90 rounded-xl text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all shadow-2xs cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
}