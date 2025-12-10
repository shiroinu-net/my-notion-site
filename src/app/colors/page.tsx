export default function ColorTestPage() {
  return (
    <div className="p-8 bg-bg-pale-gray min-h-screen text-main-charcoal">
      <h1 className="text-3xl font-bold mb-8">Color System Verification</h1>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Base Colors</h2>
        <div className="flex gap-4">
          <div className="p-4 bg-main-charcoal text-white rounded shadow">
            Main Charcoal
          </div>
          <div className="p-4 bg-main-white text-main-charcoal border border-gray-200 rounded shadow">
            Main White
          </div>
          <div className="p-4 bg-bg-pale-gray text-main-charcoal border border-gray-200 rounded shadow">
            Bg Pale Gray
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8">Accent Colors</h2>
        <div className="flex flex-wrap gap-4">
          <div className="p-4 bg-accent-deep-green text-white rounded shadow">
            Deep Green
          </div>
          <div className="p-4 bg-accent-moss text-white rounded shadow">
            Moss
          </div>
          <div className="p-4 bg-accent-ice-blue text-main-charcoal rounded shadow">
            Ice Blue
          </div>
          <div className="p-4 bg-accent-pale-aqua text-main-charcoal rounded shadow">
            Pale Aqua
          </div>
          <div className="p-4 bg-accent-lemon-yellow text-main-charcoal rounded shadow">
            Lemon Yellow
          </div>
        </div>
      </div>
    </div>
  );
}
