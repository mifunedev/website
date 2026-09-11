import { MdPlayCircle } from "react-icons/md";

interface VideoPlaceholderProps {
  title?: string;
  className?: string;
}

export default function VideoPlaceholder({
  title = "Product Demo",
  className = ""
}: VideoPlaceholderProps) {
  return (
    <div
      className={`aspect-video bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center ${className}`}
    >
      <div className="text-center p-8">
        <MdPlayCircle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <p className="text-gray-400 font-montserrat font-medium">{title}</p>
        <p className="text-sm text-gray-500 font-montserrat mt-2">Coming Soon</p>
      </div>
    </div>
  );
}
