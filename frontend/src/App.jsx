import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  Sun,
  Moon,
  X,
  Loader2,
  Target,
  LayoutDashboard,
  Menu,
  History as HistoryIcon,
  ChevronDown,
  LogOut,
  User,
  ArrowLeft,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Auth from "./components/Auth";

const API = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API,
  timeout: 120000,
});

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed right-5 top-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${toast.type === "error"
          ? "border-red-200 bg-white text-red-600"
          : "border-green-200 bg-white text-green-700"
        }`}
    >
      {toast.type === "error" ? (
        <AlertCircle size={18} />
      ) : (
        <CheckCircle size={18} />
      )}

      <span>{toast.message}</span>

      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-slate-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function LandingPage({ darkMode, user, onAnalyze, onSignIn }) {
  const text = darkMode ? "text-white" : "text-slate-900";
  const muted = darkMode ? "text-slate-400" : "text-slate-600";

  const card = darkMode
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-white";

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${darkMode
              ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
              : "border-indigo-200 bg-indigo-50 text-indigo-600"
            }`}
        >
          <Sparkles size={16} />
          AI-Powered Resume Analysis
        </div>

        <h1
          className={`text-4xl font-bold leading-tight tracking-tight sm:text-6xl ${text}`}
        >
          Make your resume{" "}
          <span className="text-indigo-500">job-ready.</span>
        </h1>

        <p
          className={`mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg ${muted}`}
        >
          Upload your resume, add a job description, and discover how well
          your resume matches the role.
        </p>

        <div className="mt-9 flex justify-center">
          <button
            onClick={onAnalyze}
            className="inline-flex min-w-[280px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 font-semibold text-white hover:bg-indigo-500"
          >
            <Sparkles size={19} />
            Analyze My Resume
          </button>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-3">
        {["ATS Score", "Matching Keywords", "AI Suggestions"].map(
          (title, i) => (
            <div
              key={title}
              className={`rounded-2xl border p-6 ${card}`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                {i === 0 ? (
                  <Target size={21} />
                ) : i === 1 ? (
                  <TrendingUp size={21} />
                ) : (
                  <Sparkles size={21} />
                )}
              </div>

              <h3 className="font-semibold">{title}</h3>

              <p
                className={`mt-2 text-sm leading-6 ${muted}`}
              >
                {i === 0
                  ? "Understand how well your resume fits the role."
                  : i === 1
                    ? "See skills already present and skills to add."
                    : "Get practical improvements tailored to the job."}
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}

function Analyzer({
  darkMode,
  resume,
  setResume,
  setResumeText,
  resumeText,
  uploading,
  setUploading,
  analyzing,
  onAnalyze,
  onRemove,
  showToast,
  jobDescriptionRef,
}) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analyze your resume</h1>

        <p
          className={`mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"
            }`}
        >
          Upload your resume and paste the job description to get an
          AI-powered ATS analysis.
        </p>
      </div>

      <div
        className={`rounded-2xl border p-6 shadow-xl sm:p-8 ${darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
          }`}
      >
        <div
          className={`rounded-xl border-2 border-dashed p-8 text-center sm:p-12 ${darkMode ? "border-slate-700" : "border-slate-300"
            }`}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
            {uploading ? (
              <Loader2 size={26} className="animate-spin" />
            ) : (
              <Upload size={26} />
            )}
          </div>

          <h2 className="text-xl font-semibold">
            {uploading
              ? "Processing your resume..."
              : "Upload your resume"}
          </h2>

          <p
            className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"
              }`}
          >
            PDF files only · Maximum size 5MB
          </p>

          <label
            className={`mt-6 inline-flex items-center rounded-xl px-6 py-3 font-medium text-white ${uploading
                ? "cursor-not-allowed bg-indigo-400"
                : "cursor-pointer bg-indigo-600 hover:bg-indigo-500"
              }`}
          >
            {uploading ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              <Upload size={18} className="mr-2" />
            )}

            {uploading ? "Uploading..." : "Choose PDF"}

            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                if (file.type !== "application/pdf") {
                  showToast(
                    "Please select a PDF file.",
                    "error"
                  );
                  e.target.value = "";
                  return;
                }

                if (file.size > 5 * 1024 * 1024) {
                  showToast(
                    "PDF size must be less than 5MB.",
                    "error"
                  );
                  e.target.value = "";
                  return;
                }

                setResume(file);
                setResumeText("");

                const fd = new FormData();
                fd.append("resume", file);

                try {
                  setUploading(true);

                  const r = await api.post(
                    "/resume/upload",
                    fd
                  );

                  if (!r.data.success || !r.data.text) {
                    throw new Error(
                      r.data.message ||
                      "Could not extract resume text"
                    );
                  }

                  setResumeText(r.data.text);

                  showToast(
                    "Resume text extracted successfully!"
                  );
                } catch (err) {
                  setResume(null);
                  setResumeText("");

                  showToast(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to process resume.",
                    "error"
                  );
                } finally {
                  setUploading(false);
                  e.target.value = "";
                }
              }}
            />
          </label>

          {resume && !uploading && (
            <div
              className={`mx-auto mt-6 flex max-w-md items-center justify-between rounded-xl border px-4 py-3 text-left ${darkMode
                  ? "border-slate-700 bg-slate-800"
                  : "border-indigo-200 bg-indigo-50"
                }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText
                  size={20}
                  className="shrink-0 text-indigo-500"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {resume.name}
                  </p>

                  <p
                    className={`text-xs ${darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                      }`}
                  >
                    {(resume.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRemove}
                className="ml-3 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <label className="mb-3 block text-sm font-semibold">
            Job Description
          </label>

          <textarea
            ref={jobDescriptionRef}
            rows={8}
            defaultValue=""
            onInput={(e) => {
              jobDescriptionRef.current.value =
                e.currentTarget.value;
            }}
            placeholder="Paste the job description here..."
            className={`block w-full resize-y rounded-xl border p-4 text-sm leading-6 outline-none transition ${darkMode
                ? "border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus:border-indigo-500"
                : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
              }`}
          />
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={
            !resumeText ||
            !jobDescriptionRef.current?.value?.trim() ||
            analyzing ||
            uploading
          }
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white ${!resumeText ||
              !jobDescriptionRef.current?.value?.trim() ||
              analyzing ||
              uploading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-indigo-600 hover:bg-indigo-500"
            }`}
        >
          {analyzing ? (
            <>
              <Loader2 size={19} className="animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Sparkles size={19} />
              Analyze Resume
            </>
          )}
        </button>
      </div>
    </main>
  );
}

function Result({ darkMode, analysis, onBack }) {
  const list = (value) =>
    Array.isArray(value) ? value : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <button
        onClick={onBack}
        className={`mb-8 flex items-center gap-2 text-sm ${darkMode
            ? "text-slate-400 hover:text-white"
            : "text-slate-500 hover:text-slate-900"
          }`}
      >
        <ArrowLeft size={18} />
        Analyze another resume
      </button>

      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-500">
          ANALYSIS COMPLETE
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Resume Analysis
        </h1>

        <p
          className={`mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"
            }`}
        >
          Here is how your resume matches the job description.
        </p>
      </div>

      <div
        className={`rounded-2xl border p-8 ${darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
          }`}
      >
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex h-40 w-40 shrink-0 flex-col items-center justify-center rounded-full border-8 border-indigo-500">
            <span className="text-4xl font-bold">
              {analysis?.atsScore ?? "—"}
            </span>

            <span
              className={`text-xs ${darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
                }`}
            >
              / 100
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              ATS Compatibility Score
            </h2>

            <p
              className={`mt-3 leading-7 ${darkMode
                  ? "text-slate-400"
                  : "text-slate-600"
                }`}
            >
              {analysis?.summary ||
                "Your resume has been analyzed against the job description."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <KeywordBox
          title="Matching Keywords"
          items={list(analysis?.matchingKeywords)}
          darkMode={darkMode}
          type="match"
        />

        <KeywordBox
          title="Missing Keywords"
          items={list(analysis?.missingKeywords)}
          darkMode={darkMode}
          type="missing"
        />

        <KeywordBox
          title="Recommended Keywords"
          items={list(analysis?.recommendedKeywords)}
          darkMode={darkMode}
          type="recommend"
        />

        <div
          className={`rounded-2xl border p-6 ${darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
            }`}
        >
          <h3 className="text-lg font-semibold">
            Improvement Suggestions
          </h3>

          <ul
            className={`mt-4 space-y-3 text-sm leading-6 ${darkMode
                ? "text-slate-300"
                : "text-slate-600"
              }`}
          >
            {list(analysis?.suggestions).map(
              (suggestion, index) => (
                <li
                  key={index}
                  className="flex gap-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  {suggestion}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}

function KeywordBox({
  title,
  items,
  darkMode,
  type,
}) {
  const className =
    type === "match"
      ? "bg-green-500/10 text-green-600"
      : type === "missing"
        ? "bg-red-500/10 text-red-500"
        : "bg-indigo-500/10 text-indigo-500";

  return (
    <div
      className={`rounded-2xl border p-6 ${darkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
        }`}
    >
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.length ? (
          items.map((keyword, index) => (
            <span
              key={index}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${className}`}
            >
              {keyword}
            </span>
          ))
        ) : (
          <span
            className={`text-sm ${darkMode
                ? "text-slate-500"
                : "text-slate-400"
              }`}
          >
            None found
          </span>
        )}
      </div>
    </div>
  );
}

