import React from "react";

export default function HomePage() {
  return (
    <main>
      <section className="bg-sky-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 items-center px-4 py-16">
          <div>
            <p className="text-sky-600 font-semibold mb-4">Health Care</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
              Health Care For Whole Family
            </h1>
            <p className="text-slate-600 mb-6">
              In healthcare sector, service excellence is the facility of the
              hospital as healthcare service provider to consistently.
            </p>
            <button className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-lg">
              Check Our Services
            </button>
          </div>
          <div className="h-72 bg-[url('/react.svg')] bg-cover bg-center rounded-lg"></div>
        </div>
      </section>

      <section className="bg-sky-100">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Hospitality</h3>
            <p className="text-slate-600">
              Clinical excellence must be the priority for any health care service
              provider.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Emergency Care</h3>
            <p className="text-slate-600">
              Clinical excellence must be the priority for any health care service
              provider.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Chamber Service</h3>
            <p className="text-slate-600">
              Clinical excellence must be the priority for any health care service
              provider.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

