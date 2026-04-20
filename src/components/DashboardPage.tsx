import { useState } from "react";

export interface DashboardPageProps {
  onBack: () => void;
}

export function DashboardPage({ onBack }: DashboardPageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-slate-50 dark:bg-[#1a1f2e] overflow-hidden flex flex-col">
      {/* Top Header Bar for Back Navigation */}
      <div className="h-16 w-full flex items-center shrink-0 px-6 bg-white dark:bg-[#151925] border-b border-slate-200 dark:border-white/5 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-full transition-colors duration-300 font-medium cursor-pointer border border-transparent dark:border-white/5"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            arrow_back
          </span>
          Back to Weather
        </button>
      </div>

      <div className="relative flex-1 w-full flex flex-col">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-[#1a1f2e]/90 backdrop-blur-md z-10">
            <span className="material-symbols-outlined animate-spin text-5xl mb-4 text-primary">
              refresh
            </span>
            <p className="text-slate-800 dark:text-white text-xl animate-pulse font-semibold tracking-wide">
              Loading dashboard...
            </p>
          </div>
        )}

        {/* Iframe */}
        <iframe
          title="Power BI Dashboard"
          className="w-full h-full border-none flex-1"
          src="https://app.powerbi.com/reportEmbed?reportId=04a8dee3-21dc-4378-bc7c-28eaebdfb710&autoAuth=true&ctid=d1aad15a-5724-45cd-a320-5e75718fa6bd&actionBarEnabled=false&navContentPaneEnabled=false&filterPaneEnabled=false"
          allowFullScreen
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}
