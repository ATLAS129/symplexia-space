import DocumentsCards from "@/components/DocumentsCards";
import NavItem from "@/components/NavItem";
import TaskCard from "@/components/TaskCard";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export default function WorkspacePage() {
  return (
    <>
      <section className="flex-1 p-7">
        <div className="pb-3">
          <h3 className="text-xl font-semibold">Documents</h3>
          <div className="text-slate-400 text-sm"></div>
        </div>
        <DocumentsCards />
      </section>
    </>
  );
}
