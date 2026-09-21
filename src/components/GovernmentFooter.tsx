import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { AshokaEmblem } from './Emblems';

export const GovernmentFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#123A78] text-white border-t-4 border-[#C67A00] text-left">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Portal Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <AshokaEmblem size={44} className="text-white" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Government of India
                </div>
                <div className="text-base font-bold text-white">
                  Bhulekh AI v3
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Unified National Land Records Intelligence &amp; Cadastral Governance Platform under the Digital India Land Records Modernization Programme (DILRMP).
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>STQC Certified &amp; MeitY Compliant</span>
            </div>
          </div>

          {/* Col 2: Related Government Portals */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-white/20 pb-1.5">
              Related National Portals
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-100">
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3 text-blue-300" />
                </a>
              </li>
              <li>
                <a href="https://rural.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Ministry of Rural Development</span>
                  <ExternalLink className="w-3 h-3 text-blue-300" />
                </a>
              </li>
              <li>
                <a href="https://dolr.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Department of Land Resources</span>
                  <ExternalLink className="w-3 h-3 text-blue-300" />
                </a>
              </li>
              <li>
                <a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Digital India Programme</span>
                  <ExternalLink className="w-3 h-3 text-blue-300" />
                </a>
              </li>
              <li>
                <a href="https://nic.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>National Informatics Centre (NIC)</span>
                  <ExternalLink className="w-3 h-3 text-blue-300" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Policies */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-white/20 pb-1.5">
              Statutory Guidelines &amp; RTI
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-100">
              <li>
                <a href="#rti" className="hover:text-white hover:underline">
                  Right to Information (RTI) Act
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white hover:underline">
                  Terms of Use &amp; Public Trust Conditions
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white hover:underline">
                  Privacy Policy &amp; Data Protection
                </a>
              </li>
              <li>
                <a href="#hyperlink" className="hover:text-white hover:underline">
                  Hyperlinking Policy
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-white hover:underline">
                  Accessibility Statement (GIGW 3.0)
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-white hover:underline">
                  Statutory Disclaimer &amp; Cadastral Notice
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Helpdesk & Cadre Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-white/20 pb-1.5">
              NIC National Helpdesk
            </h4>
            <div className="text-xs text-blue-100 space-y-1.5">
              <div>
                <strong>Toll-Free Kisan &amp; Landowner Helpline:</strong>
                <div className="font-mono text-white text-sm font-bold mt-0.5">
                  1800-180-1551
                </div>
              </div>
              <div>
                <strong>Official NIC Helpdesk:</strong>
                <div className="font-mono text-blue-200">
                  bhulekh-support@nic.in
                </div>
              </div>
              <div className="text-[11px] text-blue-200 pt-1">
                Operating Hours: 09:30 AM to 06:00 PM (Monday to Saturday, excluding Gazetted Holidays)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Copyright & Hosting Banner */}
      <div className="bg-[#0B2550] py-4 px-4 sm:px-8 border-t border-white/10 text-xs text-blue-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            Website Content Owned and Maintained by Department of Land Resources, Ministry of Rural Development, Government of India.
            <br />
            Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong>.
          </div>

          <div className="text-[11px] text-blue-300 font-mono">
            Platform Version: v3.0.0 &bull; Last Updated: 21-SEP-2026
          </div>
        </div>
      </div>
    </footer>
  );
};
