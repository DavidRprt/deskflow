# Guía Universal de Estándares y Convenciones de Código

## 📋 Stack Tecnológico Base

- Next.js 14+ (App Router)
- React 18+
- JavaScript/TypeScript
- Tailwind CSS
- PostgreSQL + Sequelize ORM
- Framer Motion
- Lucide React (iconos)
- Shadcn/ui (componentes UI)

---

## 🗂️ Estructura de Carpetas Estándar

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Grupos de rutas opcionales
│   ├── dashboard/
│   │   └── page.jsx
│   ├── api/                 # API Routes
│   │   └── users/
│   │       └── route.js
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
│
├── components/              # Componentes organizados por dominio
│   ├── users/
│   │   ├── UserCard.jsx
│   │   └── UserForm.jsx
│   ├── dashboard/
│   │   └── StatsCard.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── ui/                  # Componentes UI base (shadcn)
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       └── dialog.jsx
│
├── services/                # Lógica de negocio
│   ├── users/
│   │   ├── userService.js
│   │   └── userQueries.js
│   ├── auth/
│   │   └── authService.js
│   └── payments/
│       └── paymentService.js
│
├── actions/                 # Next.js Server Actions
│   ├── userActions.js
│   └── authActions.js
│
├── lib/                     # Utilidades y configuraciones
│   ├── utils.js
│   ├── db.js
│   ├── validations.js
│   └── constants.js
│
├── models/                  # Modelos Sequelize
│   ├── index.js
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
│
├── hooks/                   # Custom React hooks
│   ├── useUser.js
│   ├── useAuth.js
│   └── useOutsideClick.js
│
└── types/                   # TypeScript types (opcional)
    └── index.ts
```

---

## 📝 Convenciones de Nombres

### Archivos y Carpetas
```
✅ Correcto
components/UserCard.jsx
services/users/userService.js
hooks/useAuth.js
models/User.js
lib/utils.js

❌ Incorrecto
components/user-card.jsx
services/UserService.js
hooks/UseAuth.js
models/user.js
lib/Utils.js
```

**Reglas:**
- **Componentes:** `PascalCase.jsx`
- **Services:** `camelCase.js` dentro de carpeta por dominio
- **Hooks:** `useCamelCase.js`
- **Modelos:** `PascalCase.js`
- **Utils/Helpers:** `camelCase.js`
- **Actions:** `camelCase.js`
- **Carpetas:** `lowercase` o `kebab-case`

### Variables, Funciones y Constantes
```javascript
// Variables y funciones: camelCase (inglés)
const userName = "John"
const isActive = true
const totalAmount = 100

function getUserById(id) {}
const handleSubmit = () => {}

// Constantes: UPPER_SNAKE_CASE (inglés)
const MAX_RETRIES = 3
const API_BASE_URL = "https://api.example.com"
const DEFAULT_TIMEOUT = 5000

// Componentes: PascalCase
function UserCard() {}
export default DashboardLayout
```

---

## 🗄️ Base de Datos - Sequelize

### Configuración
```javascript
// src/lib/db.js
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

export default sequelize
```

### Estructura de Modelos
```javascript
// src/models/User.js
import { DataTypes } from 'sequelize'
import sequelize from '@/lib/db'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'guest'),
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
})

export default User
```

### Relaciones
```javascript
// src/models/index.js
import sequelize from '@/lib/db'
import User from './User'
import Post from './Post'
import Comment from './Comment'

User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
})

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
})

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',
})

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
})

if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true })
}

export { sequelize, User, Post, Comment }
```

---

## 🔌 Services - Estructura por Carpetas

### Organización de Services
```
services/
├── users/
│   ├── userService.js       # Operaciones CRUD principales
│   └── userQueries.js       # Queries complejas específicas
├── auth/
│   ├── authService.js
│   └── tokenService.js
└── payments/
    └── paymentService.js
```

### Template de Service
```javascript
// src/services/users/userService.js
import { User, Post } from '@/models'
import { Op } from 'sequelize'

/**
 * Get all users with their posts
 */
