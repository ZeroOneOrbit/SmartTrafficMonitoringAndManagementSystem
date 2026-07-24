import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import {
  BadgePlus,
  Edit3,
  Loader2,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const EMPTY_OFFICER = {
  name: "",
  email: "",
  role: "Traffic Officer",
  phone: "",
  specialId: "",
  zone: "",
};

const getStoredOfficer = () => {
  try {
    return JSON.parse(sessionStorage.getItem("officer") || "null");
  } catch {
    return null;
  }
};

const UserControll = () => {
  const navigate = useNavigate();
  const [currentOfficer] = useState(getStoredOfficer);
  const [officers, setOfficers] = useState([]);
  const [form, setForm] = useState(EMPTY_OFFICER);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [emergencyMode, setEmergencyMode] = useState(false);

  const isAdmin = currentOfficer?.role?.toLowerCase() === "admin";
  const api = import.meta.env.VITE_SERVER_API;
  const authHeaders = { role: "admin" };

  const loadOfficers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${api}/officer/admin`, {
        headers: authHeaders,
      });
      setOfficers(response.data?.officers || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load officers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadOfficers();
  }, [isAdmin]);

  const visibleOfficers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return officers;
    return officers.filter((officer) =>
      [officer.name, officer.email, officer.role, officer.phone, officer.specialId, officer.zone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [officers, searchTerm]);

  const openCreateForm = () => {
    setEditingOfficer(null);
    setForm(EMPTY_OFFICER);
    setIsFormOpen(true);
  };

  const openEditForm = (officer) => {
    setEditingOfficer(officer);
    setForm({
      name: officer.name || "",
      email: officer.email || "",
      role: officer.role || "Traffic Officer",
      phone: officer.phone || "",
      specialId: String(officer.specialId ?? ""),
      zone: officer.zone || officer.thanaId || "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;
    setIsFormOpen(false);
    setEditingOfficer(null);
    setForm(EMPTY_OFFICER);
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSpecialIdChange = (event) => {
    const specialId = event.target.value.replace(/\D/g, "").slice(0, 6);
    setForm((previous) => ({ ...previous, specialId }));
  };

  const generateSpecialId = () => {
    const usedIds = new Set(officers.map((officer) => String(officer.specialId)));
    let specialId;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      specialId = String(Math.floor(100000 + Math.random() * 900000));
      if (!usedIds.has(specialId)) break;
    }

    setForm((previous) => ({ ...previous, specialId }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!api) {
      toast.error("Server API URL is not configured.");
      return;
    }

    const specialId = Number(form.specialId);
    if (!/^\d{6}$/.test(form.specialId) || specialId < 100000 || specialId > 999999) {
      toast.error("Special ID must contain exactly 6 digits.");
      return;
    }

    try {
      setIsSaving(true);
      if (editingOfficer) {
        await axios.put(
          `${api}/officer/${encodeURIComponent(editingOfficer.email)}`,
          { role: form.role, zone: form.zone.trim(), specialId },
          { headers: authHeaders }
        );
        toast.success("Officer access updated.");
      } else {
        await axios.post(
          `${api}/officer`,
          {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            role: form.role,
            phone: form.phone.trim(),
            specialId,
            zone: form.zone.trim(),
          },
          { headers: authHeaders }
        );
        toast.success("Officer created successfully.");
      }
      setIsFormOpen(false);
      setEditingOfficer(null);
      setForm(EMPTY_OFFICER);
      await loadOfficers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save officer.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (officer) => {
    if (!window.confirm(`Delete ${officer.name}? This cannot be undone.`)) return;
    try {
      setDeletingEmail(officer.email);
      await axios.delete(`${api}/officer/${encodeURIComponent(officer.email)}`, {
        headers: authHeaders,
      });
      setOfficers((previous) => previous.filter((item) => item.email !== officer.email));
      toast.success("Officer deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete officer.");
    } finally {
      setDeletingEmail("");
    }
  };

  if (!isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 lg:block">
        <Sidebar {...{ activeTab, setActiveTab, emergencyMode, setEmergencyMode }} />
      </aside>
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 p-3 transition-transform lg:hidden ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setMobileSidebarOpen(false); }} emergencyMode={emergencyMode} setEmergencyMode={setEmergencyMode} />
      </aside>
      {mobileSidebarOpen && <button aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />}

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <button onClick={() => setMobileSidebarOpen(true)} className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 lg:hidden"><Menu size={20} /></button>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-400"><Users size={20} /></div>
              <div><h1 className="font-bold text-white">Officer Management</h1><p className="text-xs text-slate-500">Create, update and revoke officer access</p></div>
            </div>
            <div className="hidden items-center gap-2 text-xs font-semibold text-emerald-400 sm:flex"><ShieldCheck size={16} /> Admin access</div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-sm text-slate-400">Manage the traffic officers assigned to every zone.</p>
              <p className="mt-2 text-3xl font-black text-white">{officers.length} <span className="text-base font-medium text-slate-500">officers</span></p>
            </div>
            <button onClick={openCreateForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"><BadgePlus size={18} /> Add officer</button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30">
            <div className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search officers..." className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-500/60" /></div>
              <button onClick={loadOfficers} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 disabled:opacity-50"><RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Officer</th><th className="px-5 py-4">Contact</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Zone</th><th className="px-5 py-4">Special ID</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-800">{isLoading ? <tr><td colSpan="6" className="px-5 py-14 text-center text-slate-500"><Loader2 className="mx-auto mb-2 animate-spin text-cyan-400" /> Loading officers...</td></tr> : visibleOfficers.length === 0 ? <tr><td colSpan="6" className="px-5 py-14 text-center text-slate-500">No officers found.</td></tr> : visibleOfficers.map((officer) => <tr key={officer._id || officer.email} className="hover:bg-slate-800/30"><td className="px-5 py-4 font-semibold text-white">{officer.name}</td><td className="px-5 py-4"><p className="text-slate-300">{officer.email}</p><p className="mt-1 text-xs text-slate-500">{officer.phone}</p></td><td className="px-5 py-4"><span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">{officer.role}</span></td><td className="px-5 py-4 text-slate-300">{officer.zone || officer.thanaId || "—"}</td><td className="px-5 py-4 font-mono text-slate-300">{officer.specialId}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button aria-label={`Edit ${officer.name}`} onClick={() => openEditForm(officer)} className="rounded-lg p-2 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-300"><Edit3 size={17} /></button><button aria-label={`Delete ${officer.name}`} onClick={() => handleDelete(officer)} disabled={deletingEmail === officer.email} className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50">{deletingEmail === officer.email ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}</button></div></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {isFormOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm"><form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-lg font-bold">{editingOfficer ? "Update officer access" : "Create traffic officer"}</h2><p className="mt-1 text-sm text-slate-500">{editingOfficer ? "Only role, zone and special ID can be changed." : "Enter the officer’s registration details."}</p></div><button type="button" onClick={closeForm} aria-label="Close form" className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"><X /></button></div><div className="grid gap-4 sm:grid-cols-2">
        {[["name", "Full name", "text"], ["email", "Email address", "email"], ["phone", "Phone number", "tel"]].map(([name, label, type]) => <label key={name} className={`text-sm font-medium text-slate-300 ${editingOfficer ? "opacity-50" : ""}`}>{label}<input required={!editingOfficer} disabled={Boolean(editingOfficer)} name={name} type={type} value={form[name]} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 disabled:cursor-not-allowed" /></label>)}
        <label className="text-sm font-medium text-slate-300">Role<select required name="role" value={form.role} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"><option>Traffic Officer</option><option>Officer In Charge</option><option>Admin</option></select></label>
        <label className="text-sm font-medium text-slate-300">Zone<input required name="zone" placeholder="THANA_02" value={form.zone} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
        <label className="text-sm font-medium text-slate-300">Special ID<div className="mt-1.5 flex gap-2"><input required name="specialId" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" placeholder="6-digit ID" value={form.specialId} onChange={handleSpecialIdChange} className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-500" /><button type="button" onClick={generateSpecialId} className="shrink-0 rounded-xl border border-cyan-500/30 px-3 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10">Generate</button></div><span className="mt-1 block text-xs font-normal text-slate-500">Exactly 6 digits</span></label>
      </div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={closeForm} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800">Cancel</button><button disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-60">{isSaving && <Loader2 size={16} className="animate-spin" />}{editingOfficer ? "Save changes" : "Create officer"}</button></div></form></div>}
    </div>
  );
};

export default UserControll;
