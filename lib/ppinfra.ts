import { OpenAICompatibleChatSettings } from '@ai-sdk/openai-compatible';

export type PPInfraChatModelId =
  | 'deepseek/deepseek-v3/community'
  | 'deepseek/deepseek-r1/community'
  | (string & {});

export interface PPInfraChatSettings extends OpenAICompatibleChatSettings {
  // Add any custom settings here
}

import { LanguageModelV1, EmbeddingModelV1 } from '@ai-sdk/provider';
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
} from '@ai-sdk/openai-compatible';
import {
  FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';

export interface PPInfraProviderSettings {
  /**
   * PPInfra API key.
   */
  apiKey?: string;
  /**
   * Base URL for the API calls.
   */
  baseURL?: string;
  /**
   * Custom headers to include in the requests.
   */
  headers?: Record<string, string>;
  /**
   * Optional custom url query parameters to include in request urls.
   */
  queryParams?: Record<string, string>;
  /**
   * Custom fetch implementation. You can use it as a middleware to intercept requests,
   * or to provide a custom fetch implementation for e.g. testing.
   */
  fetch?: FetchFunction;
}

export interface PPInfraProvider {
  /**
   * Creates a model for text generation.
   */
  (
    modelId: PPInfraChatModelId,
    settings?: PPInfraChatSettings,
  ): LanguageModelV1;

  /**
   * Creates a chat model for text generation.
   */
  chatModel(
    modelId: PPInfraChatModelId,
    settings?: PPInfraChatSettings,
  ): LanguageModelV1;

  /**
   * Creates a completion model for text generation.
   */
  completionModel(
    modelId: PPInfraChatModelId,
    settings?: PPInfraChatSettings,
  ): LanguageModelV1;

  /**
   * Creates a text embedding model for text generation.
   */
  textEmbeddingModel(
    modelId: PPInfraChatModelId,
    settings?: PPInfraChatSettings,
  ): EmbeddingModelV1<string>;
}

export function createPPInfra(
  options: PPInfraProviderSettings = {},
): PPInfraProvider {
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? 'https://api.ppinfra.com/v3/openai',
  );
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'PPINFRA_API_KEY',
      description: 'PPInfra API key',
    })}`,
    ...options.headers,
  });

  interface CommonModelConfig {
    provider: string;
    url: ({ path }: { path: string }) => string;
    headers: () => Record<string, string>;
    fetch?: FetchFunction;
  }

  const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
    provider: `ppinfra.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`);
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString();
      }
      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch,
  });

  const createChatModel = (
    modelId: PPInfraChatModelId,
    settings: PPInfraChatSettings = {},
  ) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      ...getCommonModelConfig('chat'),
      defaultObjectGenerationMode: 'tool',
    });
  };

  const createCompletionModel = (
    modelId: PPInfraChatModelId,
    settings: PPInfraChatSettings = {},
  ) =>
    new OpenAICompatibleCompletionLanguageModel(
      modelId,
      settings,
      getCommonModelConfig('completion'),
    );

  const createTextEmbeddingModel = (
    modelId: PPInfraChatModelId,
    settings: PPInfraChatSettings = {},
  ) =>
    new OpenAICompatibleEmbeddingModel(
      modelId,
      settings,
      getCommonModelConfig('embedding'),
    );

  const provider = (
    modelId: PPInfraChatModelId,
    settings?: PPInfraChatSettings,
  ) => createChatModel(modelId, settings);

  provider.completionModel = createCompletionModel;
  provider.chatModel = createChatModel;
  provider.textEmbeddingModel = createTextEmbeddingModel;

  return provider;
}

// Export default instance
export const ppinfra = createPPInfra();