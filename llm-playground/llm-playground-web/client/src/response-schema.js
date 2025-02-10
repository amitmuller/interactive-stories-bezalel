// responseSchema.js

/**
 * See OpenAI docs: https://platform.openai.com/docs/guides/structured-outputs#supported-schemas
 * See JSON Schema docs: https://json-schema.org/understanding-json-schema
 */
export const responseSchema = {
    name: 'story_schema',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        storyText: {
          type: 'string',
          description: `
            The text Dr. Morgan provides to John, unveiling or referencing his past,
            or presenting a scenario from scenarioPool (ends with a question).
            Must be short and include at least one question.
            Avoid curly braces.
          `,
        },
        callToAction: {
          type: 'string',
          description: `
            A short suggestion for John's next step.
            E.g., "You could reflect more on..." or "Feel free to explain your feelings..."
            No curly braces.
          `,
        },
        storyEvent: {
          type: 'string',
          description: `
            A short piece of narrative that unfolds no matter John's input,
            revealing more context or pushing the story forward.
            No curly braces.
          `,
        },
        playerEngagement: {
          type: 'number',
          description: `
            A float between 0 and 1, where 0 is bored and 1 is highly engaged.
          `,
        },
        playerSentiment: {
          type: 'array',
          description: `
            Array of strings describing John's emotional state, or null if unclear.
          `,
          items: {
            type: 'string',
            enum: [
              'ambiguous',
              'joy',
              'irritation',
              'sadness',
              'fear',
              'surprise',
              'disgust',
              'empathy',
            ],
          },
        },
        goalProgress: {
          type: 'number',
          description: `
            A float between 0 and 1 for how close John is to his goal of finding closure
            and a new career path. 0 = not at all, 1 = fully achieved.
          `,
        },
        chosenCategory: {
          type: 'string',
          enum: [
            'Greedy',
            'Aggressive',
            'Extraversion',
            'Agreeableness',
            'Neuroticism'
          ],
          description: `
            EXACTLY ONE category that matches John's latest input logically, never random.
          `,
        },
      },
      required: [
        'storyText',
        'callToAction',
        'storyEvent',
        'goalProgress',
        'playerEngagement',
        'playerSentiment',
        'chosenCategory'
      ],
      additionalProperties: false,
    },
  };
  