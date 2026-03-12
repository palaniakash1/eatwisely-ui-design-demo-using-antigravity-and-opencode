import Joi from 'joi';

export const authValidators = {
  signup: Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  signin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  google: Joi.object({
    idToken: Joi.string().required()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  sessionIdParam: Joi.object({
    sessionId: Joi.string().required()
  }),

  userIdParam: Joi.object({
    userId: Joi.string().required()
  }),

  userIdSessionIdParam: Joi.object({
    userId: Joi.string().required(),
    sessionId: Joi.string().required()
  })
};

export const userValidators = {
  create: Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'storeManager', 'admin', 'superAdmin').default('user'),
    restaurantId: Joi.string().allow(null, '')
  }),

  update: Joi.object({
    userName: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    role: Joi.string().valid('user', 'storeManager', 'admin', 'superAdmin'),
    isActive: Joi.boolean()
  }),

  userIdParam: Joi.object({
    id: Joi.string().required()
  })
};

export const restaurantValidators = {
  create: Joi.object({
    name: Joi.string().required(),
    slug: Joi.string(),
    description: Joi.string(),
    cuisineType: Joi.string(),
    priceRange: Joi.string().valid('$', '$$', '$$$', '$$$$'),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    }),
    location: Joi.object({
      type: Joi.string().valid('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2)
    }),
    contactPhone: Joi.string(),
    contactEmail: Joi.string(),
    openingHours: Joi.object(),
    images: Joi.array().items(Joi.string()),
    isFeatured: Joi.boolean(),
    status: Joi.string().valid('pending', 'approved', 'rejected')
  }),

  update: Joi.object({
    name: Joi.string(),
    slug: Joi.string(),
    description: Joi.string(),
    cuisineType: Joi.string(),
    priceRange: Joi.string().valid('$', '$$', '$$$', '$$$$'),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    }),
    location: Joi.object({
      type: Joi.string().valid('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2)
    }),
    contactPhone: Joi.string(),
    contactEmail: Joi.string(),
    openingHours: Joi.object(),
    images: Joi.array().items(Joi.string()),
    isFeatured: Joi.boolean()
  }),

  restaurantIdParam: Joi.object({
    id: Joi.string().required()
  }),

  slugParam: Joi.object({
    slug: Joi.string().required()
  }),

  nearbyQuery: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    radius: Joi.number().min(0).max(50000).default(10000)
  })
};

export const categoryValidators = {
  create: Joi.object({
    name: Joi.string().required(),
    slug: Joi.string(),
    description: Joi.string(),
    restaurantId: Joi.string(),
    isActive: Joi.boolean()
  }),

  update: Joi.object({
    name: Joi.string(),
    slug: Joi.string(),
    description: Joi.string(),
    isActive: Joi.boolean(),
    order: Joi.number()
  }),

  categoryIdParam: Joi.object({
    id: Joi.string().required()
  }),

  reorder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        order: Joi.number().required()
      })
    ).required()
  })
};

export const menuValidators = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    restaurantId: Joi.string().required(),
    categoryId: Joi.string(),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().min(0).required(),
        isAvailable: Joi.boolean(),
        image: Joi.string()
      })
    )
  }),

  update: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    categoryId: Joi.string(),
    isActive: Joi.boolean()
  }),

  menuIdParam: Joi.object({
    id: Joi.string().required()
  }),

  restaurantIdParam: Joi.object({
    restaurantId: Joi.string().required()
  }),

  addItem: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0).required(),
    isAvailable: Joi.boolean().default(true),
    image: Joi.string()
  }),

  updateItem: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().min(0),
    isAvailable: Joi.boolean(),
    image: Joi.string()
  }),

  itemIdParam: Joi.object({
    itemId: Joi.string().required()
  })
};

export const reviewValidators = {
  create: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string()
  }),

  update: Joi.object({
    rating: Joi.number().min(1).max(5),
    comment: Joi.string(),
    isApproved: Joi.boolean()
  }),

  reviewIdParam: Joi.object({
    id: Joi.string().required()
  }),

  restaurantIdParam: Joi.object({
    restaurantId: Joi.string().required()
  }),

  moderate: Joi.object({
    isApproved: Joi.boolean().required(),
    moderationComment: Joi.string()
  })
};

export const adminValidators = {
  createUser: Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'storeManager', 'admin', 'superAdmin').default('user'),
    restaurantId: Joi.string().allow(null, '')
  }),

  userIdParam: Joi.object({
    userId: Joi.string().required()
  })
};

export const auditValidators = {
  listQuery: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20),
    actorId: Joi.string(),
    entityType: Joi.string(),
    action: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date()
  })
};
