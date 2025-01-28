import { useQuery } from "@tanstack/react-query";
import * as QRCode from "qrcode";

export function useQrCode(textToEncode?: string, disabled?: boolean) {
  return useQuery({
    queryKey: ["qrcode", textToEncode],
    enabled: !!textToEncode || !disabled,
    queryFn: async () => {
      if (!textToEncode) {
        return { data: "" };
      }

      try {
        const qrDataUrl = await QRCode.toDataURL(textToEncode);
        return qrDataUrl;
      } catch (err) {
        console.error(err);
      }

      return { data: "" };
    },
  }) as { data: string };
}
