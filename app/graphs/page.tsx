'use client';

import GistPilotGraphs from '../../components/graphs/GistPilotGraphs'; // adjust path if you don't use "@/"

export default function GraphsPage() {
  return (
    <div className="fixed inset-0 bg-background text-foreground">
      <div className="h-full overflow-auto p-4 sm:p-6">
        <GistPilotGraphs />
      </div>
    </div>
  );
}
