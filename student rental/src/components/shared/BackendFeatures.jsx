import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Database,
  Lock,
  KeyRound,
  Server,
  Layers,
  Code2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  Cpu
} from 'lucide-react'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

const FEATURE_CATEGORIES = [
  {
    id: 'auth',
    title: 'User Registration & Auth',
    icon: KeyRound,
    badge: 'Spring Security + BCrypt',
    color: '#4B9EE5',
    summary: 'Secure registration and authentication with salted BCrypt password hashing and duplicate prevention.',
    details: [
      {
        label: 'Registration Endpoint',
        value: 'POST /api/auth/register',
        desc: 'Accepts student registration payload, checks duplicate emails via userRepository.existsByEmail, and sets default student trust score (70).'
      },
      {
        label: 'BCrypt Password Hashing',
        value: 'BCryptPasswordEncoder (10 salt rounds)',
        desc: 'Never stores plaintext passwords. Passwords are irreversibly hashed and verified using passwordEncoder.matches().'
      },
      {
        label: 'Automated Account Setup',
        value: 'Role.STUDENT default with UUID',
        desc: 'Generates secure custom IDs (e.g. u49f123a), stores student department, graduation year, and phone.'
      }
    ],
    codeSnippet: `@PostMapping("/register")
public ResponseEntity<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest req) {
    if (userRepository.existsByEmail(req.getEmail())) {
        throw new RuntimeException("Email already registered");
    }
    User user = User.builder()
        .id("u" + UUID.randomUUID().toString().replace("-", "").substring(0, 8))
        .name(req.getName()).email(req.getEmail())
        .password(passwordEncoder.encode(req.getPassword()))
        .role(User.Role.STUDENT).build();
    userRepository.save(user);
    String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
    return ResponseEntity.ok(buildResponse(token, user));
}`
  },
  {
    id: 'validation',
    title: 'Login Validation & Credentials',
    icon: Lock,
    badge: 'Jakarta Validation + DTO',
    color: '#FBBF24',
    summary: 'Strict input constraint validation with automated error conversion and timing-safe credential verification.',
    details: [
      {
        label: 'Login Endpoint',
        value: 'POST /api/auth/login',
        desc: 'Validates email format and password length before evaluating credentials in AuthService.'
      },
      {
        label: 'Jakarta Validation DTOs',
        value: '@NotBlank, @Email, @Size(min = 4)',
        desc: 'Ensures payload sanitization prior to reaching business logic layers, preventing malformed requests.'
      },
      {
        label: 'Timing-Safe Password Matching',
        value: 'BCrypt Constant-Time Compare',
        desc: 'Prevents side-channel timing attacks by checking hashed credentials through Spring Security.'
      }
    ],
    codeSnippet: `@Data
public static class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid campus email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 4, message = "Password must be at least 4 characters")
    private String password;
}`
  },
  {
    id: 'database',
    title: 'Database & JPA Integration',
    icon: Database,
    badge: 'PostgreSQL + Hibernate',
    color: '#4ADE80',
    summary: 'Enterprise relational persistence via Spring Data JPA with automated schema evolution and mock seeding.',
    details: [
      {
        label: 'RDBMS Engine',
        value: 'PostgreSQL (port 5432 / campus_circular)',
        desc: 'Dialect configured with org.hibernate.dialect.PostgreSQLDialect.'
      },
      {
        label: 'JPA Schema Automation',
        value: 'spring.jpa.hibernate.ddl-auto=update',
        desc: 'Automatically maps relational schemas, foreign keys, and indexes from Java entity definitions.'
      },
      {
        label: 'Preloaded Data Seeder',
        value: 'DataSeeder (CommandLineRunner)',
        desc: 'Seeds 10 complete campus student profiles, 15 campus hardware resources, and past lifecycle exchanges.'
      }
    ],
    codeSnippet: `@Entity
@Table(name = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    private String id;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role; // STUDENT, ADMIN
    private int trustScore;
    private int onTimeReturnRate;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> badges;
}`
  },
  {
    id: 'endpoints',
    title: 'REST API Architecture',
    icon: Server,
    badge: '18+ REST Endpoints',
    color: '#A78BFA',
    summary: 'Comprehensive RESTful controller suite powering authentication, catalog discovery, orders, and admin controls.',
    details: [
      {
        label: 'Authentication Endpoints',
        value: 'POST /api/auth/login, POST /api/auth/register',
        desc: 'Public endpoints issuing signed JWT Bearer tokens and student profiles.'
      },
      {
        label: 'Resource Catalog Endpoints',
        value: 'GET /api/resources, GET /api/resources/{id}, GET /api/resources/categories',
        desc: 'Supports real-time search queries, category filters, and sorting algorithms.'
      },
      {
        label: 'Lifecycle Exchange Endpoints',
        value: 'GET/POST /api/exchanges, /orders, /requests, /checkout, /{id}/approve, /reject, /advance',
        desc: 'Manages complete borrowing lifecycles from request to inspection and rating.'
      },
      {
        label: 'Cart & Wishlist Endpoints',
        value: 'GET/POST/DELETE /api/cart, /api/wishlist/{id}/toggle',
        desc: 'Full server-side kit builder and wishlist synchronization.'
      }
    ],
    codeSnippet: `@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {
    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<ResourceDto>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "bestMatch") String sort) {
        return ResponseEntity.ok(resourceService.getAll(search, category, sort));
    }
}`
  },
  {
    id: 'jwt',
    title: 'JWT & Stateless Session',
    icon: Shield,
    badge: 'RFC 7519 JJWT 0.11.5',
    color: '#38BDF8',
    summary: 'Stateless session authorization with HMAC-SHA256 token signing and automated OncePerRequestFilter extraction.',
    details: [
      {
        label: 'Token Signature',
        value: 'HMAC-SHA256 (HS256)',
        desc: 'Signed with server-side secret key (jwt.secret in application.properties).'
      },
      {
        label: 'Expiration Policy',
        value: '24 Hours (86,400,000 ms)',
        desc: 'Token expiration validated per request before delegating to controller logic.'
      },
      {
        label: 'Filter Interceptor',
        value: 'JwtAuthFilter (OncePerRequestFilter)',
        desc: 'Extracts Bearer token from HTTP Authorization header, verifies signature, and populates SecurityContextHolder.'
      }
    ],
    codeSnippet: `public String generateToken(String userId, String role) {
    return Jwts.builder()
        .setSubject(userId)
        .claim("role", role)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}`
  },
  {
    id: 'rbac',
    title: 'Role-Based Access Control',
    icon: Layers,
    badge: 'STUDENT vs ADMIN Roles',
    color: '#F43F5E',
    summary: 'Granular route-level and method-level access controls securing student workflows and administrative governance.',
    details: [
      {
        label: 'Role Hierarchy',
        value: 'ROLE_STUDENT & ROLE_ADMIN',
        desc: 'Mapped through Spring Security SimpleGrantedAuthority from JWT claims.'
      },
      {
        label: 'Filter Chain Matchers',
        value: '.requestMatchers("/api/admin/**").hasRole("ADMIN")',
        desc: 'Guarantees unauthenticated or student requests to /api/admin/* receive HTTP 403 Forbidden.'
      },
      {
        label: 'Method Security',
        value: '@EnableMethodSecurity + @PreAuthorize',
        desc: 'Fine-grained annotations guarding administrative controller methods.'
      }
    ],
    codeSnippet: `@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(AuthService::mapToDto).toList());
    }
}`
  },
  {
    id: 'crud',
    title: 'CRUD Modules & State Machine',
    icon: Activity,
    badge: '8-State Exchange Lifecycle',
    color: '#34D399',
    summary: 'Full CRUD operations across resources, cart, wishlist, and an 8-state exchange workflow engine.',
    details: [
      {
        label: 'Lifecycle Workflow',
        value: '8 Sequential States',
        desc: 'Requested → Accepted → Handover → Borrowed → Return Due → Inspection → Settlement → Rated.'
      },
      {
        label: 'Cart Checkout Engine',
        value: 'CartService + Multi-Order Checkout',
        desc: 'Atomically creates exchange agreements for all items in kit while clearing cart items.'
      },
      {
        label: 'Damage & Dispute Logic',
        value: 'Settlement & Deposit Deductions',
        desc: 'Calculates late fees, platforms fees, and refund amounts during return settlement.'
      }
    ],
    codeSnippet: `public enum ExchangeStatus {
    requested, accepted, handover, borrowed, return_due,
    inspection, settlement, rated, rejected, cancelled
}`
  },
  {
    id: 'errors',
    title: 'Global Exception Handling',
    icon: AlertCircle,
    badge: '@RestControllerAdvice',
    color: '#FB7185',
    summary: 'Unified error translation converting internal exceptions into structured JSON responses with HTTP status codes.',
    details: [
      {
        label: 'Controller Advice',
        value: 'GlobalExceptionHandler',
        desc: 'Centralized exception handler intercepting all uncaught runtime exceptions across controllers.'
      },
      {
        label: 'Validation Error Aggregator',
        value: 'MethodArgumentNotValidException (422)',
        desc: 'Extracts field-by-field validation failures into clear comma-separated messages.'
      },
      {
        label: 'Structured Error Schema',
        value: '{ timestamp, status, error }',
        desc: 'Clean JSON contract consumed reliably by frontend API fetch wrapper.'
      }
    ],
    codeSnippet: `@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return error(HttpStatus.UNPROCESSABLE_ENTITY, message);
    }
}`
  }
]

