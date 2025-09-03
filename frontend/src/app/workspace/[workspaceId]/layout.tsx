import NavItem from "@/components/NavItem";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";

const sideBars = ["Documents", "Tasks", "Members", "Settings"];

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Readonly<Promise<{ workspaceId: string }>>;
}) {
  const { workspaceId } = await params;

  return (
    <div className="min-h-screen flex">
      {/* Mobile menu */}
      <div className="lg:hidden p-3">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="p-3 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                focusable="false"
              >
                <g
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </g>
              </svg>
            </button>
          </SheetTrigger>

          <SheetContent
            className="p-5 border-r border-white/6 bg-gradient-to-b from-slate-950 via-black to-slate-900 text-slate-100"
            side="left"
          >
            <aside>
              <SheetTitle className="flex items-center gap-3 text-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 grid place-items-center font-bold"></div>
                <div>
                  <div className="font-semibold">Test Team</div>
                  <div className="text-xs text-slate-400">Workspace</div>
                </div>
              </SheetTitle>

              <nav className="mt-8 space-y-2">
                {Array(4)
                  .fill(null)
                  .map((el, i) => (
                    <NavItem
                      key={sideBars[i]}
                      label={sideBars[i]}
                      workspaceId={workspaceId}
                    />
                  ))}
              </nav>
              <div className="mt-8">
                <div className="text-xs text-slate-400">Members online</div>
                <div className="mt-3 flex -space-x-3">
                  <Avatar />
                  <Avatar />

                  <Avatar />
                  <div className="w-8 h-8 rounded-full grid place-items-center bg-white/6 text-xs">
                    +3
                  </div>
                </div>
              </div>
            </aside>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop menu */}

      <aside className="hidden lg:block w-1/6 border-r p-5 border-white/6 bg-gradient-to-b from-black/60 to-transparent justify-center">
        <div className="fixed top-5 left-5 w-[calc(100vw/6-2.5rem)] max-w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 grid place-items-center font-bold"></div>
            <div>
              <div className="font-semibold">Test Team</div>
              <div className="text-xs text-slate-400">Workspace</div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {Array(4)
              .fill(null)
              .map((el, i) => (
                <NavItem
                  key={sideBars[i]}
                  label={sideBars[i]}
                  workspaceId={workspaceId}
                />
              ))}
          </nav>
          <div className="mt-8">
            <div className="text-xs text-slate-400">Members online</div>
            <div className="mt-3 flex -space-x-3">
              <Avatar />
              <Avatar />

              <Avatar />
              <div className="w-8 h-8 rounded-full grid place-items-center bg-white/6 text-xs">
                +3
              </div>
            </div>
          </div>
        </div>
      </aside>

      {children}
    </div>
  );
}
