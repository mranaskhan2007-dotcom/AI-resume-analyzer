import { useState } from "react";
import axios from "axios";
import { FileText, ArrowLeft, Loader2, Sun, Moon } from "lucide-react";

function Auth({ onBack, onAuthDone, initialNotice, darkMode, setDarkMode }) {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault(); setError("");
        if (isRegister && !form.name.trim()) return setError("Please enter your name.");
        if (!form.email.trim() || !form.password) return setError("Please enter email and password.");
        try {
            setLoading(true);
            const endpoint = isRegister ? "http://localhost:5000/api/auth/register" : "http://localhost:5000/api/auth/login";
            const r = await axios.post(endpoint, form, { timeout: 20000 });
            localStorage.setItem("token", r.data.token);
            localStorage.setItem("user", JSON.stringify(r.data.user));
            onAuthDone();
        } catch (err) { setError(err.response?.data?.message || "Unable to sign in. Please try again."); }
        finally { setLoading(false); }
    };

    return <div className={`min-h-screen px-6 py-10 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
        {initialNotice && <div className="fixed right-5 top-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-amber-700 shadow-xl"><span>{initialNotice}</span></div>}
        <div className="flex items-center justify-between"><button onClick={onBack} className={`flex items-center gap-2 text-sm ${darkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}><ArrowLeft size={18} />Back</button><button onClick={() => setDarkMode(v => !v)} className={`rounded-xl border p-2.5 ${darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-white"}`}>{darkMode ? <Sun size={19} /> : <Moon size={19} />}</button></div>
        <div className="mx-auto mt-16 max-w-md"><div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white"><FileText size={25} /></div><h1 className="text-3xl font-bold">{isRegister ? "Create your account" : "Sign in to Resume Analyzer"}</h1><p className={`mt-3 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{isRegister ? "Start analyzing your resume today." : "Continue to your resume dashboard."}</p></div>
            <div className={`rounded-2xl border p-6 shadow-2xl ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                {error && <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${darkMode ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-red-200 bg-red-50 text-red-600"}`}>{error}</div>}
                <form onSubmit={submit} className="space-y-5">{isRegister && <div><label className="mb-2 block text-sm font-semibold">Name</label><input name="name" value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} autoComplete="name" className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 ${darkMode ? "border-slate-700 bg-slate-950 text-white" : "border-slate-300 bg-slate-50"}`} placeholder="Anas Khan" /></div>}<div><label className="mb-2 block text-sm font-semibold">Email</label><input name="email" type="email" value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} autoComplete="email" className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 ${darkMode ? "border-slate-700 bg-slate-950 text-white" : "border-slate-300 bg-slate-50"}`} placeholder="you@example.com" /></div><div><label className="mb-2 block text-sm font-semibold">Password</label><input name="password" type="password" value={form.password} onChange={e => setForm(v => ({ ...v, password: e.target.value }))} autoComplete={isRegister ? "new-password" : "current-password"} className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 ${darkMode ? "border-slate-700 bg-slate-950 text-white" : "border-slate-300 bg-slate-50"}`} placeholder="••••••••" /></div><button disabled={loading} className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white ${loading ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-500"}`}>{loading && <Loader2 size={18} className="animate-spin" />}{loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}</button></form>
                <p className={`mt-6 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{isRegister ? "Already have an account?" : "Don't have an account?"} <button onClick={() => { setIsRegister(v => !v); setError("") }} className="font-semibold text-indigo-500 hover:text-indigo-400">{isRegister ? "Sign in" : "Create one"}</button></p>
            </div>
        </div>
    </div>;
}
export default Auth;