export function BackendFeatures({ onClose }) {
  const [activeTab, setActiveTab] = useState(FEATURE_CATEGORIES[0].id)
  const [backendAlive, setBackendAlive] = useState(null)
  const [checking, setChecking] = useState(false)
  const { isDemoMode } = useAuthStore()

  const checkStatus = async () => {
    setChecking(true)
    const isUp = await api.checkHealth()
    setBackendAlive(isUp)
    setChecking(false)
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const selectedCategory = FEATURE_CATEGORIES.find((c) => c.id === activeTab) || FEATURE_CATEGORIES[0]

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header bar */}
      <div
        className="glass-strong"
        style={{
          borderRadius: '20px',
          padding: '24px 32px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                background: 'rgba(75, 158, 229, 0.15)',
                color: '#4B9EE5',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Cpu size={14} /> Spring Boot 3.2.5 • Java 17
            </span>
            <span
              style={{
                background: 'rgba(74, 222, 128, 0.15)',
                color: '#4ade80',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              PostgreSQL JPA
            </span>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', margin: 0, color: 'white' }}>
            Java Backend Architecture &amp; Implemented Services
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '14px', margin: '6px 0 0' }}>
            Production-grade REST API with stateless JWT security, BCrypt credentials, and relational JPA mapping.
          </p>
        </div>

        {/* Live Backend Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="glass"
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              border: backendAlive
                ? '1px solid rgba(74, 222, 128, 0.4)'
                : '1px solid rgba(251, 191, 36, 0.4)',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: backendAlive ? '#4ade80' : '#fbbf24',
                boxShadow: backendAlive ? '0 0 10px #4ade80' : '0 0 10px #fbbf24',
              }}
            />
            <div>
              <div style={{ fontWeight: 600, color: 'white' }}>
                {backendAlive ? 'Java Backend Online (Port 8080)' : 'Backend Standby / Demo Mode'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)' }}>
                {backendAlive
                  ? 'Active REST responses'
                  : isDemoMode
                  ? 'Simulated Session Active'
                  : 'Requires PostgreSQL localhost:5432'}
              </div>
            </div>
            <button
              onClick={checkStatus}
              disabled={checking}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                marginLeft: '6px',
              }}
            >
              {checking ? 'Pinging...' : 'Ping'}
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="glass"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Navigation Tabs on left, details on right */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Navigation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {FEATURE_CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = cat.id === activeTab
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={isSelected ? 'glass-strong' : 'glass'}
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: isSelected
                    ? `1px solid ${cat.color}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`
                    : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: `${cat.color}22`,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {cat.title}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '11px',
                      marginTop: '2px',
                    }}
                  >
                    {cat.badge}
                  </div>
                </div>
                {isSelected && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: cat.color,
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Feature Detail View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-strong"
            style={{
              padding: '32px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Title & summary */}
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: `${selectedCategory.color}25`,
                    color: selectedCategory.color,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {selectedCategory.badge}
                </span>
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: 'white', margin: '0 0 8px' }}>
                {selectedCategory.title}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '15px', lineHeight: 1.5, margin: 0 }}>
                {selectedCategory.summary}
              </p>
            </div>

            {/* Feature Points */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              {selectedCategory.details.map((item, idx) => (
                <div
                  key={idx}
                  className="glass"
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '12px',
                        color: selectedCategory.color,
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Java Code Implementation Snippet */}
            {selectedCategory.codeSnippet && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                  <Code2 size={14} /> Backend Java Source Implementation
                </div>
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '12px',
                    color: '#E2E8F0',
                    overflowX: 'auto',
                    whiteSpace: 'pre',
                    lineHeight: 1.5,
                  }}
                >
                  {selectedCategory.codeSnippet}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Summary table of all 18+ Endpoints */}
      <div
        className="glass-strong"
        style={{
          marginTop: '28px',
          padding: '28px 32px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', margin: '0 0 16px', color: 'white' }}>
          Complete Spring Boot REST API Endpoint Matrix
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', color: 'rgba(255, 255, 255, 0.6)' }}>
                <th style={{ padding: '10px 12px' }}>Method</th>
                <th style={{ padding: '10px 12px' }}>Endpoint</th>
                <th style={{ padding: '10px 12px' }}>Access</th>
                <th style={{ padding: '10px 12px' }}>Module / Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                { method: 'POST', path: '/api/auth/login', access: 'Public', desc: 'Verify BCrypt credentials & return JWT' },
                { method: 'POST', path: '/api/auth/register', access: 'Public', desc: 'Create student account & issue token' },
                { method: 'GET', path: '/api/resources', access: 'Public', desc: 'Search, category filter, and sorting' },
                { method: 'GET', path: '/api/resources/{id}', access: 'Public', desc: 'Fetch resource details & owner profile' },
                { method: 'GET', path: '/api/resources/categories', access: 'Public', desc: 'List distinct equipment categories' },
                { method: 'GET', path: '/api/users/me', access: 'Auth (Bearer)', desc: 'Fetch authenticated user profile' },
                { method: 'GET', path: '/api/users/{id}', access: 'Auth (Bearer)', desc: 'View Trust Passport & badges' },
                { method: 'GET', path: '/api/exchanges/orders', access: 'Auth (Bearer)', desc: 'Borrower orders history' },
                { method: 'GET', path: '/api/exchanges/requests', access: 'Auth (Bearer)', desc: 'Lender incoming borrow requests' },
                { method: 'POST', path: '/api/exchanges', access: 'Auth (Bearer)', desc: 'Initiate single borrow request' },
                { method: 'POST', path: '/api/exchanges/checkout', access: 'Auth (Bearer)', desc: 'Batch order checkout for Cart kit' },
                { method: 'PATCH', path: '/api/exchanges/{id}/approve', access: 'Auth (Bearer)', desc: 'Lender approval transition' },
                { method: 'PATCH', path: '/api/exchanges/{id}/advance', access: 'Auth (Bearer)', desc: 'Advance exchange lifecycle stage' },
                { method: 'GET / POST', path: '/api/cart', access: 'Auth (Bearer)', desc: 'Kit builder item synchronization' },
                { method: 'POST', path: '/api/wishlist/{id}/toggle', access: 'Auth (Bearer)', desc: 'Wishlist save & remove toggle' },
                { method: 'GET', path: '/api/admin/users', access: 'ADMIN Only', desc: 'Full user registry & dispute flags' },
                { method: 'GET', path: '/api/admin/resources', access: 'ADMIN Only', desc: 'Platform asset inventory' },
                { method: 'GET', path: '/api/admin/exchanges', access: 'ADMIN Only', desc: 'Monitor active & flagged transactions' },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: row.method.includes('POST') ? '#4ade80' : row.method.includes('PATCH') ? '#fbbf24' : '#4B9EE5' }}>
                    {row.method}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: '"IBM Plex Mono", monospace', color: 'white' }}>
                    {row.path}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 500,
                        background: row.access.includes('ADMIN')
                          ? 'rgba(248, 113, 113, 0.2)'
                          : row.access.includes('Public')
                          ? 'rgba(74, 222, 128, 0.2)'
                          : 'rgba(75, 158, 229, 0.2)',
                        color: row.access.includes('ADMIN')
                          ? '#f87171'
                          : row.access.includes('Public')
                          ? '#4ade80'
                          : '#4B9EE5',
                      }}
                    >
                      {row.access}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255, 255, 255, 0.75)' }}>
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
