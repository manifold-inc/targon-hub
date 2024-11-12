import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const WatchForSuccess = () => {
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (params.get("success")) {
      router.push(params.get("redirect") ?? "/models");
      setTimeout(() => toast.success("Successfully purchased more credits"));  
    }
    if (params.get("canceled")) {
      router.push(params.get("redirect") ?? "/models");
      setTimeout(() => toast.info("Canceled transaction"));
    }
  }, [params, router]);
  return null;
};
