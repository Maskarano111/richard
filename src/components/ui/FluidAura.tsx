export function FluidAura() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-[#050505] overflow-hidden pointer-events-none">
      {/* Dynamic colorful blobs */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen animate-blob-slow"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(59,130,246,0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen animate-blob-slower"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.12) 0%, rgba(236,72,153,0.04) 60%, transparent 80%)",
          filter: "blur(80px)",
        }}
      />
      <div 
        className="absolute top-[30%] right-[10%] w-[45vw] h-[45vw] rounded-full mix-blend-screen animate-blob-slowest"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(99,102,241,0.03) 50%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div 
        className="absolute bottom-[20%] left-[20%] w-[35vw] h-[35vw] rounded-full mix-blend-screen animate-blob-slow"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.08) 0%, rgba(59,130,246,0.03) 60%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />

      {/* Static grid overlay for high-tech premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      {/* Backdrop blur layer to tie it all together */}
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );
}
