import { Card, Deck, StudyProgress, VoiceName } from '../types';
import { storageService } from './storageService';

/**
 * Export Service
 * Handles exporting EchoCards data to various formats (JSON, CSV, Anki)
 */

export interface ExportData {
  version: string;
  exportDate: string;
  decks: Deck[];
  cards: Card[];
  studyProgress: StudyProgress | null;
  preferences: {
    voicePreference: VoiceName;
    conversationalMode: boolean;
  };
  checksum?: string;
}

export interface ExportOptions {
  includePreferences?: boolean;
  includeChecksum?: boolean;
  format?: 'json' | 'csv' | 'anki';
}

/**
 * Export all data to JSON format
 */
export const exportToJSON = async (options: ExportOptions = {}): Promise<string> => {
  const {
    includePreferences = true,
    includeChecksum = true,
  } = options;

  try {
    // Gather all data
    const decks = storageService.getDecks();
    const cards = storageService.getCards();
    const studyProgress = storageService.getStudyProgress();

    // Get preferences
    const voicePreference = localStorage.getItem('echoCards_voicePreference') as VoiceName || 'Zephyr';
    const conversationalMode = localStorage.getItem('echoCards_conversationalMode') === 'true';

    // Build export data
    const exportData: ExportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      decks,
      cards: cards.map(card => ({
        ...card,
        // Ensure dueDate is serialized as ISO string
        dueDate: card.dueDate instanceof Date ? card.dueDate.toISOString() : card.dueDate,
      })),
      studyProgress,
      preferences: includePreferences ? {
        voicePreference,
        conversationalMode,
      } : {
        voicePreference: 'Zephyr',
        conversationalMode: false,
      },
    };

    // Generate checksum if requested
    if (includeChecksum) {
      const dataString = JSON.stringify({
        decks: exportData.decks,
        cards: exportData.cards,
        studyProgress: exportData.studyProgress,
      });
      exportData.checksum = await generateChecksum(dataString);
    }

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export data to JSON');
  }
};

/**
 * Export cards to CSV format
 * Format: Deck Name, Question, Answer, Explanation, Due Date, Stability, Difficulty, Lapses, Reps, State
 */
export const exportToCSV = (): string => {
  try {
    const decks = storageService.getDecks();
    const cards = storageService.getCards();

    // Create deck lookup
    const deckMap = new Map(decks.map(deck => [deck.id, deck.name]));

    // CSV Header
    const header = 'Deck Name,Question,Answer,Explanation,Due Date,Stability,Difficulty,Lapses,Reps,State\n';

    // CSV Rows
    const rows = cards.map(card => {
      const deckName = deckMap.get(card.deckId) || 'Unknown Deck';
      const dueDate = card.dueDate instanceof Date ? card.dueDate.toISOString() : card.dueDate;

      return [
        escapeCSV(deckName),
        escapeCSV(card.question),
        escapeCSV(card.answer),
        escapeCSV(card.explanation || ''),
        dueDate,
        card.stability.toFixed(2),
        card.difficulty.toFixed(2),
        card.lapses,
        card.reps,
        card.state,
      ].join(',');
    }).join('\n');

    return header + rows;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export data to CSV');
  }
};

/**
 * Export cards to Anki-compatible TSV format
 * Format: Question [TAB] Answer [TAB] Explanation [TAB] Tags
 */
export const exportToAnki = (): string => {
  try {
    const decks = storageService.getDecks();
    const cards = storageService.getCards();

    // Create deck lookup
    const deckMap = new Map(decks.map(deck => [deck.id, deck.name]));

    // TSV Header
    const header = 'Question\tAnswer\tExplanation\tTags\n';

    // TSV Rows
    const rows = cards.map(card => {
      const deckName = deckMap.get(card.deckId) || 'Unknown';
      const tags = `EchoCards ${deckName}`;

      return [
        escapeTSV(card.question),
        escapeTSV(card.answer),
        escapeTSV(card.explanation || ''),
        escapeTSV(tags),
      ].join('\t');
    }).join('\n');

    return header + rows;
  } catch (error) {
    console.error('Error exporting to Anki:', error);
    throw new Error('Failed to export data to Anki format');
  }
};

/**
 * Download exported data as a file
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
};

/**
 * Generate checksum for data integrity verification
 */
const generateChecksum = async (data: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Error generating checksum:', error);
    return '';
  }
};

/**
 * Escape special characters for CSV format
 */
const escapeCSV = (value: string): string => {
  if (!value) return '';

  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};

/**
 * Escape special characters for TSV format
 */
const escapeTSV = (value: string): string => {
  if (!value) return '';

  // Replace tabs with spaces, remove newlines
  return value.replace(/\t/g, '    ').replace(/\n/g, ' ').trim();
};

/**
 * Get suggested filename based on format and current date
 */
export const getSuggestedFilename = (format: 'json' | 'csv' | 'anki'): string => {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  switch (format) {
    case 'json':
      return `echocards-backup-${timestamp}.json`;
    case 'csv':
      return `echocards-export-${timestamp}.csv`;
    case 'anki':
      return `echocards-anki-${timestamp}.txt`;
    default:
      return `echocards-export-${timestamp}.txt`;
  }
};

/**
 * Get MIME type based on format
 */
export const getMimeType = (format: 'json' | 'csv' | 'anki'): string => {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    case 'anki':
      return 'text/plain';
    default:
      return 'text/plain';
  }
};

/**
 * Main export function that handles all formats
 */
export const exportData = async (format: 'json' | 'csv' | 'anki', options: ExportOptions = {}): Promise<void> => {
  try {
    let content: string;

    switch (format) {
      case 'json':
        content = await exportToJSON(options);
        break;
      case 'csv':
        content = exportToCSV();
        break;
      case 'anki':
        content = exportToAnki();
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    const filename = getSuggestedFilename(format);
    const mimeType = getMimeType(format);

    downloadFile(content, filename, mimeType);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const exportService = {
  exportToJSON,
  exportToCSV,
  exportToAnki,
  exportData,
  downloadFile,
  getSuggestedFilename,
  getMimeType,
};
