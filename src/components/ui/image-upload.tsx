// src/components/ui/image-upload.tsx
"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "../../../lib/utils"
import { UploadButton } from "@/lib/uploadthing";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  disabled
}: ImageUploadProps) => {
  if (value) {
    return (
      <div className="relative w-32 h-32">
        <div className="absolute top-0 right-0 z-10">
          <Button
            type="button"
            onClick={() => onChange("")} 
            variant="destructive"
            size="icon"
            className="h-6 w-6 rounded-full"
            disabled={disabled} 
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
            <Image
              fill
              className="object-cover"
              alt="Avatar"
              src={value}
            />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
                onChange(res[0].url);
                console.log("Upload completo: ", res[0].url);
            }}
            onUploadError={(error: Error) => {
                console.error(error);
                alert(`Erro no upload: ${error.message}`);
            }}
            appearance={{
                button: "bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition",
                allowedContent: "hidden" 
            }}
            content={{
                button: "Carregar Foto"
            }}
        />
    </div>
  );
}