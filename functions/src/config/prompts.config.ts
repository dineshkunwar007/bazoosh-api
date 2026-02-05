/**
 * Prompt Templates Configuration
 * All 30+ prompt types for creative writing feedback
 */
import { PromptTemplates } from '../types';

export const PROMPT_TEMPLATES: PromptTemplates = {
  // ========================================
  // METAPHOR PROMPTS (3)
  // ========================================
  'metaphor-1': {
    category: 'Metaphor',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK, who understands the difference between simile and metaphor. Give very short, child-friendly feedback on 2–3 descriptive sentences that uses two metaphors based on the IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 10,
    maxWords: 100,
    expectedElements: ['metaphor', 'descriptive language'],
  },
  'metaphor-2': {
    category: 'Metaphor',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK, who understands the difference between simile and metaphor. Give very short, child-friendly feedback on 2–3 descriptive sentences that uses two metaphors based on the IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 10,
    maxWords: 100,
    expectedElements: ['metaphor', 'descriptive language'],
  },
  'metaphor-3': {
    category: 'Metaphor',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK, who understands the difference between simile and metaphor. Give very short, child-friendly feedback on 2–3 descriptive sentences that uses two metaphors based on the IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 10,
    maxWords: 100,
    expectedElements: ['metaphor', 'descriptive language'],
  },

  // ========================================
  // PERSONIFICATION PROMPTS (3)
  // ========================================
  'personification-1': {
    category: 'Personification',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on the use of personification based on IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 10,
    maxWords: 100,
    expectedElements: ['personification'],
  },
  'personification-2': {
    category: 'Personification',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on the use of personification based on IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 10,
    maxWords: 100,
    expectedElements: ['personification'],
  },
  'personification-3': {
    category: 'Personification',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on the use of personification based on IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 10,
    maxWords: 100,
    expectedElements: ['personification'],
  },

  // ========================================
  // SENSORY LANGUAGE PROMPTS (3)
  // ========================================
  'sensory-1': {
    category: 'Sensory Language',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on the use of 3 different types of sensory language based on IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 15,
    maxWords: 150,
    expectedElements: ['sensory language', 'sight', 'sound', 'touch', 'taste', 'smell'],
  },
  'sensory-2': {
    category: 'Sensory Language',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on the use of 3 different types of sensory language based on IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 15,
    maxWords: 150,
    expectedElements: ['sensory language', 'sight', 'sound', 'touch', 'taste', 'smell'],
  },
  'sensory-3': {
    category: 'Sensory Language',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on the use of 3 different types of sensory language based on IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 15,
    maxWords: 150,
    expectedElements: ['sensory language', 'sight', 'sound', 'touch', 'taste', 'smell'],
  },

  // ========================================
  // SENTENCE OPENERS / ISPACED (3)
  // ========================================
  'ispaced-1': {
    category: 'Sentence Openers (ISPACED)',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK, who understands that I,S,P,A,C,E,D is a mnemonic for varying sentence openers. Based on the sentence – The boy walked into the bakery - give very short, child-friendly feedback on all 7 ISPACED sentence openers.',
    requiresImage: false,
    minWords: 50,
    maxWords: 300,
    baseSentence: 'The boy walked into the bakery',
    expectedElements: ['ISPACED', 'sentence variety', 'openers'],
  },
  'ispaced-2': {
    category: 'Sentence Openers (ISPACED)',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK, who understands that I,S,P,A,C,E,D is a mnemonic for varying sentence openers. Based on the sentence – The girl sat down in the classroom - give very short, child-friendly feedback on all 7 ISPACED sentence openers.',
    requiresImage: false,
    minWords: 50,
    maxWords: 300,
    baseSentence: 'The girl sat down in the classroom',
    expectedElements: ['ISPACED', 'sentence variety', 'openers'],
  },
  'ispaced-3': {
    category: 'Sentence Openers (ISPACED)',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK, who understands that I,S,P,A,C,E,D is a mnemonic for varying sentence openers. Based on the sentence – Sam and Ella climbed the hill - give very short, child-friendly feedback on all 7 ISPACED sentence openers.',
    requiresImage: false,
    minWords: 50,
    maxWords: 300,
    baseSentence: 'Sam and Ella climbed the hill',
    expectedElements: ['ISPACED', 'sentence variety', 'openers'],
  },

  // ========================================
  // CHARACTER DESCRIPTION (3)
  // ========================================
  'character-1': {
    category: 'Character Description',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on description of IMAGE REFERENCE where the focus is on at least two of the character\'s most interesting features.',
    requiresImage: true,
    minWords: 20,
    maxWords: 150,
    expectedElements: ['character description', 'descriptive language', 'interesting features'],
  },
  'character-2': {
    category: 'Character Description',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on description of IMAGE REFERENCE where the focus is on at least two of the character\'s most interesting features.',
    requiresImage: true,
    minWords: 20,
    maxWords: 150,
    expectedElements: ['character description', 'descriptive language', 'interesting features'],
  },
  'character-3': {
    category: 'Character Description',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on description of IMAGE REFERENCE where the focus is on at least two of the character\'s most interesting features.',
    requiresImage: true,
    minWords: 20,
    maxWords: 150,
    expectedElements: ['character description', 'descriptive language', 'interesting features'],
  },

  // ========================================
  // SETTING DESCRIPTION (3)
  // ========================================
  'setting-1': {
    category: 'Setting Description',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on descriptive writing where the focus is on at least two senses, interesting vocabulary and one simile or metaphor to describe IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 30,
    maxWords: 200,
    expectedElements: ['setting description', 'sensory language', 'simile', 'metaphor', 'vocabulary'],
  },
  'setting-2': {
    category: 'Setting Description',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on descriptive writing where the focus is on at least two senses, interesting vocabulary and one simile or metaphor to describe IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 30,
    maxWords: 200,
    expectedElements: ['setting description', 'sensory language', 'simile', 'metaphor', 'vocabulary'],
  },
  'setting-3': {
    category: 'Setting Description',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Give very short, child-friendly feedback on descriptive writing where the focus is on at least two senses, interesting vocabulary and one simile or metaphor to describe IMAGE REFERENCE.',
    requiresImage: true,
    minWords: 30,
    maxWords: 200,
    expectedElements: ['setting description', 'sensory language', 'simile', 'metaphor', 'vocabulary'],
  },

  // ========================================
  // BRONZE BEGINNERS (4)
  // ========================================
  'bronze-alone': {
    category: 'Bronze Beginners',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story titled "Alone" against Key Stage 2 English National Curriculum standards. Give constructive, child-friendly feedback on story structure, vocabulary choices, and use of descriptive language. Focus on: clear beginning/middle/end, character development, sensory details, and sentence variety.',
    requiresImage: false,
    minWords: 100,
    maxWords: 500,
    expectedElements: ['story structure', 'character', 'descriptive language', 'sentence variety'],
  },
  'bronze-sweet-shop': {
    category: 'Bronze Beginners',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story that begins with "It all started when..." against Key Stage 2 English National Curriculum standards. Give constructive, child-friendly feedback on narrative flow, use of dialogue, and descriptive techniques. Focus on: engaging opening, plot development, character actions, and use of interesting vocabulary.',
    requiresImage: false,
    minWords: 100,
    maxWords: 500,
    expectedElements: ['narrative flow', 'dialogue', 'plot', 'vocabulary'],
  },
  'bronze-new-pupil': {
    category: 'Bronze Beginners',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story titled "The New Pupil" against Key Stage 2 English National Curriculum standards. Give constructive, child-friendly feedback on character introduction, emotional expression, and story pacing. Focus on: how the character is introduced, feelings shown not told, and appropriate story length.',
    requiresImage: false,
    minWords: 100,
    maxWords: 500,
    expectedElements: ['character introduction', 'emotions', 'pacing', 'show not tell'],
  },
  'bronze-wizard': {
    category: 'Bronze Beginners',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story that begins with "My quest to find the wizard..." against Key Stage 2 English National Curriculum standards. Give constructive, child-friendly feedback on adventure narrative, descriptive settings, and use of action. Focus on: quest structure, setting descriptions, exciting action sequences, and satisfying conclusion.',
    requiresImage: false,
    minWords: 100,
    maxWords: 500,
    expectedElements: ['adventure narrative', 'setting', 'action', 'conclusion'],
  },

  // ========================================
  // SILVER STARTERS (4)
  // ========================================
  'silver-everything-changed': {
    category: 'Silver Starters',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story about "The day everything changed" for developing writers. Give constructive, child-friendly feedback on creating dramatic impact, character reactions, and effective pacing. Focus on: building tension, showing transformation, varied sentence structures, and advanced vocabulary choices.',
    requiresImage: false,
    minWords: 100,
    maxWords: 500,
    expectedElements: ['dramatic impact', 'character development', 'tension', 'advanced vocabulary'],
  },
  'silver-lost': {
    category: 'Silver Starters',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story titled "Lost" for developing writers. Give constructive, child-friendly feedback on building suspense, emotional depth, and problem-solving narrative. Focus on: creating atmosphere, character feelings and thoughts, use of descriptive techniques, and resolution.',
    requiresImage: false,
    minWords: 100,
    maxWords: 500,
    expectedElements: ['suspense', 'emotional depth', 'atmosphere', 'resolution'],
  },
  'silver-weekend': {
    category: 'Silver Starters',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this recount "My weekend away" for developing writers. Give constructive, child-friendly feedback on chronological ordering, personal voice, and vivid descriptions. Focus on: time connectives, first-person perspective, sensory details, and engaging the reader.',
    requiresImage: false,
    minWords: 100,
    maxWords: 600,
    expectedElements: ['chronological order', 'personal voice', 'time connectives', 'sensory details'],
  },
  'silver-pet-letter': {
    category: 'Silver Starters',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this persuasive letter about having a pet for developing writers. Give constructive, child-friendly feedback on persuasive techniques, letter structure, and supporting arguments. Focus on: clear viewpoint, reasons and evidence, counter-arguments, persuasive language features, and appropriate letter format.',
    requiresImage: false,
    minWords: 150,
    maxWords: 600,
    expectedElements: ['persuasive techniques', 'letter structure', 'arguments', 'formal language'],
  },

  // ========================================
  // GOLD PROMPTS (4)
  // ========================================
  'gold-hobby': {
    category: 'Gold',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this piece about "My favourite hobby" for confident writers. Give constructive, child-friendly feedback on descriptive detail, enthusiasm, and technical accuracy. Focus on: vivid descriptions that engage the reader, explaining why it matters, varied punctuation, and sophisticated vocabulary.',
    requiresImage: false,
    minWords: 100,
    maxWords: 500,
    expectedElements: ['descriptive detail', 'personal engagement', 'technical accuracy', 'sophisticated vocabulary'],
  },
  'gold-accident': {
    category: 'Gold',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story "The accident" for confident writers. Give constructive, child-friendly feedback on dramatic techniques, character reactions under pressure, and narrative control. Focus on: building tension effectively, showing not telling emotions, varied sentence lengths for impact, and believable character responses.',
    requiresImage: false,
    minWords: 150,
    maxWords: 600,
    expectedElements: ['dramatic techniques', 'tension', 'show not tell', 'narrative control'],
  },
  'gold-person': {
    category: 'Gold',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this character description of a person you know for confident writers. Give constructive, child-friendly feedback on characterisation depth, specific details, and engaging style. Focus on: unique character traits, physical and personality features, specific examples that reveal character, and engaging writing voice.',
    requiresImage: false,
    minWords: 100,
    maxWords: 600,
    expectedElements: ['characterisation', 'specific details', 'personality traits', 'writing voice'],
  },
  'gold-playground': {
    category: 'Gold',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story "The empty playground in the park" for confident writers. Give constructive, child-friendly feedback on atmosphere creation, mystery elements, and descriptive power. Focus on: creating an eerie/mysterious atmosphere, use of pathetic fallacy, varied sentence structures, and building intrigue.',
    requiresImage: false,
    minWords: 150,
    maxWords: 700,
    expectedElements: ['atmosphere', 'mystery', 'pathetic fallacy', 'intrigue'],
  },

  // ========================================
  // PLATINUM PROMPTS (4)
  // ========================================
  'platinum-robot': {
    category: 'Platinum',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story "The broken robot" for advanced writers. Give constructive, child-friendly feedback on original ideas, complex narrative structure, and sophisticated writing techniques. Focus on: unique plot development, complex characterisation, advanced literary devices (metaphor, symbolism), varied and complex sentences, and precise vocabulary choices.',
    requiresImage: false,
    minWords: 150,
    maxWords: 600,
    expectedElements: ['original ideas', 'complex narrative', 'literary devices', 'precise vocabulary'],
  },
  'platinum-new-school': {
    category: 'Platinum',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story "A new school" for advanced writers. Give constructive, child-friendly feedback on emotional authenticity, narrative voice, and sophisticated structure. Focus on: genuine emotional responses, consistent narrative perspective, flashback or non-linear structure if used, and mature handling of themes.',
    requiresImage: false,
    minWords: 150,
    maxWords: 700,
    expectedElements: ['emotional authenticity', 'narrative voice', 'sophisticated structure', 'mature themes'],
  },
  'platinum-bedroom': {
    category: 'Platinum',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this description "Describe your bedroom" for advanced writers. Give constructive, child-friendly feedback on descriptive mastery, personal voice, and literary quality. Focus on: multi-sensory descriptions, metaphorical language that reveals character, varied sentence structures for effect, and evocative vocabulary that creates mood.',
    requiresImage: false,
    minWords: 150,
    maxWords: 700,
    expectedElements: ['descriptive mastery', 'multi-sensory', 'metaphorical language', 'mood'],
  },
  'platinum-panicked': {
    category: 'Platinum',
    systemPrompt: 'Act as an 11+ creative writing examiner for selective schools in the UK. Assess this story "The day they all panicked" for advanced writers. Give constructive, child-friendly feedback on mass emotion portrayal, pace control, and narrative complexity. Focus on: depicting multiple characters\' responses, controlling pace through syntax and structure, sophisticated vocabulary, and maintaining coherence in chaos.',
    requiresImage: false,
    minWords: 200,
    maxWords: 800,
    expectedElements: ['multiple perspectives', 'pace control', 'narrative complexity', 'coherence'],
  },
};

/**
 * Get a prompt template by type
 */
export function getPromptTemplate(promptType: string): import('../types').PromptTemplate | null {
  return PROMPT_TEMPLATES[promptType] || null;
}

/**
 * Get all available prompt types
 */
export function getAllPromptTypes(): string[] {
  return Object.keys(PROMPT_TEMPLATES);
}

/**
 * Get prompts by category
 */
export function getPromptsByCategory(category: string): Record<string, import('../types').PromptTemplate> {
  const prompts: Record<string, import('../types').PromptTemplate> = {};
  for (const [key, template] of Object.entries(PROMPT_TEMPLATES)) {
    if (template.category === category) {
      prompts[key] = template;
    }
  }
  return prompts;
}
