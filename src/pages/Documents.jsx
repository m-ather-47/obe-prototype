import { UploadCloud, FileText, Trash2, Info } from "lucide-react";
import { useRef, useState } from "react";
import { useLocalState } from "../data/store";
import { useWorkflow } from "../hooks/useWorkflow";
import WorkflowSelector from "../components/WorkflowSelector";

const assessmentTypes = ["Assignment", "Quiz", "Mid Exam", "Final Exam"];
const sampleKinds = ["Best", "Average", "Worst"];
const standaloneDocs = ["Course Outline", "Lab Manuals"];

const categoryDescriptions = {
  "Assignment - Best": "Exemplary student submissions for assignment rubrics",
  "Assignment - Average": "Median representative student assignment submissions",
  "Assignment - Worst": "Remediation candidate student assignment submissions",
  "Quiz - Best": "Top score answer sheets for quiz evaluations",
  "Quiz - Average": "Median representative answer sheets for quizzes",
  "Quiz - Worst": "Low score answer sheets for quiz evaluations",
  "Mid Exam - Best": "Exemplary student mid exam answer booklets",
  "Mid Exam - Average": "Median representative mid exam answer booklets",
  "Mid Exam - Worst": "Remediation candidate mid exam answer booklets",
  "Final Exam - Best": "Exemplary student final exam answer scripts",
  "Final Exam - Average": "Median representative final exam answer scripts",
  "Final Exam - Worst": "Remediation candidate final exam answer scripts",
  "Course Outline": "HEC / NCEAC approved course syllabus document",
  "Lab Manuals": "Practical workbooks & laboratory session rubrics",
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Evidence & Documents</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Store accreditation artifacts (Best, Average, Worst student work, course outlines and lab manuals).
          </p>
        </div>
      </div>

      <WorkflowSelector wf={wf} />

      {uploadedMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold animate-in fade-in">
          <UploadCloud size={16} className="text-emerald-600" />
          <span>Document record recorded in local archive.</span>
        </div>
      )}

      {!wf.section ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-12 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-150">
            <UploadCloud size={22} />
          </div>
          <p className="text-xs font-semibold text-gray-500">Select an academic course and section above to upload evidence.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2.5 bg-blue-50/70 border border-blue-200/60 text-blue-900 px-4 py-3 rounded-2xl text-xs font-semibold">
            <Info size={16} className="text-blue-600 shrink-0" />
            <span>Prototype storage mode: file metadata (name, size, timestamp) is archived in browser cache.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {categories.map((category) => {
              const docs = sectionDocs(category);
              return (
                <div
                  key={category}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 bg-purple-50 text-purple-600 border border-purple-200/60 rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                        <FileText size={16} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">{category}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight font-medium">
                          {categoryDescriptions[category]}
                        </p>
                      </div>
                    </div>

                    <label className="mt-3 flex items-center justify-center gap-2 border border-dashed border-gray-300 hover:border-black rounded-2xl py-2.5 text-xs font-semibold text-gray-700 hover:text-black cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 transition-all">
                      <UploadCloud size={14} />
                      <span>Upload Sample</span>
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
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    {docs.length > 0 ? (
                      <ul className="space-y-2">
                        {docs.map((d) => (
                          <li
                            key={d.id}
                            className="flex items-center justify-between gap-2 bg-gray-50/80 border border-gray-150 rounded-xl px-3 py-2 text-xs"
                          >
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">{d.filename}</p>
                              <p className="text-[10px] text-gray-400">{d.size} · {d.date}</p>
                            </div>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg shrink-0 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-gray-400 font-medium text-center py-1">No artifacts uploaded yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}