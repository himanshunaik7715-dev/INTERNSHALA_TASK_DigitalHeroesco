import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { extractTextFromPDF, extractTextFromDocx } from "@/services/resumeParserService";
import { createResume } from "@/services/resumeService";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({ pdf: { maxFileSize: "4MB" }, blob: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const response = await fetch(file.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let text = "";
        if (file.name.endsWith(".pdf")) {
          text = await extractTextFromPDF(buffer);
        } else if (file.name.endsWith(".docx")) {
          text = await extractTextFromDocx(buffer);
        }

        if (text) {
          await createResume(metadata.userId, text, file.url, file.name, file.key);
        } else {
          console.warn("Could not extract text from uploaded file in webhook");
        }
      } catch (error) {
        console.error("Error processing uploaded file in webhook:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;