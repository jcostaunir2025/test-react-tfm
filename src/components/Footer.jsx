export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-slate-600">
        <div>© 2025 - Versión 1.0.0</div>
        <div className="flex items-center gap-4">
          <a href="mailto:info@docmed.com" className="hover:underline">info@docmed.com</a>
          <a href="#" className="hover:underline">Contacto</a>
        </div>
      </div>
    </footer>
  );
}