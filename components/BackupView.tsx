import React, { useState, useRef } from 'react';
import { exportService } from '../services/exportService';
import { importService, ImportStrategy, ImportResult, ValidationResult } from '../services/importService';
import { useToast, ToastType } from '../services/toastService';

/**
 * BackupView Component
 * Provides UI for exporting and importing EchoCards data
 */

interface BackupViewProps {
  onClose: () => void;
}

type ExportFormat = 'json' | 'csv' | 'anki';
type ViewMode = 'export' | 'import';

export const BackupView: React.FC<BackupViewProps> = ({ onClose }) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('export');

  // Export state
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [includePreferences, setIncludePreferences] = useState(true);
  const [includeChecksum, setIncludeChecksum] = useState(true);

  // Import state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStrategy, setImportStrategy] = useState<ImportStrategy>(ImportStrategy.MERGE);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle export button click
   */
  const handleExport = async () => {
    try {
      setIsProcessing(true);
      await exportService.exportData(exportFormat, {
        includePreferences,
        includeChecksum: exportFormat === 'json' ? includeChecksum : false,
      });

      toast.success(`Data exported successfully as ${exportFormat.toUpperCase()}!`, ToastType.SUCCESS);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data. Please try again.', ToastType.ERROR);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationResult(null);
    setImportResult(null);

    // Validate file
    try {
      const fileContent = await importService.readFileContent(file);
      const importData = JSON.parse(fileContent);
      const validation = importService.validateImportData(importData);
      setValidationResult(validation);

      if (!validation.valid) {
        toast.error('File validation failed. Please check errors below.', ToastType.ERROR);
      } else if (validation.warnings.length > 0) {
        toast.warning('File validated with warnings. Review before importing.', ToastType.WARNING);
      } else {
        toast.success('File validated successfully!', ToastType.SUCCESS);
      }
    } catch (error) {
      console.error('File validation error:', error);
      setValidationResult({
        valid: false,
        errors: ['Invalid JSON file format'],
        warnings: [],
      });
      toast.error('Invalid file format. Please select a valid EchoCards backup file.', ToastType.ERROR);
    }
  };

  /**
   * Handle import button click
   */
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import', ToastType.ERROR);
      return;
    }

    if (!validationResult?.valid) {
      toast.error('Cannot import invalid file. Please fix errors first.', ToastType.ERROR);
      return;
    }

    try {
      setIsProcessing(true);
      const fileContent = await importService.readFileContent(selectedFile);
      const result = await importService.importFromJSON(fileContent, {
        strategy: importStrategy,
        validateChecksum: true,
        dryRun: false,
      });

      setImportResult(result);

      if (result.success) {
        toast.success(result.message, ToastType.SUCCESS);
        // Reload page after 2 seconds to reflect imported data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(result.message, ToastType.ERROR);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data. Please try again.', ToastType.ERROR);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Reset import state
   */
  const handleResetImport = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Backup & Restore</h2>
        <button onClick={onClose} style={styles.closeButton}>✕</button>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabs}>
        <button
          onClick={() => setViewMode('export')}
          style={{
            ...styles.tab,
            ...(viewMode === 'export' ? styles.tabActive : {}),
          }}
        >
          Export Data
        </button>
        <button
          onClick={() => setViewMode('import')}
          style={{
            ...styles.tab,
            ...(viewMode === 'import' ? styles.tabActive : {}),
          }}
        >
          Import Data
        </button>
      </div>

      {/* Export View */}
      {viewMode === 'export' && (
        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Export Format</h3>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  style={styles.radio}
                />
                <span>
                  <strong>JSON</strong> - Complete backup with all data (Recommended)
                </span>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  style={styles.radio}
                />
                <span>
                  <strong>CSV</strong> - Cards only, for spreadsheet editing
                </span>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="anki"
                  checked={exportFormat === 'anki'}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  style={styles.radio}
                />
                <span>
                  <strong>Anki</strong> - Import into Anki flashcard app
                </span>
              </label>
            </div>
          </div>

          {exportFormat === 'json' && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Options</h3>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={includePreferences}
                  onChange={(e) => setIncludePreferences(e.target.checked)}
                  style={styles.checkbox}
                />
                Include preferences (voice, conversational mode)
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={includeChecksum}
                  onChange={(e) => setIncludeChecksum(e.target.checked)}
                  style={styles.checkbox}
                />
                Include checksum for integrity verification
              </label>
            </div>
          )}

          <div style={styles.buttonContainer}>
            <button
              onClick={handleExport}
              disabled={isProcessing}
              style={styles.primaryButton}
            >
              {isProcessing ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
            </button>
          </div>

          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              <strong>💡 Tip:</strong> Export your data regularly to prevent data loss.
              JSON format is recommended for complete backups.
            </p>
          </div>
        </div>
      )}

      {/* Import View */}
      {viewMode === 'import' && (
        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Select File</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              style={styles.fileInput}
            />
            {selectedFile && (
              <p style={styles.fileName}>
                Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {validationResult && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Validation Results</h3>
              {validationResult.valid ? (
                <div style={styles.successBox}>
                  ✓ File is valid and ready to import
                </div>
              ) : (
                <div style={styles.errorBox}>
                  ✗ File validation failed
                </div>
              )}

              {validationResult.errors.length > 0 && (
                <div style={styles.errorList}>
                  <strong>Errors:</strong>
                  <ul>
                    {validationResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div style={styles.warningList}>
                  <strong>Warnings:</strong>
                  <ul>
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {validationResult?.valid && !importResult && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Import Strategy</h3>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value={ImportStrategy.MERGE}
                    checked={importStrategy === ImportStrategy.MERGE}
                    onChange={(e) => setImportStrategy(e.target.value as ImportStrategy)}
                    style={styles.radio}
                  />
                  <span>
                    <strong>Merge</strong> - Combine with existing data (imported overwrites conflicts)
                  </span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value={ImportStrategy.REPLACE}
                    checked={importStrategy === ImportStrategy.REPLACE}
                    onChange={(e) => setImportStrategy(e.target.value as ImportStrategy)}
                    style={styles.radio}
                  />
                  <span>
                    <strong>Replace</strong> - Delete all existing data and import (⚠️ Destructive)
                  </span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value={ImportStrategy.SKIP}
                    checked={importStrategy === ImportStrategy.SKIP}
                    onChange={(e) => setImportStrategy(e.target.value as ImportStrategy)}
                    style={styles.radio}
                  />
                  <span>
                    <strong>Skip</strong> - Only add new items, keep existing unchanged
                  </span>
                </label>
              </div>
            </div>
          )}

          {importResult && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Import Results</h3>
              {importResult.success ? (
                <div style={styles.successBox}>
                  ✓ {importResult.message}
                </div>
              ) : (
                <div style={styles.errorBox}>
                  ✗ {importResult.message}
                </div>
              )}

              <div style={styles.statsBox}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Decks Imported:</span>
                  <span style={styles.statValue}>{importResult.stats.decksImported}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Cards Imported:</span>
                  <span style={styles.statValue}>{importResult.stats.cardsImported}</span>
                </div>
                {importResult.stats.decksSkipped > 0 && (
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Decks Skipped:</span>
                    <span style={styles.statValue}>{importResult.stats.decksSkipped}</span>
                  </div>
                )}
                {importResult.stats.cardsSkipped > 0 && (
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Cards Skipped:</span>
                    <span style={styles.statValue}>{importResult.stats.cardsSkipped}</span>
                  </div>
                )}
              </div>

              {importResult.stats.errors.length > 0 && (
                <div style={styles.errorList}>
                  <strong>Errors:</strong>
                  <ul>
                    {importResult.stats.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div style={styles.buttonContainer}>
            {!importResult && (
              <button
                onClick={handleImport}
                disabled={!validationResult?.valid || isProcessing}
                style={styles.primaryButton}
              >
                {isProcessing ? 'Importing...' : 'Import Data'}
              </button>
            )}
            <button
              onClick={handleResetImport}
              style={styles.secondaryButton}
            >
              {importResult ? 'Import Another File' : 'Clear'}
            </button>
          </div>

          {importStrategy === ImportStrategy.REPLACE && !importResult && (
            <div style={styles.warningBox}>
              <p style={styles.warningText}>
                <strong>⚠️ Warning:</strong> Replace strategy will permanently delete all existing data.
                Make sure to export your current data first!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '30px',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    color: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#888',
    cursor: 'pointer',
    padding: '0',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '2px solid #333',
  },
  tab: {
    flex: 1,
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: '#888',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#4fc3f7',
    borderBottomColor: '#4fc3f7',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
    padding: '12px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  radio: {
    marginTop: '3px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '8px',
  },
  checkbox: {
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  primaryButton: {
    flex: 1,
    padding: '14px 28px',
    backgroundColor: '#4fc3f7',
    color: '#1e1e1e',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  secondaryButton: {
    padding: '14px 28px',
    backgroundColor: '#333',
    color: '#e0e0e0',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  fileInput: {
    padding: '12px',
    backgroundColor: '#2a2a2a',
    border: '2px dashed #555',
    borderRadius: '8px',
    color: '#e0e0e0',
    cursor: 'pointer',
  },
  fileName: {
    fontSize: '14px',
    color: '#aaa',
    marginTop: '8px',
  },
  successBox: {
    padding: '12px 16px',
    backgroundColor: '#1b5e20',
    color: '#a5d6a7',
    borderRadius: '8px',
    border: '1px solid #2e7d32',
  },
  errorBox: {
    padding: '12px 16px',
    backgroundColor: '#b71c1c',
    color: '#ef9a9a',
    borderRadius: '8px',
    border: '1px solid #c62828',
  },
  warningBox: {
    padding: '16px',
    backgroundColor: '#e65100',
    borderRadius: '8px',
    border: '1px solid #f57c00',
  },
  warningText: {
    margin: 0,
    color: '#fff3e0',
    fontSize: '14px',
  },
  infoBox: {
    padding: '16px',
    backgroundColor: '#1565c0',
    borderRadius: '8px',
    border: '1px solid #1976d2',
  },
  infoText: {
    margin: 0,
    color: '#e3f2fd',
    fontSize: '14px',
  },
  errorList: {
    marginTop: '10px',
    padding: '12px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    color: '#ef9a9a',
  },
  warningList: {
    marginTop: '10px',
    padding: '12px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    color: '#ffcc80',
  },
  statsBox: {
    marginTop: '15px',
    padding: '16px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #333',
  },
  statLabel: {
    color: '#aaa',
    fontSize: '14px',
  },
  statValue: {
    color: '#4fc3f7',
    fontSize: '16px',
    fontWeight: '600',
  },
};
