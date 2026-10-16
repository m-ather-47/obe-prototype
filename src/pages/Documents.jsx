import { UploadCloud, FileText, Trash2, Info } from "lucide-react";
import { useRef, useState } from "react";
import { useLocalState } from "../data/store";
import { useWorkflow } from "../hooks/useWorkflow";
import WorkflowSelector from "../components/WorkflowSelector";

const assessmentTypes = ["Assignment", "Quiz", "Mid Exam", "Final Exam"];
const sampleKinds = ["Best", "Average", "Worst"];
const standaloneDocs = ["Course Outline", "Lab Manuals"];

const categoryDescriptions = {
  "Assignment - Best": "Best student submissions of assignment blueprints",
  "Assignment - Average": "Average student submissions of assignment blueprints",
  "Assignment - Worst": "Weakest submissions of assignment blueprints",
  "Quiz - Best": "Best student submissions of quiz blueprints",
  "Quiz - Average": "Average student submissions of quiz blueprints",
  "Quiz - Worst": "Weakest submissions of quiz blueprints",
  "Mid Exam - Best": "Best answer sheets of mid exam blueprints",
  "Mid Exam - Average": "Average answer sheets of mid exam blueprints",
  "Mid Exam - Worst": "Weakest answer sheets of mid exam blueprints",
  "Final Exam - Best": "Best answer sheets of final exam blueprints",
  "Final Exam - Average": "Average answer sheets of final exam blueprints",
  "Final Exam - Worst": "Weakest answer sheets of final exam blueprints",
  "Course Outline": "Approved course outline document",
  "Lab Manuals": "Lab manuals / practical workbooks",
};

const formatBytes = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Documents() {
  const wf = useWorkflow();
  const [documents, setDocuments] = useLocalState("obe_documents", []);
  const [uploadedMsg, setUploadedMsg] = useState(false);
  const fileRefs = useRef({});

  const categories = [
    ...assessmentTypes.flatMap((type) =>
      sampleKinds.map((kind) => `${type} - ${kind}`)
    ),
    ...standaloneDocs,
  ];

  const sectionDocs = (category) =>
    documents.filter(
      (d) =>
        d.section_id === wf.sectionId &&
        d.course_id === wf.courseId &&
        d.category === category
    );

  const handleUpload = (category, files) => {
    if (!files || files.length === 0 || !wf.sectionId) return;
    let maxId = documents.reduce((m, d) => Math.max(m, d.id), 0);
    const newEntries = Array.from(files).map((f) => ({
      id: (maxId += 1),
      course_id: wf.courseId,
      section_id: wf.sectionId,
      category,
      filename: f.name,
      size: formatBytes(f.size),
      date: new Date().toISOString().slice(0, 10),
    }));
    setDocuments([...documents, ...newEntries]);
    setUploadedMsg(true);
    setTimeout(() => setUploadedMsg(false), 3000);
    if (fileRefs.current[category]) fileRefs.current[category].value = "";
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this document record?")) {
      setDocuments(documents.filter((d) => d.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Document Upload</h1>
          <p className="text-sm text-gray-500">
            Upload blueprint samples (Best / Average / Worst), course outlines and lab manuals
          </p>
        </div>
      </div>

      <WorkflowSelector wf={wf} />

      {uploadedMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg mb-4 text-sm">
          <UploadCloud size={16} />
          Document record saved to local storage (demo — actual uploads are simulated).
        </div>
      )}

      {!wf.section ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <UploadCloud size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Select a course and section to upload documents.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2.5 rounded-lg mb-5 text-sm">
            <Info size={16} />
            Prototype mode: only file metadata (name, size, date) is stored — no files are actually uploaded.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map((category) => {
              const docs = sectionDocs(category);
              return (
                <div key={category} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">{category}</h3>
                        <p className="text-[11px] text-gray-400">{categoryDescriptions[category]}</p>
                      </div>
                    </div>
                  </div>

                  <label className="mt-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-2.5 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors">
                    <UploadCloud size={15} />
                    Upload
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      ref={(el) => {
                        fileRefs.current[category] = el;
                      }}
                      onChange={(e) => handleUpload(category, e.target.files)}
                    />
                  </label>

                  {docs.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {docs.map((d) => (
                        <li key={d.id} className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">{d.filename}</p>
                            <p className="text-[10px] text-gray-400">{d.size} · {d.date}</p>
                          </div>
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="p-1 hover:bg-red-50 rounded-lg shrink-0"
                          >
                            <Trash2 size={13} className="text-red-500" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-gray-400 text-center">No documents uploaded</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}