export async function getUsers() {
  try {
    const users = await User.findAll({
      include: [{
        model: Post,
        as: 'posts',
      }],
      order: [['createdAt', 'DESC']],
    })
    
    return users.map(user => user.toJSON())
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id) {
  try {
    const user = await User.findByPk(id, {
      include: [{ model: Post, as: 'posts' }],
    })
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user.toJSON()
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

/**
 * Create new user
 */
export async function createUser(userData) {
  try {
    const user = await User.create(userData)
    return user.toJSON()
  } catch (error) {
    console.error('Error creating user:', error)
    
    if (error.name === 'SequelizeValidationError') {
      throw new Error('Invalid data: ' + error.errors.map(e => e.message).join(', '))
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Email already exists')
    }
    
    throw new Error('Failed to create user')
  }
}

/**
 * Update user
 */
export async function updateUser(id, updates) {
  try {
    const user = await User.findByPk(id)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    await user.update(updates)
    return user.toJSON()
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

/**
 * Delete user
 */
export async function deleteUser(id) {
  try {
    const user = await User.findByPk(id)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    await user.destroy()
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

/**
 * Search users by name or email
 */
export async function searchUsers(query) {
  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit: 20,
    })
    
    return users.map(user => user.toJSON())
  } catch (error) {
    console.error('Error searching users:', error)
    throw error
  }
}
```

### Queries Complejas Separadas
```javascript
// src/services/users/userQueries.js
import { User, Post, Comment } from '@/models'
import { Op } from 'sequelize'
import sequelize from '@/lib/db'

/**
 * Get users with post statistics
 */
export async function getUsersWithStats() {
  try {
    const users = await User.findAll({
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('posts.id')),
            'postCount'
          ]
        ]
      },
      include: [{
        model: Post,
        as: 'posts',
        attributes: [],
      }],
      group: ['User.id'],
    })
    
    return users.map(user => user.toJSON())
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw error
  }
}

/**
 * Get most active users in date range
 */
export async function getMostActiveUsers(startDate, endDate, limit = 10) {
  try {
    const users = await User.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('posts.id')), 'activityScore']
        ]
      },
      include: [{
        model: Post,
        as: 'posts',
        attributes: [],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      }],
      group: ['User.id'],
      order: [[sequelize.literal('activityScore'), 'DESC']],
      limit,
    })
    
    return users.map(user => user.toJSON())
  } catch (error) {
    console.error('Error fetching active users:', error)
    throw error
  }
}
```

---

## ⚡ Server Actions

```javascript
// src/actions/userActions.js
"use server"

import { revalidatePath } from "next/cache"
import { createUser, updateUser, deleteUser } from "@/services/users/userService"

