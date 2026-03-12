export const components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT authorization header using the Bearer scheme.'
    },
    cookieAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken'
    }
  },
  schemas: {
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        userName: { type: 'string', example: 'johndoe' },
        email: { type: 'string', example: 'john@example.com' },
        role: { type: 'string', enum: ['user', 'storeManager', 'admin', 'superAdmin'] },
        profilePicture: { type: 'string' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    Restaurant: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        name: { type: 'string', example: 'Pizza Palace' },
        description: { type: 'string', example: 'Best pizza in town' },
        address: { type: 'string', example: '123 Main St' },
        city: { type: 'string', example: 'New York' },
        rating: { type: 'number', example: 4.5 },
        priceRange: { type: 'string', example: '$$' },
        images: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    Category: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        name: { type: 'string', example: 'Pizza' },
        description: { type: 'string', example: 'Delicious pizzas' },
        restaurantId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        isActive: { type: 'boolean', example: true },
        order: { type: 'number', example: 1 }
      }
    },
    Menu: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        name: { type: 'string', example: 'Lunch Menu' },
        restaurantId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              isAvailable: { type: 'boolean' }
            }
          }
        },
        isActive: { type: 'boolean', example: true }
      }
    },
    Error: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Error message here' },
        errors: { type: 'array', items: { type: 'object' } }
      }
    }
  },
  responses: {
    Unauthorized: {
      description: 'Unauthorized - Invalid or missing authentication',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
          example: { success: false, message: 'Unauthorized' }
        }
      }
    },
    Forbidden: {
      description: 'Forbidden - Insufficient permissions',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
          example: { success: false, message: 'Forbidden' }
        }
      }
    },
    NotFound: {
      description: 'Not Found - Resource not found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
          example: { success: false, message: 'Resource not found' }
        }
      }
    },
    ValidationError: {
      description: 'Validation Error - Invalid input data',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
          example: { success: false, message: 'Validation failed', errors: [] }
        }
      }
    }
  }
};
