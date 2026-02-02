# TaskManagerCompanyTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.9.

## Feature Specic Documentation 
In ./FEATURE_DOCUMNETAION.md

## UnCovered Features
- **test coverage**:Test Coverage 80%
- **Using Latest Angular**:Didn't Migrate to Angular 21 
- **Using HttpResource**:Using HttpResource To Handle Data
- **Signals Form**?:This is is experimental Feature I hope you didnt expect it as requirment
**Bonus Points Features **
- **CI/CD Pipeline**: GitHub Actions for automated testing and build
- **Docker**: Containerized application with docker-compose
- **Internationalization (i18n)**: Multi-language support
- **Accessibility Audit**: WCAG 2.1 AA compliance
- **Performance Metrics**: Lighthouse score > 90

## How to start

#### 1. Start the mock backend (first run)

Run this command to generate mock clean data and start the mock backend server.
**First Time**:Generate Data And Start Json Mock
```bash
npm run mock
```
**Sequentail Runs**:Avoid overwriting Data for every run
```bash
npm run mock:start
```
**Additional Script**:Generate/Overwrite-existing Data Only 
```bash
npm run mock:generate
```
#### 2. Start the development server

```bash
npm run start:dev
```

- Uses `proxy.conf.json` to forward API requests
- Useful for avoiding CORS issues during development
- Application runs on **http://localhost:4200**

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

# Project Over View

## Project Structure

```
src/
├── app/
│ ├── core/ # App-wide singletons & infrastructure
│ ├── components/ # Shared Components
| ├── Layouts/ # Custom Layout For guest/authorized
│ ├── pages/ # Feature-based Pages (tasks, dashboard)
│ └── app.routes.ts # Standalone routing
├── assets/
│ └── mocks/ # Mock backend JSON data
├── styles/ # Global styles, resets, variables
└── main.ts # Standalone bootstrap
└── test.ts # tests entry points
```

## Mock Backend Strategy

### JSON Server 
Used for:
- Rapid development
- Decoupling frontend from backend
- Predictable API behavior

Supports:
- GET
- POST
- PUT
- DELETE

---


## Performance Considerations

- Signals instead of RxJS subscriptions in components
- Computed signals for derived data
- Lazy API calls
- OnPush change detection
- Lazy Lady Routes


### Architectural decision

## Component Communication

### Signals First

We rely on **Angular Signals** instead Subjects(Emitter Subjects pattern Notification Based).
why?
-core believe signal is the future
-prevent memory leaks caused by subscriptions.
-changes are instantneous

#### Pattern Used

- **Writable signals in services**

```ts
//service
userSearch = signal<string>("");
```

- **Readonly Or Writable access in components**

```ts
//first-component
//update service signal to start emission
service.userSearch.set(value);
```

- **Computed signals are used for derived state and reactive listeners.**

```ts
//second component dervice from listening
searchValue = computed(() => service.userSearch());
```

## State Management Strategy

### Signals First

We rely on **Angular Signals** instead (NgRx)/Observables.
why?

- Provides the same benefits as NgRx/Observables for component communication.
- Eliminates boilerplate while maintaining reactive and derived state.

#### Pattern Used

- **State is derived using computed signals, ensuring components have readonly access where needed.**

```ts
//service
readonly users=signal<User[]>([])
```

- **Readonly access in components to enforce controlled state mutations.**

```ts
users = computed(() => service.users());
```

## Services Design

### Feature Services

responsible for:

- Fetching data (HTTP)
- Caching data in signals
- Data transformation
  They are **NOT** responsible for UI logic.

## Cache Design
**Havent Tried Interceptor Caching Before So I didnt Risk Heavy Cache Logic** 
have storage service to encapsulate cache logic based on cache key,ttl(time to live ).
- cache entries get requets
- set values in storage By keys
- remove values from storage by keys
- invalidate cache on expiry

## Dialog & UI Logic

### Dialog Abstraction

Dialog opening logic is centralized in a **dedicated dialog service**.

Why?

- Reusability
- Single Responsibility
- Cleaner components

```ts
TaskDialogService.open(task?, header?)
```

Components do NOT:

- Fetch dialog dependencies
- Construct dialog configs

---

## Utilities
Pure Utitilites Function Or Feature Static Methods Used By Services,Components
Has:
- Shared Logic Functions,
- Static Feature Speicific Utitilites Functions
why?
- Pure ,
- Stateless
- Easily testable

#### Shared Utils

Lives in **utils/shared.util.ts** and is:

```ts
getDiffInDays(date: string): number
```

#### Feature-Specific Utilities

Feature-specific helpers are grouped into **feature.util** as Static methods:

- core business logic
- shared constants
  example:**Task Util**

```ts
TasksUtils.getOverdueText(task);
```

```ts
//have different statuses
static readonly statuses
```

## Component Design

### Smart vs Presentational Components

**Smart Components**:
- Fetch data
- Own signals
- Handle orchestration

**Presentational Components**:
- Receive Inputs
- Emit Outputs
- No business logic
```
Task-Column
Avatr-Profile
sidebar
```


## Styling Strategy

### CSS Layers
We use **CSS Layers** to control style priority:

Order:
1. Reset
2. Bootstrap
3. PrimeNG
4. App styles

This prevents:
- Style conflicts
- Random overrides

### Global vs Scoped Styles
- Global styles → `styles/`
- Component styles → `.component.scss`

---

## UI Libraries

### PrimeNG
Used for:
- Dialogs
- Calendar
- Overlay panels
- Charts

### Bootstrap
Used for:
- Layout utilities
- Grid system
- Spacing helpers


---

