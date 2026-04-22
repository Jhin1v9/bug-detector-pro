/**
 * Gerenciamento de configuração do BugDetector
 */

import type { BugDetectorConfig, AIConfig, IntegrationsConfig, CaptureConfig, BrandingConfig } from '../types';

/** Configuração padrão */
export const DEFAULT_CONFIG: Required<BugDetectorConfig> = {
  trigger: 'floating-button',
  shortcut: 'Ctrl+Shift+D',
  headless: false,
  persistTo: 'localStorage',
  autoActivateInDev: false,
  zIndexBase: 999999,
  ai: {
    provider: 'none',
    apiKey: '',
    model: 'gemini-pro',
    temperature: 0.3,
    timeout: 30000,
  },
  integrations: {},
  capture: {
    screenshot: true,
    console: true,
    network: true,
    performance: true,
    includeHTML: false,
    includeStyles: true,
  },
  callbacks: {},
  branding: {},
  guestMode: false,
};

/** Classe de configuração */
export class Config {
  private static instance: Config;
  private config: Required<BugDetectorConfig>;

  constructor(userConfig: BugDetectorConfig = {}) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, userConfig);
  }

  /** Singleton */
  static getInstance(userConfig?: BugDetectorConfig): Config {
    if (!Config.instance) {
      Config.instance = new Config(userConfig);
    }
    return Config.instance;
  }

  /** Merge de configurações */
  private mergeConfig(
    defaultConfig: Required<BugDetectorConfig>,
    userConfig: BugDetectorConfig
  ): Required<BugDetectorConfig> {
    return {
      ...defaultConfig,
      ...userConfig,
      ai: { ...defaultConfig.ai, ...userConfig.ai },
      integrations: { ...defaultConfig.integrations, ...userConfig.integrations },
      capture: { ...defaultConfig.capture, ...userConfig.capture },
      callbacks: { ...defaultConfig.callbacks, ...userConfig.callbacks },
      branding: { ...defaultConfig.branding, ...userConfig.branding },
    };
  }

  /** Obtém configuração completa */
  get(): Required<BugDetectorConfig> {
    return this.config;
  }

  /** Obtém configuração de IA */
  getAI(): Required<AIConfig> {
    return this.config.ai as Required<AIConfig>;
  }

  /** Obtém configuração de integrações */
  getIntegrations(): IntegrationsConfig {
    return this.config.integrations;
  }

  /** Obtém configuração de captura */
  getCapture(): Required<CaptureConfig> {
    return this.config.capture as Required<CaptureConfig>;
  }

  /** Obtém configuração de branding */
  getBranding(): BrandingConfig {
    return this.config.branding;
  }

  /** Verifica se está em modo guest */
  isGuestMode(): boolean {
    return this.config.guestMode;
  }

  /** Verifica se está em modo headless */
  isHeadless(): boolean {
    return this.config.headless;
  }

  /** Verifica se deve persistir */
  shouldPersist(): boolean {
    return this.config.persistTo !== 'none';
  }

  /** Obtém método de persistência */
  getPersistMethod(): 'localStorage' | 'indexedDB' | 'api' | 'none' {
    return this.config.persistTo;
  }

  /** Atualiza configuração */
  update(updates: Partial<BugDetectorConfig>): void {
    this.config = this.mergeConfig(this.config, updates);
  }

  /** Reseta para padrão */
  reset(): void {
    this.config = DEFAULT_CONFIG;
  }
}

export default Config;
