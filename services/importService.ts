import { Card, Deck, StudyProgress, CardState } from '../types';
import { storageService } from './storageService';
import { ExportData } from './exportService';

/**
 * Import Service
 * Handles importing EchoCards data from various formats with validation
 */

export enum ImportStrategy {
  REPLACE = 'replace', // Replace all existing data
  MERGE = 'merge',     // Merge with existing data (keep both, prefer imported on conflicts)
  SKIP = 'skip',       // Skip if data exists (keep existing)
}

export interface ImportOptions {
  strategy?: ImportStrategy;
  validateChecksum?: boolean;
  dryRun?: boolean; // Validate without actually importing
}

export interface ImportResult {
  success: boolean;
  message: string;
  stats: {
    decksImported: number;
    cardsImported: number;
    decksSkipped: number;
    cardsSkipped: number;
    errors: string[];
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Import data from JSON file
 */
export const importFromJSON = async (
  fileContent: string,
  options: ImportOptions = {}
): Promise<ImportResult> => {
  const {
    strategy = ImportStrategy.MERGE,
    validateChecksum = true,
    dryRun = false,
  } = options;

  const result: ImportResult = {
    success: false,
    message: '',
    stats: {
      decksImported: 0,
      cardsImported: 0,
      decksSkipped: 0,
      cardsSkipped: 0,
      errors: [],
    },
  };

  try {
    // Parse JSON
    let importData: ExportData;
    try {
      importData = JSON.parse(fileContent);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }

    // Validate structure
    const validation = validateImportData(importData);
    if (!validation.valid) {
      result.stats.errors = validation.errors;
      result.message = `Validation failed: ${validation.errors.join(', ')}`;
      return result;
    }

    // Verify checksum if present
    if (validateChecksum && importData.checksum) {
      const dataString = JSON.stringify({
        decks: importData.decks,
        cards: importData.cards,
        studyProgress: importData.studyProgress,
      });
      const computedChecksum = await generateChecksum(dataString);

      if (computedChecksum !== importData.checksum) {
        throw new Error('Checksum verification failed - data may be corrupted');
      }
    }

    // Dry run - just validate
    if (dryRun) {
      result.success = true;
      result.message = 'Validation successful (dry run)';
      result.stats.decksImported = importData.decks.length;
      result.stats.cardsImported = importData.cards.length;
      return result;
    }

    // Perform import based on strategy
    if (strategy === ImportStrategy.REPLACE) {
      // Replace all data
      await importWithReplace(importData, result);
    } else if (strategy === ImportStrategy.MERGE) {
      // Merge with existing data
      await importWithMerge(importData, result);
    } else if (strategy === ImportStrategy.SKIP) {
      // Keep existing data, only add new
      await importWithSkip(importData, result);
    }

    // Import preferences if present
    if (importData.preferences) {
      localStorage.setItem('echoCards_voicePreference', importData.preferences.voicePreference);
      localStorage.setItem('echoCards_conversationalMode', String(importData.preferences.conversationalMode));
    }

    result.success = true;
    result.message = `Successfully imported ${result.stats.decksImported} decks and ${result.stats.cardsImported} cards`;

    return result;
  } catch (error) {
    result.success = false;
    result.message = error instanceof Error ? error.message : 'Unknown import error';
    result.stats.errors.push(result.message);
    return result;
  }
};

/**
 * Import with REPLACE strategy - replace all existing data
 */
const importWithReplace = async (importData: ExportData, result: ImportResult): Promise<void> => {
  try {
    // Clear existing data
    localStorage.removeItem('echoCards_decks');
    localStorage.removeItem('echoCards_cards');
    localStorage.removeItem('echoCards_studyProgress');

    // Import decks
    const validDecks = importData.decks.filter(deck => deck.id && deck.name);
    localStorage.setItem('echoCards_decks', JSON.stringify(validDecks));
    result.stats.decksImported = validDecks.length;

    // Import cards with date parsing
    const validCards = importData.cards
      .filter(card => card.id && card.deckId && card.question && card.answer)
      .map(card => ({
        ...card,
        dueDate: typeof card.dueDate === 'string' ? new Date(card.dueDate) : card.dueDate,
      }));
    localStorage.setItem('echoCards_cards', JSON.stringify(validCards));
    result.stats.cardsImported = validCards.length;

    // Import study progress
    if (importData.studyProgress) {
      localStorage.setItem('echoCards_studyProgress', JSON.stringify(importData.studyProgress));
    }
  } catch (error) {
    throw new Error('Failed to replace data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Import with MERGE strategy - merge with existing data, prefer imported
 */
const importWithMerge = async (importData: ExportData, result: ImportResult): Promise<void> => {
  try {
    // Get existing data
    const existingDecks = storageService.getDecks();
    const existingCards = storageService.getCards();

    // Create maps for quick lookup
    const existingDeckMap = new Map(existingDecks.map(d => [d.id, d]));
    const existingCardMap = new Map(existingCards.map(c => [c.id, c]));

    // Merge decks (imported overwrites existing)
    const mergedDecks = [...existingDecks];
    for (const deck of importData.decks) {
      const existingIndex = mergedDecks.findIndex(d => d.id === deck.id);
      if (existingIndex >= 0) {
        mergedDecks[existingIndex] = deck; // Overwrite
        result.stats.decksSkipped++;
      } else {
        mergedDecks.push(deck); // Add new
        result.stats.decksImported++;
      }
    }

    // Merge cards (imported overwrites existing)
    const mergedCards = [...existingCards];
    for (const card of importData.cards) {
      const parsedCard = {
        ...card,
        dueDate: typeof card.dueDate === 'string' ? new Date(card.dueDate) : card.dueDate,
      };

      const existingIndex = mergedCards.findIndex(c => c.id === parsedCard.id);
      if (existingIndex >= 0) {
        mergedCards[existingIndex] = parsedCard; // Overwrite
        result.stats.cardsSkipped++;
      } else {
        mergedCards.push(parsedCard); // Add new
        result.stats.cardsImported++;
      }
    }

    // Save merged data
    localStorage.setItem('echoCards_decks', JSON.stringify(mergedDecks));
    localStorage.setItem('echoCards_cards', JSON.stringify(mergedCards));

    // Merge study progress (prefer imported)
    if (importData.studyProgress) {
      localStorage.setItem('echoCards_studyProgress', JSON.stringify(importData.studyProgress));
    }
  } catch (error) {
    throw new Error('Failed to merge data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Import with SKIP strategy - keep existing data, only add new
 */
const importWithSkip = async (importData: ExportData, result: ImportResult): Promise<void> => {
  try {
    // Get existing data
    const existingDecks = storageService.getDecks();
    const existingCards = storageService.getCards();

    // Create maps for quick lookup
    const existingDeckIds = new Set(existingDecks.map(d => d.id));
    const existingCardIds = new Set(existingCards.map(c => c.id));

    // Add only new decks
    const newDecks = importData.decks.filter(deck => !existingDeckIds.has(deck.id));
    const mergedDecks = [...existingDecks, ...newDecks];
    result.stats.decksImported = newDecks.length;
    result.stats.decksSkipped = importData.decks.length - newDecks.length;

    // Add only new cards
    const newCards = importData.cards
      .filter(card => !existingCardIds.has(card.id))
      .map(card => ({
        ...card,
        dueDate: typeof card.dueDate === 'string' ? new Date(card.dueDate) : card.dueDate,
      }));
    const mergedCards = [...existingCards, ...newCards];
    result.stats.cardsImported = newCards.length;
    result.stats.cardsSkipped = importData.cards.length - newCards.length;

    // Save merged data
    localStorage.setItem('echoCards_decks', JSON.stringify(mergedDecks));
    localStorage.setItem('echoCards_cards', JSON.stringify(mergedCards));

    // Keep existing study progress (don't import)
  } catch (error) {
    throw new Error('Failed to skip-import data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Validate imported data structure
 */
export const validateImportData = (data: any): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Check if data exists
  if (!data) {
    result.valid = false;
    result.errors.push('No data provided');
    return result;
  }

  // Check version
  if (!data.version) {
    result.warnings.push('No version field found');
  } else if (data.version !== '1.0') {
    result.warnings.push(`Unsupported version: ${data.version} (expected 1.0)`);
  }

  // Check decks array
  if (!Array.isArray(data.decks)) {
    result.valid = false;
    result.errors.push('Decks must be an array');
  } else {
    // Validate each deck
    data.decks.forEach((deck: any, index: number) => {
      if (!deck.id) {
        result.errors.push(`Deck at index ${index} missing id`);
        result.valid = false;
      }
      if (!deck.name) {
        result.errors.push(`Deck at index ${index} missing name`);
        result.valid = false;
      }
    });
  }

  // Check cards array
  if (!Array.isArray(data.cards)) {
    result.valid = false;
    result.errors.push('Cards must be an array');
  } else {
    // Validate each card
    data.cards.forEach((card: any, index: number) => {
      if (!card.id) {
        result.errors.push(`Card at index ${index} missing id`);
        result.valid = false;
      }
      if (!card.deckId) {
        result.errors.push(`Card at index ${index} missing deckId`);
        result.valid = false;
      }
      if (!card.question) {
        result.errors.push(`Card at index ${index} missing question`);
        result.valid = false;
      }
      if (!card.answer) {
        result.errors.push(`Card at index ${index} missing answer`);
        result.valid = false;
      }

      // Validate FSRS fields
      if (typeof card.stability !== 'number' || card.stability < 0) {
        result.warnings.push(`Card ${card.id} has invalid stability`);
      }
      if (typeof card.difficulty !== 'number' || card.difficulty < 1 || card.difficulty > 10) {
        result.warnings.push(`Card ${card.id} has invalid difficulty`);
      }
      if (!['NEW', 'LEARNING', 'REVIEW', 'RELEARNING'].includes(card.state)) {
        result.errors.push(`Card ${card.id} has invalid state: ${card.state}`);
        result.valid = false;
      }

      // Validate date
      if (card.dueDate) {
        const date = new Date(card.dueDate);
        if (isNaN(date.getTime())) {
          result.errors.push(`Card ${card.id} has invalid dueDate: ${card.dueDate}`);
          result.valid = false;
        }
      }
    });
  }

  // Check for orphaned cards (cards without corresponding deck)
  if (Array.isArray(data.decks) && Array.isArray(data.cards)) {
    const deckIds = new Set(data.decks.map((d: any) => d.id));
    const orphanedCards = data.cards.filter((c: any) => !deckIds.has(c.deckId));
    if (orphanedCards.length > 0) {
      result.warnings.push(`Found ${orphanedCards.length} orphaned cards (no matching deck)`);
    }
  }

  return result;
};

/**
 * Read file content from File object
 */
export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
};

/**
 * Generate checksum for verification
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

export const importService = {
  importFromJSON,
  validateImportData,
  readFileContent,
  ImportStrategy,
};
