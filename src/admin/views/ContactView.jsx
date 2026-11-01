import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminBadge from '../components/AdminBadge';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import AdminTextarea from '../components/AdminTextarea';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { 
  Inbox, 
  Download, 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Edit3,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function ContactView() {
  const toast = useToast();
  
  // Tabs: 'inbox' (Leads) | 'details' (Clinic Info)
  const [activeSubTab, setActiveSubTab] = useState('inbox');

  // Leads State
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Lead for Note / Status Edit
  const [activeLead, setActiveLead] = useState(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [leadStatus, setLeadStatus] = useState('new');
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, lead: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Clinic Details State
  const [clinicDetails, setClinicDetails] = useState({
    clinicName: 'Looks Forever Hair Aesthetic Clinic',
    address: 'Shop No. 248, 2nd Floor, Wave Mall, Sector 18, Noida, Uttar Pradesh 201301',
    phone: '+91 98734 33300',
    email: 'info@looksforever.org',
    timing: 'Monday - Sunday: 10:30 AM to 8:30 PM',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Wave+Mall+Sector+18+Noida&t=&z=15&ie=UTF8&iwloc=&output=embed'
  });
  const [isSavingClinic, setIsSavingClinic] = useState(false);

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/contact?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch {
      toast.error('Failed to load patient inquiries.');
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const loadClinicSettings = async () => {
    try {
      const res = await fetch('/api/settings?type=contact');
      if (res.ok) {
        const data = await res.json();
        if (data.details) setClinicDetails(data.details);
      }
    } catch {}
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadClinicSettings();
  }, []);

  const handleOpenLeadModal = (lead) => {
    setActiveLead(lead);
    setLeadNotes(lead.notes || '');
    setLeadStatus(lead.status || 'new');
  };

  const handleUpdateLead = async () => {
    if (!activeLead) return;
    setIsUpdatingLead(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeLead._id,
          status: leadStatus,
          notes: leadNotes
        })
      });

      if (res.ok) {
        toast.success('Inquiry updated successfully.');
        setActiveLead(null);
        loadLeads();
      } else {
        toast.error('Failed to update inquiry.');
      }
    } catch {
      toast.error('Network error updating inquiry.');
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const executeDeleteLead = async () => {
    if (!deleteConfirm.lead) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/contact?id=${deleteConfirm.lead._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Inquiry deleted.');
        loadLeads();
      } else {
        toast.error('Failed to delete inquiry.');
      }
    } catch {
      toast.error('Network error during deletion.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, lead: null });
    }
  };

  const handleSaveClinicDetails = async (e) => {
    e.preventDefault();
    setIsSavingClinic(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          details: clinicDetails
        })
      });
      if (res.ok) {
        toast.success('Clinic contact information saved!');
      } else {
        toast.error('Failed to save clinic details.');
      }
    } catch {
      toast.error('Network error saving clinic details.');
    } finally {
      setIsSavingClinic(false);
    }
  };

  const handleExportCSV = () => {
    window.location.href = '/api/contact?export=csv';
    toast.info('Exporting patient inquiries to CSV...');
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Patient Leads CRM & Contact Info"
        description="Review inbound consultation leads, update patient treatment notes, and manage clinic location details."
        action={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="md"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </AdminButton>
            <AdminButton
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={loadLeads}
              disabled={isLoadingLeads}
            >
              Refresh
            </AdminButton>
          </div>
        }
      />

      {/* Sub Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('inbox')}
          className={`pb-3 px-1 border-b-2 transition ${
            activeSubTab === 'inbox'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inquiries Inbox ({submissions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('details')}
          className={`pb-3 px-1 border-b-2 transition ${
            activeSubTab === 'details'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Clinic Address & Map Settings
        </button>
      </div>

      {activeSubTab === 'inbox' ? (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient name, phone, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 pl-3 pr-8 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New Inquiries</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Consultation Scheduled</option>
                <option value="converted">Procedure Converted</option>
                <option value="closed">Closed / Archived</option>
              </select>
            </div>
          </div>

          {/* Submissions List */}
          <AdminCard noPadding>
            {isLoadingLeads ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
                <p className="text-xs">Loading patient leads...</p>
              </div>
            ) : submissions.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {submissions.map((lead) => (
                  <div
                    key={lead._id}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                        <AdminBadge
                          variant={
                            lead.status === 'new' ? 'warning' :
                            lead.status === 'scheduled' ? 'purple' :
                            lead.status === 'converted' ? 'success' :
                            lead.status === 'contacted' ? 'info' : 'default'
                          }
                          size="xs"
                        >
                          {lead.status}
                        </AdminBadge>
                        <span className="text-[11px] text-slate-400">
                          {new Date(lead.createdAt || Date.now()).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.phone}</span>
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.email}</span>
                          </span>
                        )}
                        {lead.service && (
                          <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-medium text-[11px]">
                            {lead.service}
                          </span>
                        )}
                      </div>

                      {lead.message && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-2xl">
                          "{lead.message}"
                        </p>
                      )}

                      {lead.notes && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded border border-amber-200/60 max-w-2xl">
                          <strong>Internal Note:</strong> {lead.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* WhatsApp Direct */}
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20Looks%20Forever%20Hair%20Aesthetic%20Clinic%20Noida%20regarding%20your%20consultation%20inquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      <AdminButton
                        size="sm"
                        variant="outline"
                        icon={Edit3}
                        onClick={() => handleOpenLeadModal(lead)}
                      >
                        Status & Notes
                      </AdminButton>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ isOpen: true, lead })}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-2">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">No patient inquiries match your filter.</p>
              </div>
            )}
          </AdminCard>

        </div>
      ) : (
        /* Clinic Details & Map Settings */
        <form onSubmit={handleSaveClinicDetails}>
          <AdminCard title="Looks Forever Clinic Coordinates" description="Public clinic contact information and Google Maps directions">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <AdminInput
                  label="Official Clinic Name"
                  value={clinicDetails.clinicName}
                  onChange={(e) => setClinicDetails(p => ({ ...p, clinicName: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2">
                <AdminInput
                  label="Physical Address"
                  value={clinicDetails.address}
                  onChange={(e) => setClinicDetails(p => ({ ...p, address: e.target.value }))}
                />
              </div>

              <div>
                <AdminInput
                  label="Phone Number"
                  value={clinicDetails.phone}
                  onChange={(e) => setClinicDetails(p => ({ ...p, phone: e.target.value }))}
                />
              </div>

              <div>
                <AdminInput
                  label="Contact Email"
                  value={clinicDetails.email}
                  onChange={(e) => setClinicDetails(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2">
                <AdminInput
                  label="Clinic Timings"
                  value={clinicDetails.timing}
                  onChange={(e) => setClinicDetails(p => ({ ...p, timing: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2">
                <AdminInput
                  label="Google Map Embed URL (iframe src)"
                  value={clinicDetails.mapEmbedUrl}
                  onChange={(e) => setClinicDetails(p => ({ ...p, mapEmbedUrl: e.target.value }))}
                  helperText="Paste the iframe src URL from Google Maps"
                />
              </div>

              <div className="sm:col-span-2 pt-4">
                <AdminButton
                  type="submit"
                  variant="primary"
                  isLoading={isSavingClinic}
                >
                  Save Clinic Coordinates
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        </form>
      )}

      {/* Edit Status & Notes Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Manage Patient Inquiry</h3>
              <p className="text-xs text-slate-500 mt-0.5">{activeLead.name} ({activeLead.phone})</p>
            </div>

            <div className="p-5 space-y-4">
              <AdminSelect
                label="CRM Pipeline Status"
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                options={[
                  { value: 'new', label: 'New Inquiry (Needs Call)' },
                  { value: 'contacted', label: 'Contacted (Follow Up)' },
                  { value: 'scheduled', label: 'Consultation Scheduled' },
                  { value: 'converted', label: 'Converted / Fitting Complete' },
                  { value: 'closed', label: 'Closed / Archived' }
                ]}
              />

              <AdminTextarea
                label="Internal Doctor / Counselor Notes"
                rows={4}
                value={leadNotes}
                onChange={(e) => setLeadNotes(e.target.value)}
                placeholder="Patient prefers Mirage Swiss Lace patch, scheduled visit on Saturday 3 PM..."
              />
            </div>

            <div className="bg-slate-50 px-5 py-3.5 flex items-center justify-end gap-3 border-t border-slate-100">
              <AdminButton
                type="button"
                variant="outline"
                onClick={() => setActiveLead(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="button"
                variant="primary"
                isLoading={isUpdatingLead}
                onClick={handleUpdateLead}
              >
                Save Notes
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Patient Inquiry"
        message={`Are you sure you want to delete inquiry for "${deleteConfirm.lead?.name}"?`}
        confirmText="Delete Inquiry"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={executeDeleteLead}
        onCancel={() => setDeleteConfirm({ isOpen: false, lead: null })}
      />
    </div>
  );
}

