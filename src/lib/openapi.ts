/**
 * @fileoverview OpenAPI 3.0 specification for the Weather App REST API.
 * Served at /api/docs and rendered via Swagger UI at /docs.
 */

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title:       'Weather App API',
    version:     '1.0.0',
    description: `REST API for the Weather App — a Next.js application that
provides real-time weather data powered by OpenWeather API
and an AI assistant powered by OpenAI GPT-4o.`,
    contact: {
      name:  'Scarfyie',
      url:   'https://github.com/Scarfyie/weather-app',
    },
  },
  servers: [
    { url: '/api', description: 'Current environment' },
  ],
  tags: [
    { name: 'Weather', description: 'Current conditions and forecast data' },
    { name: 'Geo',     description: 'City search and reverse geocoding'    },
    { name: 'AI',      description: 'AI-powered weather assistant'          },
  ],
  paths: {
    '/weather': {
      get: {
        tags:        ['Weather'],
        summary:     'Get current weather and 5-day forecast',
        description: 'Returns current conditions and a grouped 5-day forecast for the specified city. Results are cached for 5 minutes.',
        parameters: [
          {
            name:        'city',
            in:          'query',
            required:    true,
            description: 'City name to fetch weather for',
            schema:      { type: 'string', example: 'Manila' },
          },
          {
            name:        'unit',
            in:          'query',
            required:    false,
            description: 'Temperature unit system',
            schema: {
              type:    'string',
              enum:    ['metric', 'imperial'],
              default: 'metric',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful weather response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    current: {
                      type: 'object',
                      properties: {
                        city:       { type: 'string',  example: 'Manila'    },
                        country:    { type: 'string',  example: 'PH'        },
                        temp:       { type: 'integer', example: 32          },
                        feelsLike:  { type: 'integer', example: 38          },
                        humidity:   { type: 'integer', example: 75          },
                        windSpeed:  { type: 'number',  example: 3.5         },
                        condition: {
                          type: 'object',
                          properties: {
                            main:        { type: 'string', example: 'Clouds'          },
                            description: { type: 'string', example: 'scattered clouds'},
                            icon:        { type: 'string', example: '03d'             },
                          },
                        },
                      },
                    },
                    forecast: {
                      type: 'object',
                      properties: {
                        city:     { type: 'string', example: 'Manila' },
                        country:  { type: 'string', example: 'PH'     },
                        forecast: {
                          type:  'array',
                          items: {
                            type: 'object',
                            properties: {
                              date:      { type: 'string',  example: 'Monday' },
                              dateShort: { type: 'string',  example: 'Mon 12' },
                              tempMin:   { type: 'integer', example: 26       },
                              tempMax:   { type: 'integer', example: 34       },
                              pop:       { type: 'number',  example: 0.4      },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Missing or invalid query parameters' },
          '404': { description: 'City not found'                      },
          '500': { description: 'Internal server error'               },
        },
      },
    },
    '/geocode': {
      get: {
        tags:        ['Geo'],
        summary:     'Reverse geocode coordinates to city name',
        description: 'Converts latitude and longitude into a city name using the OpenWeather Geo API.',
        parameters: [
          {
            name: 'lat', in: 'query', required: true,
            description: 'Latitude',
            schema: { type: 'number', example: 14.5995 },
          },
          {
            name: 'lon', in: 'query', required: true,
            description: 'Longitude',
            schema: { type: 'number', example: 120.9842 },
          },
        ],
        responses: {
          '200': {
            description: 'City name resolved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    city: { type: 'string', example: 'Manila' },
                  },
                },
              },
            },
          },
          '400': { description: 'Missing lat or lon'           },
          '404': { description: 'No city found at coordinates' },
          '500': { description: 'Internal server error'        },
        },
      },
    },
    '/cities': {
      get: {
        tags:        ['Geo'],
        summary:     'Search cities by name',
        description: 'Returns up to 5 city suggestions for autocomplete. Requires at least 2 characters.',
        parameters: [
          {
            name: 'q', in: 'query', required: true,
            description: 'Search query (min 2 characters)',
            schema: { type: 'string', example: 'Man' },
          },
        ],
        responses: {
          '200': {
            description: 'List of matching cities',
            content: {
              'application/json': {
                schema: {
                  type:  'array',
                  items: {
                    type: 'object',
                    properties: {
                      name:    { type: 'string', example: 'Manila'      },
                      country: { type: 'string', example: 'PH'          },
                      state:   { type: 'string', example: 'Metro Manila' },
                      lat:     { type: 'number', example: 14.5995       },
                      lon:     { type: 'number', example: 120.9842      },
                    },
                  },
                },
              },
            },
          },
          '500': { description: 'Internal server error' },
        },
      },
    },
    '/chat': {
      post: {
        tags:        ['AI'],
        summary:     'Send a message to the AI weather assistant',
        description: 'Streams a response from GPT-4o with live weather data injected as context. Returns a plain text stream.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['messages'],
                properties: {
                  messages: {
                    type:  'array',
                    items: {
                      type: 'object',
                      properties: {
                        role:    { type: 'string', enum: ['user', 'assistant'] },
                        content: { type: 'string' },
                      },
                    },
                    example: [{ role: 'user', content: 'Should I bring an umbrella?' }],
                  },
                  weather:  {
                    type:        'object',
                    nullable:    true,
                    description: 'Current weather data injected as AI context',
                  },
                  forecast: {
                    type:        'array',
                    nullable:    true,
                    description: '5-day forecast injected as AI context',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Streaming plain text response from the AI',
            content: { 'text/plain': { schema: { type: 'string' } } },
          },
          '400': { description: 'Missing messages array' },
          '500': { description: 'AI API error'           },
        },
      },
    },
  },
}