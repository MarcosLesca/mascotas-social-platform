# AGENTS.md - Development Standards & Patterns

## 🏗️ Architecture Overview

Este proyecto sigue **Clean Architecture** con **Feature-first** y **State Management patterns** optimizados para Next.js 15 App Router.

### Core Principles
- **Clean Architecture**: Domain → Application → Infrastructure → Presentation
- **Feature-first**: Cada feature es un módulo autocontenido
- **State Management**: Mix estratégico (Server State → Server, Client State → Zustand, Form State → React Hook Form)
- **Atomic Design**: Solo como UI Kit en `shared/ui`

## 📁 Folder Structure

```
src/
├── app/                    # PURE ROUTING + LAYOUTS
│   ├── (auth)/            # Route groups
│   ├── admin/
│   ├── posts/
│   ├── api/               # API Routes (external consumption)
│   └── layout.tsx
├── features/              # FEATURE-FIRST MODULES
│   ├── posts/
│   │   ├── presentation/   # Pages/Containers
│   │   │   ├── PostsPage.tsx
│   │   │   └── index.ts
│   │   ├── components/     # UI con lógica de dominio
│   │   ├── services/       # Business Logic
│   │   ├── types/          # Domain Types
│   │   └── index.ts        # API pública controlada
│   ├── auth/
│   └── admin/
├── shared/                # CROSS-CUTTING CONCERNS
│   ├── ui/                # ATOMIC DESIGN UI KIT
│   │   ├── atoms/         # Elements básicos reutilizables
│   │   ├── molecules/      # Combinación de atoms
│   │   └── organisms/      # Componentes complejos
│   ├── hooks/             # Generic React hooks
│   ├── utils/             # Pure utilities
│   ├── constants/         # App constants
│   └── types/             # Global types
├── lib/                   # CONFIGURATION
│   ├── db.ts
│   ├── auth.ts
│   └── storage.ts
└── types/                 # GLOBAL DEFINITIONS
```

## 🎯 Core Patterns

### 1. Server-First Strategy

**✅ Pages - Pure Routing:**
```typescript
// app/posts/page.tsx - SOLO ROUTING
import { PostsPage } from '@/features/posts/presentation';

export default PostsPage;
```

**✅ Server Components - Data Fetching + Composition:**
```typescript
// features/posts/presentation/PostsPage.tsx
export default async function PostsPage() {
  const posts = await getPostsService.getAll();
  return (
    <div>
      <PostGrid posts={posts} />           {/* Server Component */}
      <PostFilters />                      {/* Client Component */}
    </div>
  );
}
```

**❌ Boundary Violations:**
```typescript
// ❌ Server Component importando Client para lógica
export default async function BadPage() {
  const [state, setState] = useState();   // ❌ Client hooks
  const ClientComp = dynamic(() => import('./Client')); // ❌ Dynamic for logic
}
```

### 2. Client Components = Islands of Interactivity

**✅ Correct Pattern:**
```typescript
// features/posts/components/PostGrid.tsx
'use client';
export function PostGrid({ posts }: { posts: Post[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Solo interactividad necesaria
}
```

**🎯 Rule: "Si no useState/useEffect, NO uses 'use client'"**

### 3. Server Actions vs API Routes

**✅ Server Actions - Forms + Mutations:**
```typescript
// features/posts/services/posts.service.ts
export async function createPost(data: CreatePostData) {
  "use server";
  const post = await postsService.create(data);
  revalidateTag("posts");     // Preferido sobre revalidatePath
  return post;
}

// Uso en form:
<form action={createPost}>
  <input name="title" />
  <Button type="submit">Create</Button>
</form>
```

**✅ API Routes - External Consumption:**
```typescript
// app/api/posts/route.ts
export async function GET() {
  const posts = await postsService.getAll();
  return NextResponse.json(posts);
}

// Client-side:
const posts = await fetch("/api/posts").then(r => r.json());
```

### 4. Data Fetching & Caching

**✅ Smart Caching Strategy:**
```typescript
async function getPostsByType(type: PostType) {
  return fetch(`${API_URL}/posts?type=${type}`, {
    next: {
      tags: [`posts-${type}`, 'posts'],  // Jerarquía de tags
      revalidate: type === 'lost' ? 60 : 1800
    }
  });
}

// Server Actions - revalidateTag
export async function createPost(data: CreatePostData) {
  const post = await postsService.create(data);
  revalidateTag("posts");      // ✅ Desacoplado y escalable
  revalidateTag("home-posts");
  return post;
}
```

