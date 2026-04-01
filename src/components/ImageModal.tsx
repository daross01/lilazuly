import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageModal = ({ src, alt, onClose }: ImageModalProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = alt.replace(/\s+/g, "-") + ".jpg";
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in-scale p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-background rounded-2xl shadow-soft overflow-hidden max-w-sm w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-card hover:bg-background transition-colors"
          aria-label="Close preview"
        >
          <X size={18} className="text-foreground" />
        </button>

        <div className="overflow-auto flex-1">
          <img src={src} alt={alt} className="w-full object-contain" />
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="hero" className="w-full" onClick={handleDownload}>
            <Download size={16} />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
