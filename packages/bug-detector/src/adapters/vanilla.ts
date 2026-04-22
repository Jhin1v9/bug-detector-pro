/**
 * Vanilla JS Adapter para BugDetector
 * API para uso sem frameworks
 */

import { BugDetector } from '../core/BugDetector';
import type {
  BugDetectorConfig,
  InspectedElement,
  BugReport,
  CreateReportData,
  ExportOptions,
  ExportResult,
} from '../types';

// ============================================================================
// API VANILLA
// ============================================================================

/** Instância global */
let globalInstance: BugDetector | null = null;

/** Inicializa o BugDetector */
export function initBugDetector(config: BugDetectorConfig = {}): BugDetector {
  if (globalInstance) {
    console.warn('BugDetector já inicializado. Use getBugDetector() ou reinicie.');
    return globalInstance;
  }

  globalInstance = new BugDetector(config);
  
  // Auto-ativa com atalho de teclado
  if (config.trigger === 'keyboard-shortcut' && config.shortcut) {
    setupKeyboardShortcut(config.shortcut);
  }

  return globalInstance;
}

/** Obtém instância existente */
export function getBugDetector(): BugDetector {
  if (!globalInstance) {
    throw new Error('BugDetector não inicializado. Chame initBugDetector() primeiro.');
  }
  return globalInstance;
}

/** Destrói instância */
export function destroyBugDetector(): void {
  if (globalInstance) {
    globalInstance.deactivate();
    globalInstance = null;
  }
}

// ============================================================================
// FUNÇÕES DE CONVENIÊNCIA
// ============================================================================

/** Ativa o BugDetector */
export function activate(): void {
  getBugDetector().activate();
}

/** Desativa o BugDetector */
export function deactivate(): void {
  getBugDetector().deactivate();
}

/** Alterna estado */
export function toggle(): void {
  getBugDetector().toggle();
}

/** Inspeciona elemento */
export function inspect(element: Element | string): InspectedElement {
  return getBugDetector().inspectElement(element);
}

/** Cria report */
export async function report(
  description: string, 
  options: Partial<CreateReportData> = {}
): Promise<BugReport> {
  return getBugDetector().createReport({
    description,
    ...options,
  });
}

/** Obtém todos os reports */
export function getReports(): BugReport[] {
  return getBugDetector().getReports();
}

/** Exporta report */
export async function exportReport(
  reportId: string, 
  format: ExportOptions['format'] = 'markdown'
): Promise<ExportResult> {
  return getBugDetector().exportReport(reportId, { format });
}

/** Cria botão flutuante */
export function createFloatingButton(options: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  size?: number;
} = {}): HTMLButtonElement {
  const { 
    position = 'bottom-right', 
    color = '#3b82f6',
    size = 56 
  } = options;

  const button = document.createElement('button');
  button.innerHTML = '🐛';
  button.title = 'Ativar Debug';
  
  const positions: Record<string, { top?: string; left?: string; right?: string; bottom?: string }> = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
  };

  Object.assign(button.style, {
    position: 'fixed',
    ...positions[position],
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    zIndex: '2147483647',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.4}px`,
    transition: 'all 0.2s',
  });

  button.addEventListener('click', () => {
    const detector = getBugDetector();
    detector.toggle();
    button.innerHTML = detector.isActivated() ? '✕' : '🐛';
    button.title = detector.isActivated() ? 'Desativar Debug' : 'Ativar Debug';
    button.style.backgroundColor = detector.isActivated() ? '#ef4444' : color;
  });

  document.body.appendChild(button);
  return button;
}

// ============================================================================
// UTILIDADES
// ============================================================================

/** Configura atalho de teclado */
function setupKeyboardShortcut(shortcut: string): void {
  const keys = shortcut.toLowerCase().split('+');
  
  document.addEventListener('keydown', (e) => {
    const hasCtrl = keys.includes('ctrl') || keys.includes('control');
    const hasShift = keys.includes('shift');
    const hasAlt = keys.includes('alt');
    const key = keys.find(k => !['ctrl', 'control', 'shift', 'alt'].includes(k));

    if (
      e.ctrlKey === hasCtrl &&
      e.shiftKey === hasShift &&
      e.altKey === hasAlt &&
      e.key.toLowerCase() === key
    ) {
      e.preventDefault();
      getBugDetector().toggle();
    }
  });
}

/** Auto-inicialização */
export function autoInit(config: BugDetectorConfig = {}): void {
  // Aguarda DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(config));
  } else {
    init(config);
  }

  function init(cfg: BugDetectorConfig) {
    const detector = initBugDetector(cfg);
    
    // Cria botão flutuante se configurado
    if (cfg.trigger === 'floating-button') {
      createFloatingButton();
    }

    // Auto-ativa em desenvolvimento
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      detector.activate();
    }
  }
}

// ============================================================================
// EXTENSÃO DE ELEMENTOS
// ============================================================================

/** Extensão do Element.prototype */
interface ElementWithBugDetector extends Element {
  inspect(): InspectedElement;
  report(description: string, options?: Partial<CreateReportData>): Promise<BugReport>;
}

/** Adiciona método inspect a todos os elementos */
export function extendElements(): void {
  if (typeof Element !== 'undefined') {
    (Element.prototype as ElementWithBugDetector).inspect = function(this: Element) {
      return getBugDetector().inspectElement(this);
    };

    (Element.prototype as ElementWithBugDetector).report = function(
      this: Element, 
      description: string, 
      options?: Partial<CreateReportData>
    ) {
      const detector = getBugDetector();
      detector.inspectElement(this);
      return detector.createReport({ description, ...options });
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  BugDetector,
  BugDetectorConfig,
  InspectedElement,
  BugReport,
  CreateReportData,
  ExportOptions,
  ExportResult,
};

/** Exporta tudo em um objeto */
export const BugDetectorAPI = {
  init: initBugDetector,
  get: getBugDetector,
  destroy: destroyBugDetector,
  activate,
  deactivate,
  toggle,
  inspect,
  report,
  getReports,
  exportReport,
  createFloatingButton,
  autoInit,
  extendElements,
};

export default BugDetectorAPI;
