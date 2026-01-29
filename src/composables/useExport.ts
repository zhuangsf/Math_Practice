// Composable for export functionality (TXT, PDF, Excel, Print)
// modify by jx: implement export functions for all question types to TXT, PDF, Excel and print

import { ref } from 'vue';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import type {
  Question,
  EquationQuestion,
  FractionQuestion,
  DecimalQuestion,
  GeometryQuestion,
  PercentageQuestion,
  UnitConversionQuestion,
  FactorMultipleQuestion,
  ComparisonQuestion,
  PatternQuestion,
  PrimeCompositeQuestion
} from '@/types';

/**
 * Generate filename with timestamp
 * @param extension File extension
 * @param title Title for the file
 * @returns Formatted filename
 */
function generateFilename(extension: string, title: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${title}_${year}${month}${day}_${hours}${minutes}${seconds}.${extension}`;
}

/**
 * Convert various question types to a unified format for export
 */
interface UnifiedQuestion {
  id: string;
  expression: string;
  answer: string | number;
  questionNumber: number;
}

function unifyQuestion(question: EquationQuestion, index: number): UnifiedQuestion {
  return {
    id: question.id,
    expression: question.equation,
    answer: question.answer,
    questionNumber: index + 1
  };
}

function unifyFractionQuestion(question: FractionQuestion, index: number): UnifiedQuestion {
  let answerStr: string;
  const ans = question.answer;
  if (typeof ans === 'object' && ans !== null && 'numerator' in ans && 'denominator' in ans) {
    answerStr = `${ans.numerator}/${ans.denominator}`;
  } else {
    answerStr = String(ans);
  }
  return {
    id: question.id,
    expression: question.expression,
    answer: answerStr,
    questionNumber: index + 1
  };
}

function unifyDecimalQuestion(question: DecimalQuestion, index: number): UnifiedQuestion {
  return {
    id: question.id,
    expression: question.expression,
    answer: question.answer,
    questionNumber: index + 1
  };
}

function unifyGeometryQuestion(question: GeometryQuestion, index: number): UnifiedQuestion {
  return {
    id: question.id,
    expression: question.expression,
    answer: question.answer,
    questionNumber: index + 1
  };
}

function unifyPercentageQuestion(question: PercentageQuestion, index: number): UnifiedQuestion {
  return {
    id: question.id,
    expression: question.expression,
    answer: question.answer,
    questionNumber: index + 1
  };
}

function unifyUnitConversionQuestion(question: UnitConversionQuestion, index: number): UnifiedQuestion {
  return {
    id: question.id,
    expression: question.expression,
    answer: question.answer,
    questionNumber: index + 1
  };
}

function unifyFactorMultipleQuestion(question: FactorMultipleQuestion, index: number): UnifiedQuestion {
  let answerStr: string;
  if (Array.isArray(question.answer)) {
    answerStr = question.answer.join(', ');
  } else {
    answerStr = String(question.answer);
  }
  return {
    id: question.id,
    expression: question.expression,
    answer: answerStr,
    questionNumber: index + 1
  };
}

function unifyComparisonQuestion(question: ComparisonQuestion, index: number): UnifiedQuestion {
  let answerStr: string;
  if (question.answer === -1) {
    answerStr = '<';
  } else if (question.answer === 0) {
    answerStr = '=';
  } else {
    answerStr = '>';
  }
  return {
    id: question.id,
    expression: question.expression,
    answer: answerStr,
    questionNumber: index + 1
  };
}

function unifyPatternQuestion(question: PatternQuestion, index: number): UnifiedQuestion {
  return {
    id: question.id,
    expression: question.expression,
    answer: question.answer,
    questionNumber: index + 1
  };
}

function unifyPrimeCompositeQuestion(question: PrimeCompositeQuestion, index: number): UnifiedQuestion {
  let answerStr: string;
  if (typeof question.answer === 'boolean') {
    answerStr = question.answer ? '是' : '否';
  } else if (Array.isArray(question.answer)) {
    answerStr = question.answer.join(' × ');
  } else {
    answerStr = String(question.answer);
  }
  return {
    id: question.id,
    expression: question.expression,
    answer: answerStr,
    questionNumber: index + 1
  };
}

/**
 * Export questions to TXT file
 */
export function useExport() {
  const isExporting = ref(false);

  /**
   * Export Equation questions to TXT file
   */
  const exportEquationsToTxt = (questions: EquationQuestion[], includeAnswers: boolean, title: string = '一元一次方程题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Fraction questions to TXT file
   */
  const exportFractionsToTxt = (questions: FractionQuestion[], includeAnswers: boolean, title: string = '分数运算题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyFractionQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Decimal questions to TXT file
   */
  const exportDecimalsToTxt = (questions: DecimalQuestion[], includeAnswers: boolean, title: string = '小数运算题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyDecimalQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Geometry questions to TXT file
   */
  const exportGeometryToTxt = (questions: GeometryQuestion[], includeAnswers: boolean, title: string = '几何计算题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyGeometryQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Percentage questions to TXT file
   */
  const exportPercentageToTxt = (questions: PercentageQuestion[], includeAnswers: boolean, title: string = '百分数题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyPercentageQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Unit Conversion questions to TXT file
   */
  const exportUnitConversionToTxt = (questions: UnitConversionQuestion[], includeAnswers: boolean, title: string = '单位换算题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyUnitConversionQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Factor Multiple questions to TXT file
   */
  const exportFactorMultipleToTxt = (questions: FactorMultipleQuestion[], includeAnswers: boolean, title: string = '倍数与因数题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyFactorMultipleQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Comparison questions to TXT file
   */
  const exportComparisonToTxt = (questions: ComparisonQuestion[], includeAnswers: boolean, title: string = '比较大小题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyComparisonQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} (${question.answer})`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} (?)`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Pattern questions to TXT file
   */
  const exportPatternToTxt = (questions: PatternQuestion[], includeAnswers: boolean, title: string = '找规律题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyPatternQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export Prime Composite questions to TXT file
   */
  const exportPrimeCompositeToTxt = (questions: PrimeCompositeQuestion[], includeAnswers: boolean, title: string = '质数与合数题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyPrimeCompositeQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   */
  const exportEquationsToPdf = (questions: EquationQuestion[], includeAnswers: boolean, title: string = '一元一次方程题目') => {
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
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      // Line
      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        // Check if we need a new page
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      // Save PDF
      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportFractionsToPdf = (questions: FractionQuestion[], includeAnswers: boolean, title: string = '分数运算题目') => {
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
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      // Line
      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyFractionQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportDecimalsToPdf = (questions: DecimalQuestion[], includeAnswers: boolean, title: string = '小数运算题目') => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyDecimalQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportGeometryToPdf = (questions: GeometryQuestion[], includeAnswers: boolean, title: string = '几何计算题目') => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyGeometryQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportPercentageToPdf = (questions: PercentageQuestion[], includeAnswers: boolean, title: string = '百分数题目') => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyPercentageQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportUnitConversionToPdf = (questions: UnitConversionQuestion[], includeAnswers: boolean, title: string = '单位换算题目') => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyUnitConversionQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportFactorMultipleToPdf = (questions: FactorMultipleQuestion[], includeAnswers: boolean, title: string = '倍数与因数题目') => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyFactorMultipleQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportComparisonToPdf = (questions: ComparisonQuestion[], includeAnswers: boolean, title: string = '比较大小题目') => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyComparisonQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} (${question.answer})`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} (?)`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportPatternToPdf = (questions: PatternQuestion[], includeAnswers: boolean, title: string = '找规律题目') => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyPatternQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  const exportPrimeCompositeToPdf = (questions: PrimeCompositeQuestion[], includeAnswers: boolean, title: string = '质数与合数题目') => {
    isExporting.value = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - (2 * margin);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyPrimeCompositeQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Print questions
   */
  const printEquations = (questions: EquationQuestion[], includeAnswers: boolean, title: string = '一元一次方程题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyQuestion(q, i));

      // Build HTML content
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      // Add questions to grid
      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  const printFractions = (questions: FractionQuestion[], includeAnswers: boolean, title: string = '分数运算题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyFractionQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  const printDecimals = (questions: DecimalQuestion[], includeAnswers: boolean, title: string = '小数运算题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyDecimalQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  const printGeometry = (questions: GeometryQuestion[], includeAnswers: boolean, title: string = '几何计算题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyGeometryQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  const printPercentage = (questions: PercentageQuestion[], includeAnswers: boolean, title: string = '百分数题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyPercentageQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  const printUnitConversion = (questions: UnitConversionQuestion[], includeAnswers: boolean, title: string = '单位换算题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyUnitConversionQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  const printFactorMultiple = (questions: FactorMultipleQuestion[], includeAnswers: boolean, title: string = '倍数与因数题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyFactorMultipleQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  const printComparison = (questions: ComparisonQuestion[], includeAnswers: boolean, title: string = '比较大小题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyComparisonQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} (${question.answer})
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} (?)
            </div>
          `;
        }
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

  const printPattern = (questions: PatternQuestion[], includeAnswers: boolean, title: string = '找规律题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyPatternQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  const printPrimeComposite = (questions: PrimeCompositeQuestion[], includeAnswers: boolean, title: string = '质数与合数题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyPrimeCompositeQuestion(q, i));

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  /**
   * Convert Question to unified format
   */
  function unifyArithmeticQuestion(question: Question, index: number): UnifiedQuestion {
    return {
      id: question.id,
      expression: question.expression,
      answer: question.answer,
      questionNumber: index + 1
    };
  }

  /**
   * Export arithmetic questions to TXT file
   */
  const exportToTxt = (questions: Question[], includeAnswers: boolean, title: string = '四则运算题目') => {
    isExporting.value = true;

    try {
      const lines: string[] = [];
      const unifiedQuestions = questions.map((q, i) => unifyArithmeticQuestion(q, i));

      // Header
      lines.push('========================================');
      lines.push(`       ${title}`);
      lines.push('========================================');
      lines.push('');

      // Format each question in 4 columns
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        const rowQuestions: string[] = [];

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            if (includeAnswers) {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ${question.answer}`);
            } else {
              rowQuestions.push(`${question.questionNumber}. ${question.expression} = ?`);
            }
          } else {
            rowQuestions.push('');
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
      link.download = generateFilename('txt', title);
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
   * Export arithmetic questions to PDF file
   */
  const exportToPdf = (questions: Question[], includeAnswers: boolean, title: string = '四则运算题目') => {
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
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      // Line
      doc.setLineWidth(0.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      let y = 35;
      const fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      const unifiedQuestions = questions.map((q, i) => unifyArithmeticQuestion(q, i));
      const totalQuestions = unifiedQuestions.length;
      const columns = 4;
      const columnWidth = availableWidth / columns;
      const rows = Math.ceil(totalQuestions / columns);

      for (let row = 0; row < rows; row++) {
        // Check if we need a new page
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        for (let col = 0; col < columns; col++) {
          const index = row + (col * rows);
          if (index < totalQuestions) {
            const question = unifiedQuestions[index];
            const x = margin + (col * columnWidth);

            if (includeAnswers) {
              doc.text(`${question.questionNumber}. ${question.expression} = ${question.answer}`, x, y);
            } else {
              doc.text(`${question.questionNumber}. ${question.expression} = ?`, x, y);
            }
          }
        }

        y += 8;
      }

      // Save PDF
      doc.save(generateFilename('pdf', title));
    } catch (error) {
      console.error('导出PDF失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Print arithmetic questions
   */
  const printQuestions = (questions: Question[], includeAnswers: boolean, title: string = '四则运算题目') => {
    isExporting.value = true;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口');
      }

      const unifiedQuestions = questions.map((q, i) => unifyArithmeticQuestion(q, i));

      // Build HTML content
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
          <div class="title">${title}</div>
          <div class="question-grid">
      `;

      // Add questions to grid
      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ${question.answer}
            </div>
          `;
        } else {
          html += `
            <div class="question">
              <span class="question-number">${question.questionNumber}.</span>${question.expression} = ?
            </div>
          `;
        }
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

  /**
   * Download Excel file from workbook
   * @param workbook XLSX workbook
   * @param filename Filename without extension
   */
  function downloadExcel(workbook: XLSX.WorkBook, filename: string): void {
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFilename('xlsx', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export arithmetic questions to Excel file
   * modify by jx: implement Excel export function for arithmetic questions
   */
  const exportToExcel = (questions: Question[], includeAnswers: boolean, title: string = '四则运算题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyArithmeticQuestion(q, i));

      // Create data array for Excel
      const data: (string | number | undefined)[][] = [];

      // Add header row
      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      // Add data rows
      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      // Create worksheet and workbook
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);

      // Download Excel file
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export equation questions to Excel file
   * modify by jx: implement Excel export function for equation questions
   */
  const exportEquationsToExcel = (questions: EquationQuestion[], includeAnswers: boolean, title: string = '一元一次方程题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export fraction questions to Excel file
   * modify by jx: implement Excel export function for fraction questions
   */
  const exportFractionsToExcel = (questions: FractionQuestion[], includeAnswers: boolean, title: string = '分数运算题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyFractionQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export decimal questions to Excel file
   * modify by jx: implement Excel export function for decimal questions
   */
  const exportDecimalsToExcel = (questions: DecimalQuestion[], includeAnswers: boolean, title: string = '小数运算题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyDecimalQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export geometry questions to Excel file
   * modify by jx: implement Excel export function for geometry questions
   */
  const exportGeometryToExcel = (questions: GeometryQuestion[], includeAnswers: boolean, title: string = '几何计算题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyGeometryQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export percentage questions to Excel file
   * modify by jx: implement Excel export function for percentage questions
   */
  const exportPercentageToExcel = (questions: PercentageQuestion[], includeAnswers: boolean, title: string = '百分数题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyPercentageQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export unit conversion questions to Excel file
   * modify by jx: implement Excel export function for unit conversion questions
   */
  const exportUnitConversionToExcel = (questions: UnitConversionQuestion[], includeAnswers: boolean, title: string = '单位换算题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyUnitConversionQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export factor multiple questions to Excel file
   * modify by jx: implement Excel export function for factor multiple questions
   */
  const exportFactorMultipleToExcel = (questions: FactorMultipleQuestion[], includeAnswers: boolean, title: string = '倍数与因数题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyFactorMultipleQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export comparison questions to Excel file
   * modify by jx: implement Excel export function for comparison questions
   */
  const exportComparisonToExcel = (questions: ComparisonQuestion[], includeAnswers: boolean, title: string = '比较大小题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyComparisonQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} (${question.answer})`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export pattern questions to Excel file
   * modify by jx: implement Excel export function for pattern questions
   */
  const exportPatternToExcel = (questions: PatternQuestion[], includeAnswers: boolean, title: string = '找规律题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyPatternQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * Export prime composite questions to Excel file
   * modify by jx: implement Excel export function for prime composite questions
   */
  const exportPrimeCompositeToExcel = (questions: PrimeCompositeQuestion[], includeAnswers: boolean, title: string = '质数与合数题目') => {
    isExporting.value = true;

    try {
      const unifiedQuestions = questions.map((q, i) => unifyPrimeCompositeQuestion(q, i));

      const data: (string | number | undefined)[][] = [];

      if (includeAnswers) {
        data.push(['题号', '题目', '答案']);
      } else {
        data.push(['题号', '题目']);
      }

      for (const question of unifiedQuestions) {
        if (includeAnswers) {
          data.push([
            question.questionNumber,
            `${question.expression} = ${question.answer}`,
            undefined
          ]);
        } else {
          data.push([
            question.questionNumber,
            question.expression,
            undefined
          ]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      downloadExcel(workbook, title);
    } catch (error) {
      console.error('导出Excel失败:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  return {
    isExporting,
    // Arithmetic exports (original functions)
    exportToTxt,
    exportToPdf,
    exportToExcel,
    printQuestions,
    // Equation exports
    exportEquationsToTxt,
    exportEquationsToPdf,
    exportEquationsToExcel,
    printEquations,
    // Fraction exports
    exportFractionsToTxt,
    exportFractionsToPdf,
    exportFractionsToExcel,
    printFractions,
    // Decimal exports
    exportDecimalsToTxt,
    exportDecimalsToPdf,
    exportDecimalsToExcel,
    printDecimals,
    // Geometry exports
    exportGeometryToTxt,
    exportGeometryToPdf,
    exportGeometryToExcel,
    printGeometry,
    // Percentage exports
    exportPercentageToTxt,
    exportPercentageToPdf,
    exportPercentageToExcel,
    printPercentage,
    // Unit conversion exports
    exportUnitConversionToTxt,
    exportUnitConversionToPdf,
    exportUnitConversionToExcel,
    printUnitConversion,
    // Factor multiple exports
    exportFactorMultipleToTxt,
    exportFactorMultipleToPdf,
    exportFactorMultipleToExcel,
    printFactorMultiple,
    // Comparison exports
    exportComparisonToTxt,
    exportComparisonToPdf,
    exportComparisonToExcel,
    printComparison,
    // Pattern exports
    exportPatternToTxt,
    exportPatternToPdf,
    exportPatternToExcel,
    printPattern,
    // Prime composite exports
    exportPrimeCompositeToTxt,
    exportPrimeCompositeToPdf,
    exportPrimeCompositeToExcel,
    printPrimeComposite
  };
}
