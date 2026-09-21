import { useEffect, useState } from "react";

import { signedUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function SignedImage({
  storageRef,
  alt,
  className,
}: {
  storageRef: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void signedUrl(storageRef).then((value) => {
      if (active) setUrl(value);
    });
    return () => {
      active = false;
    };
  }, [storageRef]);

  if (!url) {
    return <div className={cn("bg-muted", className)} aria-hidden />;
  }
  return <img src={url} alt={alt} className={className} loading="lazy" />;
}
