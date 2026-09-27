import { NoticeAttachment } from '../types';

/**
 * Simulates document text extraction / OCR from uploaded files
 */
export function extractTextFromFile(file: File): Promise<{
  attachment: NoticeAttachment;
  extractedContent: string;
  extractedTitle?: string;
}> {
  return new Promise((resolve) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    let fileType: NoticeAttachment['type'] = 'file';
    if (extension === 'pdf') fileType = 'pdf';
    else if (['docx', 'doc'].includes(extension)) fileType = 'docx';
    else if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) fileType = 'image';

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${fileSizeMb} MB`;

    // Simulated OCR extraction based on file name or type
    setTimeout(() => {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      const extractedTitle = cleanName
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const simulatedExtractedText = `[EXTRACTED DOCUMENT TEXT - Source: ${file.name}]\n\n` +
        `OFFICIAL CIRCULAR / CAMPUS NOTICE\n` +
        `Document Title: ${extractedTitle}\n` +
        `Issued by: University Administration Office\n` +
        `Date of Filing: ${new Date().toLocaleDateString()}\n\n` +
        `All concerned students, faculty, and campus staff are advised to take note of the following instructions regarding ${cleanName}.\n\n` +
        `Key Guidelines:\n` +
        `1. Compliance is mandatory for all registered students across all academic branches.\n` +
        `2. Deadlines and submissions must be completed through the designated student portal.\n` +
        `3. For clarifications, reach out to the respective department head or student affairs committee.`;

      const attachment: NoticeAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: sizeStr,
        type: fileType,
        url: URL.createObjectURL(file),
        extractedText: simulatedExtractedText,
      };

      resolve({
        attachment,
        extractedContent: simulatedExtractedText,
        extractedTitle,
      });
    }, 600);
  });
}
