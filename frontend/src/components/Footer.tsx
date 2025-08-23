"use client";

import Image from "next/image";
// import Logo from "../../public/full-logo.webp";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/6 bg-gradient-to-b from-black/5 to-transparent">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex justify-center items-center gap-3">
            {/* <Image src={Logo} alt="logo" width={200} height={200} /> */}
          </div>
          <p className="mt-4 text-sm text-slate-400 max-w-xs">
            Realtime CRDT docs, integrated task boards, and LLM agents — built
            for teams.
          </p>
        </div>

        <div>
          <div className="font-semibold">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <a className="hover:text-white" href="#">
                Features
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#">
                Pricing
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#">
                Demo
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <a className="hover:text-white" href="#">
                About
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#">
                Careers
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Stay updated</div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              aria-label="Email"
              type="email"
              placeholder="you@company.com"
              className="flex-1 rounded-lg bg-white/6 px-3 py-2 text-sm placeholder:text-slate-400"
            />
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-sm">
              Subscribe
            </button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <a
              aria-label="Twitter"
              href="#"
              className="w-9 h-9 rounded-md bg-white/4 grid place-items-center"
            >
              T
            </a>
            <a
              aria-label="GitHub"
              href="#"
              className="w-9 h-9 rounded-md bg-white/4 grid place-items-center"
            >
              G
            </a>
            <a
              aria-label="Discord"
              href="#"
              className="w-9 h-9 rounded-md bg-white/4 grid place-items-center"
            >
              D
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-slate-400 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Symplexia Space</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