**✅ Parallel Data Fetching:**
```typescript
async function PostPage({ params }: { params: { id: string } }) {
  const [post, relatedPosts, comments] = await Promise.all([
    getPostById(params.id),
    getRelatedPosts(params.id),
    getPostComments(params.id)
  ]);
  // ...
}
```

### 5. State Management

**Server State → Server Components + Cache:**
```typescript
async function HomePage() {
  const posts = await postsService.getApproved(); // Cacheado
  return <PostsList posts={posts} />;
}
```

**Client State → Zustand (Feature-specific):**
```typescript
// stores/posts-store.ts
export const postsStore = create<PostsState>((set) => ({
  posts: [],
  filters: {},
  setPosts: (posts) => set({ posts }),
  setFilters: (filters) => set({ filters }),
}));

// Uso con selectors granulares
const posts = usePostsStore(state => state.posts);
const filters = usePostsStore(state => state.filters);
```

**Form State → React Hook Form + Zod:**
```typescript
const formSchema = z.object({
  title: z.string().min(1),
  pet: petSchema,
  // ...
});
```

### 6. Atomic Design UI Kit

**🎨 Solo en `shared/ui/` - Genérico y agnóstico:**
```
shared/ui/
├── atoms/
│   ├── Button/Button.tsx
│   ├── Input/Input.tsx
│   └── index.ts
├── molecules/
│   ├── FormField/FormField.tsx
│   └── index.ts
└── organisms/
    ├── DataTable/DataTable.tsx
    └── index.ts
```

**✅ Usage in Features:**
```typescript
// features/posts/components/PostCard.tsx
import { Button, Card, Badge } from '@/shared/ui';

export function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      {/* Complex feature logic */}
      <Button onClick={handleContact}>Contactar</Button>
    </Card>
  );
}
```

**🎯 Rules:**
- **Atoms**: Si se usa en ≥ 2 lugares
- **Molecules**: Combinación de atoms reusable
- **Organisms**: Lógica de negocio + UI (Features consumen estos)

### 7. Performance Patterns

**Bundle Optimization:**
```typescript
// ✅ Specific imports
import { debounce } from 'lodash-es/debounce';
import { format } from 'date-fns';

// ❌ Massive imports
import * as MaterialUI from '@mui/material';
import _ from 'lodash';
```

**Lazy Loading:**
```typescript
const AdminDashboard = dynamic(() => import('@/features/admin/presentation/AdminDashboard'), {
  loading: () => <AdminDashboardSkeleton />,
  ssr: false
});
```

**Image Optimization:**
```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '**.cloudinary.com',
      pathname: '/**',
    }],
    formats: ['image/webp', 'image/avif'],
  }
}

// Component with blur
<Image
  src={post.image}
  placeholder="blur"
  blurDataURL={post.blurDataURL} // Generated server-side
  priority={post.featured}
/>
```

## 🏷️ Naming Conventions

### Files & Folders
```typescript
// ✅ Components: PascalCase
PostCard.tsx
PublicationForm.tsx

// ✅ Hooks: camelCase + "use"
usePosts.ts
useDebounce.ts

// ✅ Services: camelCase + ".service"
posts.service.ts
auth.service.ts

// ✅ Types: camelCase + ".types"
post.types.ts
api.types.ts

// ✅ API Routes: resource-based
api/posts/route.ts          // ✅
api/posts/[id]/route.ts     // ✅

// ❌ Evitar:
api/create-post.ts          // ❌ Verb-based
utils.ts                    // ❌ Too generic
helpers.ts                  // ❌ Too generic
```

### Component Naming
```typescript
// ✅ Descriptive + Context
PostCard              // ✅ Qué es + dónde
PostForm              // ✅
UserProfileAvatar     // ✅

// ❌ Too generic
Card                  // ❌ De qué?
Form                  // ❌ Para qué?
```

## 📦 Import & Export Patterns

