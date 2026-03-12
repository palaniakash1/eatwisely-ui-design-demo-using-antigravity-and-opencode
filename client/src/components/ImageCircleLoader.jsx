export default function ImageCircleLoader({ progress }) {
  const scale = 0.6 + (progress / 100) * 0.5;

  return (
    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#8fa31e] via-[#9bb82e] to-[#6d7f1a] shadow-lg`}
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
      <div className="relative z-10 text-white font-bold text-lg drop-shadow-md">
        {progress}%
      </div>
    </div>
  );
}
