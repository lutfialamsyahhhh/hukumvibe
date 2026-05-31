import { AnalyzeWorkspace } from "@/components/analyze/analyze-workspace";
import { AppShell } from "@/components/shared/app-shell";

interface AnalyzeDocumentPageProps {
  params: {
    id: string;
  };
}

export default function AnalyzeDocumentPage({ params }: AnalyzeDocumentPageProps) {
  return (
    <AppShell>
      <AnalyzeWorkspace documentId={params.id} />
    </AppShell>
  );
}