**✅ Barrel Exports (Controlados):**
```typescript
// features/posts/index.ts - SOLO API PÚBLICA
export { PostsPage, PostDetailPage } from './presentation';
export { postsService } from './services';
export type { Post, CreatePostData } from './types';
export { usePosts, useCreatePost } from './hooks';

// ❌ NO exportar internals:
// export { PostFormValidator } from './components/PostForm/validation';
// export { POSTS_QUERY_KEYS } from './services/constants';
```

**🎯 Rule: "Si no se usa fuera del feature, no va al barrel principal"**

## 🔄 Data Flow Patterns

### Layer Boundaries
```typescript
// ✅ Presentation → Service
// features/posts/presentation/PostsPage.tsx
import { postsService } from '../services';

// ✅ Service → Domain
// features/posts/services/posts.service.ts
import { Post, CreatePostData } from '../types';

// ❌ Domain → Presentation (NEVER)
// features/posts/types/post.types.ts
import { PostCard } from '../components'; // ❌ WRONG DIRECTION
```

### Server/Client Boundary
```typescript
// ✅ Server → Server (normal composition)
export default function Page() {
  return <Header><MainContent /><Footer /></Header>;
}

// ✅ Server → Client (as children)
export default function Page() {
  return <div><ServerHeader /><ClientInteraction /></div>;
}

// ❌ Client → Server (NEVER)
'use client';
import ServerComponent from './ServerComponent'; // ❌ BREAKS BOUNDARY
```

## 🧪 Testing Strategy

**Hierarchy:**
```
tests/
├── unit/                    # Feature-level tests
│   ├── posts/
│   │   ├── posts.service.test.ts
│   │   └── PostCard.test.tsx
│   └── shared/ui/Button.test.tsx
├── integration/             # Feature integration
│   └── posts/post-creation.flow.test.ts
└── e2e/                     # User journeys
    ├── create-post.spec.ts
    └── admin-approval.spec.ts
```

**Test Types:**
- **Unit**: Aislados, rápidos, por feature
- **Integration**: Flows completos con mocks controlados
- **E2E**: Browser automation, UI real

## 🚀 Performance Boundaries

**Web Vitals Targets:**
```typescript
const PERFORMANCE_THRESHOLDS = {
  FIRST_CONTENTFUL_PAINT: 1.5, // seconds
  LARGEST_CONTENTFUL_PAINT: 2.5,
  CUMULATIVE_LAYOUT_SHIFT: 0.1,
  FIRST_INPUT_DELAY: 100, // milliseconds
  BUNDLE_SIZE: '250KB', // gzipped
  IMAGE_SIZE: '500KB' // optimized
};
```

**Key Patterns:**
- **Server-first**: Máximo cache, mínimo JS
- **Lazy loading**: Component-level y route-level
- **Parallel fetching**: Promise.all para requests
- **Smart revalidation**: revalidateTag > revalidatePath

## 🛡️ Security & Boundaries

### Environment Variables
```typescript
// .env.local (en .gitignore ✅)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

// ✅ Client: NEXT_PUBLIC_*
// ✅ Server: Todas las variables
// ❌ Nunca exponer service role key al cliente
```

### RLS & Client Strategy
```typescript
// lib/supabase.ts
export const supabase = createClient(url, anonKey);        // Client, RLS applies
export const supabaseAdmin = createClient(url, serviceKey); // Server, bypass RLS

// ✅ Read operations → supabase (RLS)
// ✅ Write operations → supabaseAdmin (server)
```

## 🎯 Development Rules

### Golden Rules
1. **Clean Architecture**: Dependencies point inward
2. **Feature Independence**: Each feature works alone
3. **Boundary Respect**: Server ↔ Client strict separation
4. **Performance First**: Server rendering whenever possible
5. **Security by Default**: RLS, env variables, input validation

### Red Flags 🚨
- Server Component importing Client Components for logic
- Barrel exports exposing internal implementation
- Business logic in UI components
- Service role key in client code
- Massive imports vs specific imports
- Sequential vs parallel data fetching

### Green Flags ✅
- Pages as pure routing components
- Granular revalidation with tags
- Component islands of interactivity
- Feature-specific Zustand stores
- Atomic Design in shared/ui only
- Parallel data fetching with Promise.all

---

**🎯 Remember**: Good architecture enables speed, performance enables users, patterns enable maintainability.