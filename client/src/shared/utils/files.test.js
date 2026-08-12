import { describe, expect, it } from "vitest";
import { readImagesAsDataUrls } from "@/shared/utils/files";

describe("readImagesAsDataUrls", () => {
  it("reads supported images larger than the previous 1 MB limit", async () => {
    const image = new File([new Uint8Array(2 * 1024 * 1024)], "product.png", {
      type: "image/png",
    });

    const [dataUrl] = await readImagesAsDataUrls([image]);

    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it("reports invalid images instead of silently discarding them", async () => {
    const invalidImage = new File(["not an image"], "product.txt", {
      type: "text/plain",
    });

    await expect(readImagesAsDataUrls([invalidImage])).rejects.toThrow(
      "Images must be JPEG, PNG, WebP, or AVIF files",
    );
  });
});
