/**
 * @fileoverview Swagger Configuration
 * @module config/swagger
 * @description Swagger/OpenAPI configuration for API documentation
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Mama's Kitchen API",
      version: '1.0.0',
      description: `
        RESTful API backend for Mama's Kitchen - A meal ordering platform connecting 
        customers with local home-based caterers and mess services.
        
        ## Features
        - 🔐 JWT Authentication & Authorization
        - 👤 Role-based Access Control (Customer, Owner, Mess)
        - 🍽️ Meal & Menu Management
        - 🏪 Mess Management
        - 📦 Order Processing
        - ⭐ Reviews & Ratings
        - 📧 Contact Support
        
        ## Authentication
        This API uses JWT tokens for authentication. Include the token in the Authorization header:
        \`Authorization: Bearer <your-token>\`
        
        Alternatively, tokens are also sent as httpOnly cookies.
      `,
      contact: {
        name: 'Akshay Patil',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.mamaskitchen.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in httpOnly cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '648a1b2c3d4e5f6g7h8i9j0k',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              enum: ['CUSTOMER', 'OWNER', 'MESS'],
              example: 'CUSTOMER',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CustomerProfile: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            userId: {
              type: 'string',
            },
            phone: {
              type: 'string',
              pattern: '^[6-9]\\d{9}$',
              example: '9876543210',
            },
            address: {
              type: 'string',
              minLength: 10,
              maxLength: 300,
              example: '123 Main Street, Nashik',
            },
            isProfileCompleted: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        OwnerProfile: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            userId: {
              type: 'string',
            },
            phone: {
              type: 'string',
              pattern: '^[6-9]\\d{9}$',
              example: '9876543210',
            },
            address: {
              type: 'string',
              minLength: 10,
              maxLength: 300,
              example: '456 Business Park, Nashik',
            },
            isProfileCompleted: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Mess: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            ownerId: {
              type: 'string',
            },
            name: {
              type: 'string',
              example: 'Sunrise Mess',
            },
            description: {
              type: 'string',
              example: 'Serving delicious homestyle meals',
            },
            address: {
              type: 'string',
              example: '789 Food Street, Nashik',
            },
            phone: {
              type: 'string',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Meal: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            messId: {
              type: 'string',
            },
            name: {
              type: 'string',
              example: 'Thali Special',
            },
            description: {
              type: 'string',
              example: 'Dal, Rice, Roti, Vegetables',
            },
            price: {
              type: 'number',
              example: 120,
            },
            category: {
              type: 'string',
              enum: ['VEG', 'NON_VEG', 'VEGAN'],
              example: 'VEG',
            },
            isAvailable: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            customerId: {
              type: 'string',
            },
            messId: {
              type: 'string',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  mealId: {
                    type: 'string',
                  },
                  quantity: {
                    type: 'number',
                  },
                  price: {
                    type: 'number',
                  },
                },
              },
            },
            totalAmount: {
              type: 'number',
              example: 240,
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'],
              example: 'PENDING',
            },
            deliveryAddress: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            customerId: {
              type: 'string',
            },
            messId: {
              type: 'string',
            },
            orderId: {
              type: 'string',
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              example: 4,
            },
            comment: {
              type: 'string',
              example: 'Great food and service!',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            statusCode: {
              type: 'number',
              example: 400,
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and registration endpoints',
      },
      {
        name: 'Profile',
        description: 'User profile management (Customer & Owner)',
      },
      {
        name: 'Mess',
        description: 'Mess/Restaurant management endpoints',
      },
      {
        name: 'Menu',
        description: 'Meal and menu management endpoints',
      },
      {
        name: 'Orders',
        description: 'Order processing and management',
      },
      {
        name: 'Reviews',
        description: 'Review and rating endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Contact',
        description: 'Contact support endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/docs/*.js'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
