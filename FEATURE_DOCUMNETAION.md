# Core Features Made 

- **Dashboard**
- **tasks**
- **login**

## Dashboard Features

core Functionality/Sections

- **Statistics Cards**: Display total tasks, completed tasks, in-progress tasks, and overdue tasks
- **Recent Activity Feed**: Show recent changes/updates to tasks
- **Task Analytics Chart**:Visual Chart show task Distributon By Priority And Tasks
- **User/Task Analytics Chart**:Visual Chart show task Distributon By Priority And Tasks

## Task Managment

- **Create Tasks**: Add new tasks with title, description, priority (Low/Medium/High), status, due date, and assignee
- **Edit Tasks**: Update existing task via modal and Check For Edge Cases
- **Delete Tasks**: Remove tasks with confirmation dialog
- **Task Filtering**: Filter by status (To Do, In Progress, Done), priority, and assignee
- **Task Search**: Real-time search across task titles and descriptions

## User Managment

- **User List**:View User List
- **Edit User**:Update User Fields But Not Tasks
- **Add User**:Add User?But Not With Tasks ?? 

## Logic Limitations And Edge Cases

**Same Cases Can Be Done But it would require deep thinking and hireracy change And Ask Business Questions**

- Delete User If they have taks ?
- Create task Without User ?

# Technology Limitations & Learning Notes

## Inheirtance Pattern 
**should have made Class to share Features for update-task ,update-card**

## Signals in a Production Environment

This project is my **first time using Angular Signals extensively in a production-oriented application**.  
Signals are still relatively new, so **best practices for large-scale production usage are not fully established**.

I applied a _signals-first_ approach throughout the app, including:

- Services
- State management
- Caching strategies

While Signals are **the future of Angular**, using them extensively affected:

- Testing strategies
- State ownership and flow design
- Overall development workflow

---

## Testing Considerations

Although I have prior experience testing and mocking both frontend and backend systems, applying these practices in a **production project with Signals** added complexity.

Challenges included:

- Adapting tests to signal-driven state
- Ensuring predictable and maintainable test setups
- Balancing delivery speed with confidence in tests

This experience was challenging but valuable for gaining hands-on experience with **emerging Angular patterns**.
