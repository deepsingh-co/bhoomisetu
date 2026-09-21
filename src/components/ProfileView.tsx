import React from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Building,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileBadge,
  Award,
  Lock,
} from 'lucide-react';
import { User } from '../types';

interface ProfileViewProps {
  currentUser: User;
  onBackToDashboard: () => void;
  onNavigateToSecurity: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onBackToDashboard,
  onNavigateToSecurity,
}) => {
  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-5 border border-[#D8DEE8] rounded-xl shadow-2xs">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#123A78]" />
            <h2 className="text-xl font-bold text-[#1C2733]">
              Official Personnel Identity Profile
            </h2>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-1.5 bg-[#F5F7FA] hover:bg-gray-100 border border-[#D8DEE8] text-[#123A78] text-xs font-semibold rounded"
          >
            &larr; Back to Console
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-[#D8DEE8] pb-6">
            <div className="w-20 h-20 bg-[#123A78] text-white rounded-xl flex items-center justify-center text-3xl font-extrabold shadow-sm">
              {currentUser.fullName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-bold text-[#1C2733]">
                  {currentUser.fullName}
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-[#1F7A3E] text-xs font-bold rounded">
                  GAZETTED OFFICER
                </span>
              </div>
              <p className="text-xs text-[#5A6878] font-medium">
                {currentUser.designation || 'Government Cadre Officer'} &bull; {currentUser.department}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#123A78] pt-1">
                <FileBadge className="w-4 h-4" />
                <span>NIC Employee ID: <strong>{currentUser.employeeId || 'N/A (Citizen)'}</strong></span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg space-y-1">
              <div className="text-[#5A6878] flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-[#123A78]" />
                <span>Official Government Email:</span>
              </div>
              <div className="font-mono font-bold text-[#1C2733] text-sm">
                {currentUser.email}
              </div>
            </div>

            <div className="p-3.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg space-y-1">
              <div className="text-[#5A6878] flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#123A78]" />
                <span>NIC Registered Contact:</span>
              </div>
              <div className="font-mono font-bold text-[#1C2733] text-sm">
                +91 {currentUser.phoneNumber || currentUser.phone || '9876543210'}
              </div>
            </div>

            <div className="p-3.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg space-y-1">
              <div className="text-[#5A6878] flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#123A78]" />
                <span>Cadre Jurisdiction:</span>
              </div>
              <div className="font-bold text-[#1C2733] text-sm">
                {currentUser.district || 'Pune'} District, {currentUser.state || 'Maharashtra'}
              </div>
            </div>

            <div className="p-3.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg space-y-1">
              <div className="text-[#5A6878] flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A3E]" />
                <span>Security Clearance Level:</span>
              </div>
              <div className="font-bold text-[#1F7A3E] text-sm flex items-center gap-1.5">
                <span>Level-3 (DILRMP Certified)</span>
                <span className="text-[10px] bg-emerald-100 text-[#1F7A3E] px-1.5 py-0.5 rounded">2FA ACTIVE</span>
              </div>
            </div>
          </div>

          {/* PKI & Digital Certificate Status */}
          <div className="border border-[#D8DEE8] rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2733] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#123A78]" />
                <span>Class 3 Digital Signature Certificate (DSC / e-Sign)</span>
              </span>
              <span className="text-[11px] font-bold text-[#1F7A3E] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                VALID UNTIL 31-DEC-2027
              </span>
            </div>
            <p className="text-xs text-[#5A6878] leading-relaxed">
              Issued by National Informatics Centre Certifying Authority (NICCA) for authenticated land mutation orders, 7/12 approvals, and GIS boundary certifications.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3 border-t border-[#D8DEE8]">
            <button
              onClick={onNavigateToSecurity}
              className="px-4 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-semibold rounded flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Manage 2FA &amp; Devices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
