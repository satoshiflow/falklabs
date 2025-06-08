import { createScopedLogger } from '~/utils/logger';

/** Options for the EntityRecognitionAgent */
export interface EntityRecognitionOptions {
  /** Activate verbose logging */
  debug?: boolean;
}

/** Simple representation of an extracted entity */
export interface Entity {
  text: string;
  type: string;
}

/** Result returned by the agent */
export interface EntityRecognitionResult {
  entities: Entity[];
  quality: number;
}

/**
 * EntityRecognitionAgent is a very small example agent that looks for
 * entities inside a piece of text.
 * The implementation here is intentionally simple so that the general
 * structure is easy to understand.
 */
export class EntityRecognitionAgent {
  // Create a scoped logger so log messages show the agent's name
  #logger = createScopedLogger('EntityRecognitionAgent');

  /**
   * Analyse the provided text and return the found entities.
   * @param text Text to analyse.
   * @param options Optional settings such as debug mode.
   */
  async recognize(
    text: string,
    options: EntityRecognitionOptions = {},
  ): Promise<EntityRecognitionResult> {
    try {
      if (options.debug) {
        // Let the developer know we have started processing
        this.#logger.debug('Starting entity recognition', text);
      }

      // Extract entities with a simple heuristic. In a real system
      // this would call a proper NLP library.
      const entities = this.extractEntities(text);

      if (options.debug) {
        this.#logger.debug('Entities found', entities);
      }

      // Generate a very rough quality estimate
      const quality = this.estimateQuality(entities);

      if (options.debug) {
        this.#logger.debug('Quality score', quality);
      }

      return { entities, quality };
    } catch (error) {
      // If anything goes wrong we log the error and return an empty result
      this.#logger.error('Failed to recognize entities', error);
      return { entities: [], quality: 0 };
    }
  }

  /**
   * Extract entities from text using a regex for capitalised words.
   * This is only a placeholder implementation.
   */
  private extractEntities(text: string): Entity[] {
    const matches = text.match(/\b[A-Z][a-z]*(?:\s+[A-Z][a-z]*)*\b/g) || [];
    return matches.map((m) => ({ text: m, type: 'Unknown' }));
  }

  /**
   * Estimate quality based on the number of entities found.
   * More entities means higher confidence in this naive example.
   */
  private estimateQuality(entities: Entity[]): number {
    return Math.min(1, entities.length / 10);
  }
}

export default EntityRecognitionAgent;