export async function createUserAction(formData) {
  try {
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
    }
    
    const user = await createUser(userData)
    
    revalidatePath('/users')
    return { success: true, data: user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateUserAction(id, updates) {
  try {
    const user = await updateUser(id, updates)
    
    revalidatePath('/users')
    revalidatePath(`/users/${id}`)
    return { success: true, data: user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteUserAction(id) {
  try {
    await deleteUser(id)
    
    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

## 🎨 Componentes React

### Template Base
```javascript
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function ComponentName({ 
  data,
  onAction,
  className,
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    // Setup logic
  }, [])
  
  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  
  if (!data) return null
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 p-4",
        className
      )}
      {...props}
    >
      <Check className="w-5 h-5" />
    </div>
  )
}
```

### Server vs Client Components
```javascript
// Server Component (default)
import { getUsers } from "@/services/users/userService"

export default async function UsersPage() {
  const users = await getUsers()
  
  return (
    <div>
      <h1>Usuarios</h1>
      <UserList users={users} />
    </div>
  )
}

// Client Component (interactive)
"use client"

import { useState } from "react"

export default function UserCard({ user }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {user.name}
    </div>
  )
}
```

---

## 🎣 Custom Hooks

```javascript
// src/hooks/useUser.js
"use client"

import { useState, useEffect } from "react"

export function useUser(userId) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }
        
        const data = await response.json()
        setUser(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    if (userId) {
      fetchUser()
    }
  }, [userId])
  
  return { user, loading, error }
}
```

---

## 🎨 Estilos con Tailwind

### Orden de Clases
```javascript
className={cn(
  // Layout
  "flex items-center justify-between",
  // Sizing
  "w-full h-screen max-w-md",
  // Spacing
  "p-4 gap-2",
  // Typography
  "text-sm font-medium",
  // Visual
  "bg-white border border-gray-200 rounded-lg shadow-sm",
  // Animations
  "transition-all duration-200",
  // States
  "hover:bg-gray-50 dark:bg-neutral-900",
  className
)}
```

### Variantes con CVA
```javascript
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-700",
        outline: "border border-gray-300 hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

---

## 📦 Orden de Imports

```javascript
// 1. React and Next.js
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

// 2. External libraries
import { motion } from "framer-motion"
import { Check, X, Mail } from "lucide-react"

// 3. UI components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 4. Local components
import UserCard from "@/components/users/UserCard"
import Sidebar from "@/components/layout/Sidebar"

// 5. Custom hooks
import { useUser } from "@/hooks/useUser"

// 6. Services and actions
import { getUsers } from "@/services/users/userService"
import { createUserAction } from "@/actions/userActions"

// 7. Utils
import { cn } from "@/lib/utils"

// 8. Types
import type { User } from "@/types"
```

---

## 💬 Comentarios

### Reglas de Comentarios

**✅ SIEMPRE en inglés**
**✅ Solo cuando añadan valor al código**
**✅ Explicar el "por qué", no el "qué"**

```javascript
// ✅ Correcto - Explica razón de negocio
export async function processPayment(amount) {
  // Stripe requires amounts in cents
  const amountInCents = amount * 100
  
  // Retry logic for network failures
  const maxRetries = 3
  
  return await stripe.charge(amountInCents)
}

// ✅ Correcto - JSDoc para funciones públicas
/**
 * Calculate user's total spent amount
 * @param {string} userId - User ID
 * @param {Date} startDate - Period start
 * @returns {Promise<number>} Total amount in USD
 */
export async function calculateTotalSpent(userId, startDate) {
  // Implementation
}

// ❌ Incorrecto - Obvio, no añade valor
// Get user by id
const user = await getUserById(id)

// ❌ Incorrecto - En español
// Obtiene el usuario por ID
const user = await getUserById(id)

// ❌ NUNCA usar estos comentarios
// Aquí le dejo el código
// Espero que le sirva
// Saludos
```

### Cuándo NO comentar
```javascript
// ❌ No comentar código obvio
// Set loading to true
setLoading(true)

// ❌ No comentar nombres descriptivos
// Get all active users
const activeUsers = users.filter(user => user.isActive)

// ✅ Usar nombres descriptivos en lugar de comentarios
const activeUsers = users.filter(user => user.isActive)
```

---

## 🎯 Iconos con Lucide

```javascript
import { 
  Mail, 
  Phone, 
  Calendar, 
  Check, 
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Search,
  Plus,
  Edit,
  Trash
} from "lucide-react"

// Basic usage
<Mail className="w-5 h-5" />
<Phone className="w-4 h-4 text-gray-500" />

// With states
<Check className="w-6 h-6 text-green-500" />
<X className="w-6 h-6 text-red-500" />

// Common icons:
// - Users, User, UserPlus
// - Mail, Phone, Calendar
// - Check, X, AlertCircle
// - Search, Filter, Plus
// - Edit, Trash, Download
// - ChevronDown/Up/Left/Right
// - Settings, LogOut, Menu
```

---

## ✅ Mejores Prácticas

### Manejo de Errores
```javascript
// ✅ Specific error handling
try {
  const user = await createUser(data)
  return { success: true, data: user }
} catch (error) {
  if (error.name === 'SequelizeValidationError') {
    return { success: false, error: 'Invalid data format' }
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return { success: false, error: 'Email already registered' }
  }
  return { success: false, error: 'Failed to create user' }
}

// ❌ Generic catch
try {
  const user = await createUser(data)
} catch (error) {
  console.log('error')
}
```

### Validación
```javascript
// src/lib/validations.js
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
})

// Usage
const result = userSchema.safeParse(data)
if (!result.success) {
  return { error: result.error.errors }
}
```

### Optimización
```javascript
// ✅ Eager loading
const users = await User.findAll({
  include: [{ model: Post, as: 'posts' }],
})

// ❌ N+1 queries
const users = await User.findAll()
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } })
}
```

---

## 🚀 Variables de Entorno

```bash
# .env.local
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 📚 Comandos Útiles

```bash
# Development
npm run dev

# Build
npm run build
npm start

# Sequelize
npx sequelize-cli migration:generate --name migration-name
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli seed:generate --name seed-name
npx sequelize-cli db:seed:all
```