function Dashboard({
  darkMode,
  stats,
  recent,
  onAnalyze,
  onHistory,
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p
        className={`mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"
          }`}
      >
        Track your resume analysis performance.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Stat
          title="Total Analyses"
          value={stats.total}
          icon={<FileText size={20} />}
          sub="Analyses completed"
          darkMode={darkMode}
        />

        <Stat
          title="Average ATS"
          value={
            stats.average == null
              ? "—"
              : stats.average
          }
          icon={<TrendingUp size={20} />}
          sub="Based on your analyses"
          darkMode={darkMode}
        />

        <Stat
          title="Best Score"
          value={
            stats.best == null
              ? "—"
              : stats.best
          }
          icon={<Target size={20} />}
          sub="Your highest ATS score"
          darkMode={darkMode}
        />
      </div>

      <div
        className={`mt-8 rounded-2xl border p-6 ${darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
          }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Recent Analyses
            </h2>

            <p
              className={`mt-1 text-sm ${darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
                }`}
            >
              Your latest resume results.
            </p>
          </div>

          <button
            onClick={onHistory}
            className="text-sm font-semibold text-indigo-500 hover:text-indigo-400"
          >
            View all
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {recent.length ? (
            recent.map((analysis) => (
              <div
                key={analysis._id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${darkMode
                    ? "border-slate-800 bg-slate-950"
                    : "border-slate-200 bg-slate-50"
                  }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {analysis.fileName ||
                      "Resume analysis"}
                  </p>

                  <p
                    className={`mt-1 text-xs ${darkMode
                        ? "text-slate-500"
                        : "text-slate-400"
                      }`}
                  >
                    {analysis.createdAt
                      ? new Date(
                        analysis.createdAt
                      ).toLocaleString()
                      : ""}
                  </p>
                </div>

                <span className="ml-4 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm font-bold text-indigo-500">
                  {analysis.atsScore}/100
                </span>
              </div>
            ))
          ) : (
            <div
              className={`py-10 text-center text-sm ${darkMode
                  ? "text-slate-500"
                  : "text-slate-400"
                }`}
            >
              <HistoryIcon
                size={34}
                className="mx-auto mb-3"
              />
              No analyses yet. Run your first analysis.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onAnalyze}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500"
      >
        <Sparkles size={18} />
        Analyze a new resume
      </button>
    </main>
  );
}

function Stat({
  title,
  value,
  icon,
  sub,
  darkMode,
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${darkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
        }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={
            darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }
        >
          {title}
        </span>

        <span className="text-indigo-500">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>

      <p
        className={`mt-1 text-xs ${darkMode
            ? "text-slate-500"
            : "text-slate-400"
          }`}
      >
        {sub}
      </p>
    </div>
  );
}

function HistoryPage({
  darkMode,
  history,
  onAnalyze,
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Analysis History
      </h1>

      <p
        className={`mt-2 ${darkMode
            ? "text-slate-400"
            : "text-slate-600"
          }`}
      >
        All your saved resume analyses.
      </p>

      <div
        className={`mt-8 rounded-2xl border ${darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
          }`}
      >
        {history.length ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {history.map((analysis) => (
              <div
                key={analysis._id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {analysis.fileName ||
                      "Resume analysis"}
                  </p>

                  <p
                    className={`mt-1 text-sm ${darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                      }`}
                  >
                    {analysis.createdAt
                      ? new Date(
                        analysis.createdAt
                      ).toLocaleString()
                      : ""}
                  </p>

                  <p
                    className={`mt-1 text-xs ${darkMode
                        ? "text-slate-500"
                        : "text-slate-400"
                      }`}
                  >
                    {analysis.jobDescription?.slice(
                      0,
                      100
                    ) || "Job description"}
                    {analysis.jobDescription?.length >
                      100
                      ? "…"
                      : ""}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl bg-indigo-500/10 px-4 py-2 text-lg font-bold text-indigo-500">
                  {analysis.atsScore}/100
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <HistoryIcon
              size={42}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-4 font-semibold">
              No analyses yet
            </h2>

            <p
              className={`mt-2 text-sm ${darkMode
                  ? "text-slate-500"
                  : "text-slate-400"
                }`}
            >
              Your saved analyses will appear here.
            </p>

            <button
              onClick={onAnalyze}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Analyze Resume
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") !== "light"
  );

  const [user, setUser] = useState(getStoredUser);
  const [showAuth, setShowAuth] = useState(false);
  const [page, setPage] = useState("home");
  const [sidebar, setSidebar] = useState(false);
  const [menu, setMenu] = useState(false);
  const [account, setAccount] = useState(false);

  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState("");

  const jobDescriptionRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [toast, setToast] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    average: null,
    best: null,
  });

  const [history, setHistory] = useState([]);
  const [authNotice, setAuthNotice] = useState("");

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    window.clearTimeout(
      window.__resumeToast
    );

    window.__resumeToast =
      window.setTimeout(
        () => setToast(null),
        3000
      );
  };

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const loadData = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [statsResponse, historyResponse] =
        await Promise.all([
          api.get(
            "/analysis/stats",
            config
          ),
          api.get(
            "/analysis/history",
            config
          ),
        ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (historyResponse.data.success) {
        setHistory(
          historyResponse.data.analyses || []
        );
      }
    } catch (error) {
      console.error(
        "History load error:",
        error
      );
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const openAnalyzer = () => {
    if (!user) {
      setAuthNotice(
        "Please sign in first to analyze your resume."
      );
      setShowAuth(true);
      return;
    }

    setPage("analyzer");
    setSidebar(false);
  };

  const handleAuthDone = () => {
    const storedUser = getStoredUser();

    setUser(storedUser);
    setShowAuth(false);
    setAuthNotice("");
    setPage("home");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMenu(false);
    setSidebar(false);
    setAccount(false);
    setPage("home");
    setAnalysis(null);

    showToast("Logged out successfully.");
  };

  const removeResume = () => {
    setResume(null);
    setResumeText("");
    setAnalysis(null);

    if (jobDescriptionRef.current) {
      jobDescriptionRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    const jobDescription =
      jobDescriptionRef.current?.value?.trim() ||
      "";

    if (!resumeText?.trim()) {
      showToast(
        "Please upload a resume first.",
        "error"
      );
      return;
    }

    if (!jobDescription) {
      showToast(
        "Please enter a job description.",
        "error"
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      showToast(
        "Please sign in first.",
        "error"
      );
      setShowAuth(true);
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysis(null);

      const response = await api.post(
        "/analysis/analyze",
        {
          resumeText,
          jobDescription,
          fileName:
            resume?.name || "Resume.pdf",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        !response.data?.success ||
        !response.data?.analysis
      ) {
        throw new Error(
          response.data?.message ||
          "Analysis failed. Please try again."
        );
      }

      setAnalysis(response.data.analysis);

      // Clear resume and job description after
      // a successful analysis.
      setResume(null);
      setResumeText("");

      if (jobDescriptionRef.current) {
        jobDescriptionRef.current.value = "";
      }

      setPage("result");

      await loadData();

      showToast(
        "Resume analyzed successfully!"
      );
    } catch (error) {
      console.error(
        "Analysis error:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.message ||
        error.message ||
        "Failed to analyze resume. Check the backend terminal for details.",
        "error"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (showAuth) {
    return (
      <Auth
        onBack={() => {
          setShowAuth(false);
          setAuthNotice("");
        }}
        onAuthDone={handleAuthDone}
        initialNotice={authNotice}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  const background = darkMode
    ? "bg-slate-950 text-white"
    : "bg-slate-50 text-slate-900";

  return (
    <div
      className={`min-h-screen ${background}`}
    >
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

      <nav
        className={`border-b ${darkMode
            ? "border-slate-800 bg-slate-950"
            : "border-slate-200 bg-white"
          }`}
      >
        <div className="flex h-20 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            {user && (
              <button
                type="button"
                onClick={() => {
                  setSidebar(
                    (value) => !value
                  );
                  setMenu(false);
                }}
                className={`rounded-xl border p-2.5 ${darkMode
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-slate-300 hover:bg-slate-100"
                  }`}
                aria-label="Open menu"
              >
                <Menu size={21} />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setPage("home");
                setSidebar(false);
              }}
              className="flex items-center gap-3"
            >
              <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                <FileText size={22} />
              </div>

              <span className="text-xl font-bold tracking-tight">
                Resume Analyzer
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  (value) => !value
                )
              }
              className={`rounded-xl border p-2.5 ${darkMode
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-300 hover:bg-slate-100"
                }`}
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setMenu(
                      (value) => !value
                    );
                    setSidebar(false);
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${darkMode
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <span className="hidden max-w-28 truncate sm:block">
                    {user.name}
                  </span>

                  <ChevronDown size={16} />
                </button>

                {menu && (
                  <div
                    className={`absolute right-0 top-14 z-50 w-52 rounded-xl border p-2 shadow-xl ${darkMode
                        ? "border-slate-700 bg-slate-900"
                        : "border-slate-200 bg-white"
                      }`}
                  >
                    <button
                      onClick={() => {
                        setAccount(true);
                        setMenu(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${darkMode
                          ? "hover:bg-slate-800"
                          : "hover:bg-slate-100"
                        }`}
                    >
                      <User size={17} />
                      Account
                    </button>

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() =>
                  setShowAuth(true)
                }
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {user && sidebar && (
        <>
          <button
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() =>
              setSidebar(false)
            }
            aria-label="Close sidebar"
          />

          <aside
            className={`fixed left-0 top-0 z-50 h-full w-72 border-r p-5 shadow-2xl ${darkMode
                ? "border-slate-800 bg-slate-950"
                : "border-slate-200 bg-white"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-600 p-2 text-white">
                  <FileText size={20} />
                </div>

                <span className="font-bold">
                  Resume Analyzer
                </span>
              </div>

              <button
                onClick={() =>
                  setSidebar(false)
                }
                className={`rounded-lg p-2 ${darkMode
                    ? "text-slate-400 hover:bg-slate-800"
                    : "text-slate-400 hover:bg-slate-100"
                  }`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 space-y-2">
              <button
                onClick={() => {
                  setPage("home");
                  setSidebar(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${page === "home"
                    ? "bg-indigo-500/10 text-indigo-500"
                    : darkMode
                      ? "hover:bg-slate-800"
                      : "hover:bg-slate-100"
                  }`}
              >
                <span className="text-lg leading-none">
                  ⌂
                </span>
                Home
              </button>

              <button
                onClick={() => {
                  setPage("dashboard");
                  setSidebar(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${page === "dashboard"
                    ? "bg-indigo-500/10 text-indigo-500"
                    : darkMode
                      ? "hover:bg-slate-800"
                      : "hover:bg-slate-100"
                  }`}
              >
                <LayoutDashboard size={19} />
                Dashboard
              </button>

              <button
                onClick={() => {
                  setPage("history");
                  setSidebar(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${page === "history"
                    ? "bg-indigo-500/10 text-indigo-500"
                    : darkMode
                      ? "hover:bg-slate-800"
                      : "hover:bg-slate-100"
                  }`}
              >
                <HistoryIcon size={19} />
                History
              </button>
            </div>
          </aside>
        </>
      )}

      {page === "home" && (
        <LandingPage
          darkMode={darkMode}
          user={user}
          onAnalyze={openAnalyzer}
          onSignIn={() =>
            setShowAuth(true)
          }
        />
      )}

      {page === "dashboard" && user && (
        <Dashboard
          darkMode={darkMode}
          stats={stats}
          recent={history.slice(0, 5)}
          onAnalyze={openAnalyzer}
          onHistory={() =>
            setPage("history")
          }
        />
      )}

      {page === "history" && user && (
        <HistoryPage
          darkMode={darkMode}
          history={history}
          onAnalyze={openAnalyzer}
        />
      )}

      {page === "analyzer" && user && (
        <Analyzer
          darkMode={darkMode}
          resume={resume}
          setResume={setResume}
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDescriptionRef={
            jobDescriptionRef
          }
          uploading={uploading}
          setUploading={setUploading}
          analyzing={analyzing}
          onAnalyze={handleAnalyze}
          onRemove={removeResume}
          showToast={showToast}
        />
      )}

      {page === "result" &&
        user &&
        analysis && (
          <Result
            darkMode={darkMode}
            analysis={analysis}
            onBack={() => {
              setPage("analyzer");
              setResume(null);
              setResumeText("");
              setAnalysis(null);

              if (jobDescriptionRef.current) {
                jobDescriptionRef.current.value =
                  "";
              }
            }}
          />
        )}

      {account && user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
              }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Account
              </h2>

              <button
                onClick={() =>
                  setAccount(false)
                }
                className={`rounded-lg p-2 ${darkMode
                    ? "text-slate-400 hover:bg-slate-800"
                    : "text-slate-400 hover:bg-slate-100"
                  }`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                {user.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>

              <div>
                <h3 className="font-semibold">
                  {user.name}
                </h3>

                <p
                  className={`text-sm ${darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                    }`}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
