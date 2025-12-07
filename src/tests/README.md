# Test Documentation

This directory contains unit and integration tests for the MatchMaker application's database endpoints and stores.

## Test Results

✅ **All 58 tests passing**

```
Test Files  4 passed (4)
Tests       58 passed (58)
Duration    4.75s
```

## Test Structure

```
src/tests/
├── setup.ts                      # Test setup and mocks
├── stores/
│   ├── auth.test.ts             # Authentication store tests (16 tests)
│   ├── players.test.ts          # Players store tests (14 tests)
│   └── groups.test.ts           # Groups store tests (17 tests)
└── integration/
    └── database.test.ts         # Full workflow integration tests (11 tests)
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (useful during development)
```bash
npm test
```

### Run tests once (CI/CD)
```bash
npm run test:run
```

### Run with UI
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Coverage

### Authentication Store (`auth.test.ts`)
- ✅ Session initialization
- ✅ Google OAuth sign in
- ✅ Facebook OAuth sign in
- ✅ Email/password sign in
- ✅ Email sign up
- ✅ Sign out
- ✅ Password reset
- ✅ Authentication state

### Players Store (`players.test.ts`)
- ✅ Fetch players from database
- ✅ Add new player
- ✅ Update player
- ✅ Delete player
- ✅ Get player by ID
- ✅ Get multiple players by IDs
- ✅ Error handling
- ✅ Authentication checks

### Groups Store (`groups.test.ts`)
- ✅ Fetch groups with relationships
- ✅ Add new group
- ✅ Update group
- ✅ Delete group
- ✅ Add player to group
- ✅ Remove player from group
- ✅ Set player active status
- ✅ Toggle player active status
- ✅ Clear all active players
- ✅ Get group by ID
- ✅ Get groups by player ID
- ✅ Error handling

### Integration Tests (`database.test.ts`)
- ✅ Complete user workflow
  - Create players
  - Create groups
  - Add players to groups
  - Set active players
  - Update players
  - Remove players from groups
  - Delete players
- ✅ Multiple groups with shared players
- ✅ Data consistency after fetch
- ✅ Active player management
- ✅ Group updates
- ✅ Query operations
- ✅ Error handling
- ✅ Edge cases

## Mocking Strategy

### Supabase Client
All tests use mocked Supabase clients to avoid hitting the real database:

```typescript
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      // ... other methods
    }))
  }
}))
```

### Environment Variables
Test environment variables are stubbed in `setup.ts`:

```typescript
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')
```

## Writing New Tests

### 1. Unit Tests
Create a new test file in `src/tests/stores/` or appropriate directory:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should do something', () => {
    // Test implementation
  })
})
```

### 2. Integration Tests
Add tests to `src/tests/integration/` for multi-store workflows:

```typescript
describe('Feature Integration', () => {
  it('should handle complete workflow', async () => {
    // Test multiple stores working together
  })
})
```

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Clean State**: Use `beforeEach` to reset store state
3. **Mock External Dependencies**: Always mock Supabase and external APIs
4. **Descriptive Names**: Use clear test descriptions
5. **Arrange-Act-Assert**: Follow AAA pattern
6. **Error Cases**: Test both success and failure scenarios

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

## Coverage Goals

Target coverage metrics:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Debugging Tests

### Run specific test file
```bash
npm test players.test.ts
```

### Run specific test
```bash
npm test -t "should fetch players"
```

### Debug in VS Code
Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal"
}
```

## Common Issues

### "Cannot find module '@/...'"
- Check `vitest.config.ts` has correct path aliases
- Ensure TypeScript config matches

### Tests timing out
- Increase timeout: `it('test', { timeout: 10000 }, async () => {})`
- Check for unresolved promises

### Mock not working
- Ensure `vi.mock()` is called before imports
- Check mock return values match expected types

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Vue Test Utils](https://test-utils.vuejs.org)
- [Testing Pinia Stores](https://pinia.vuejs.org/cookbook/testing.html)
