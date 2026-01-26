// Composable for export functionality (TXT, PDF, Print)
// modify by jx: implement export functions for questions to TXT, PDF and print

import { ref } from 'vue';
import type { Question } from '@/types';
import jsPDF from 'jspdf';

/**
 * Format a question for export
 * @param question Question object
 * @param includeAnswers Whether to include the answer
 * @returns Formatted string
 */
function formatQuestionForExport(question: Question, includeAnswers: boolean): string {
  if (includeAnswers) {
    return `${question.expression} = ${question.answer}`;
  }
  return `${question.expression} = ?`;
}

/**
 * Generate filename with timestamp
 * @param extension File extension
 * @returns Formatted filename
 */
function generateFilename(extension: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `四则运算题_${year}${month}${day}_${hours}${minutes}${seconds}.${extension}`;
}

/**
 * Export questions to TXT file
 * @param questions Array of questions
 * @param includeAnswers Whether to include answers
 */
export function useExport() {
  const isExporting = ref(false);

  /**
   * Export questions to TXT file
   * @param questions Array of questions to export
   * @param includeAnswers Whether to include answers
   */
  const exportToTxt = (questions: Question[], includeAnswers: boolean) => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      
      // Header
      lines.push('========================================');
      lines.push('       小学数学四则运算题目');
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = questions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];
        
        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = questions[index];
            const questionNum = index + 1;
            const formatted = formatQuestionForExport(question, includeAnswers);
            rowQuestions.push(`${questionNum}. ${formatted}`);
          }
        }

        lines.push(rowQuestions.join('    '));
      }

      // Footer
      lines.push('');
      lines.push('========================================');
      lines.push(`   共 ${totalQuestions} 题`);
      lines.push('========================================');

      // Create blob and download
      const content = lines.join('\n');
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateFilename('txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出TXT失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export questions to PDF file
   * @param questions Array of questions to export
   * @param includeAnswers Whether to include answers
   */
  const exportToPdf = (questions: Question[], includeAnswers: boolean) => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('小学数学四则运算题目', pageWidth / 2, 20, { align: 'center' });

      // Line
      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      // Format questions in 4 columns
      const totalQuestions = questions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        void row; // Suppress unused variable warning
        // Check if we need a new page
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = questions[index];
            const questionNum = index + 1;
            const formatted = formatQuestionForExport(question, includeAnswers);
            const x = margin + (col * columnWidth);
            doc.text(`${questionNum}. ${formatted}`, x, y);
          }
        }

        y += 8;
      }

      // Save PDF
      doc.save(generateFilename('pdf'));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Print questions
   * @param questions Array of questions to print
   * @param includeAnswers Whether to include answers
   */
  const printQuestions = (questions: Question[], includeAnswers: boolean) => {
    isExporting.value = true;

    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const totalQuestions = questions.length;
      void 4; // Number of columns

      // Build HTML content
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>小学数学四则运算题目</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
            }
            .title {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .question-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            .question {
              font-size: 14px;
            }
            .question-number {
              font-weight: bold;
              margin-right: 5px;
            }
            @media print {
              body {
                margin: 0;
                padding: 10px;
              }
              .question-grid {
                gap: 10px;
              }
            }
            @media (max-width: 768px) {
              .question-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (max-width: 480px) {
              .question-grid {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="title">小学数学四则运算题目</div>
          <div class="question-grid">
      `;

      // Add questions to grid
      for (let i = 0; i < totalQuestions; i++) {
        const question = questions[i];
        const formatted = formatQuestionForExport(question, includeAnswers);
        html += `
          <div class="question">
            <span class="question-number">${i + 1}.</span>${formatted}
          </div>
        `;
      }

      html += `
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
    } catch (error) {
      console.error('打印失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  return {
    isExporting,
    exportToTxt,
    exportToPdf,
    printQuestions
  };
}
