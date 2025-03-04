# Full Stack Task Manager App

A full-stack Task Manager app built using **React Native** with **Expo** for the frontend and **Node.js** with **Express** for the backend. The app utilizes **Firebase** (Firestore Database) to store and manage tasks. The frontend communicates with the backend via **Axios** for smooth and efficient API interactions.

---

#  Task Manager Mobile App Screenshots 📱

<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
    <img src="https://github.com/user-attachments/assets/7c090224-de20-4730-843b-b0035c00703f" alt="Screenshot 1" width="200" style="margin: 30px;" />
    <img src="https://github.com/user-attachments/assets/5aaa7d4b-5d40-4000-93bd-6c199323332f" alt="Screenshot 2" width="200" style="margin: 30px;" />
</div>

#  Task Manager Web App Screenshots 🖥️

<img width="1512" alt="Screenshot 2025-03-05 at 12 35 47 AM" src="https://github.com/user-attachments/assets/fa5165a1-7788-4fb3-b583-7e75d05724b0" />
<img width="1512" alt="Screenshot 2025-03-05 at 12 36 44 AM" src="https://github.com/user-attachments/assets/98db3500-f41c-4ebd-ba57-3c6a40e15143" />


## Features

### Frontend (React Native with Expo):
- **Task List Screen**: Displays a list of tasks with options to mark tasks as completed or delete them.
- **Add Task Screen**: Allows users to create new tasks by providing a title and description.
- **Navigation**: Uses **React Navigation** to switch seamlessly between screens (Task List and Add Task).
- **UI Design**: Clean, modern, and user-friendly design ensuring an intuitive user experience.

### Backend (Node.js with Express & Firebase):
- **API Routes**:
  - `GET /api/tasks`: Retrieve all tasks from the database.
  - `POST /api/tasks`: Add a new task.
  - `PUT /api/tasks/:id`: Mark a specific task as completed.
  - `DELETE /api/tasks/:id`: Delete a specific task from the database.
- **Firebase**: Firebase Realtime Database or Firestore is used to persist tasks.

---

## Project Structure

### Folders and Files

#### **FullStackTaskManagerApp**
This folder contains the React Native frontend code using Expo.

- `Index.tsx`: Main entry point for the app.
- `src/`: Contains all the frontend components, navigation, and styling.
  - `components/`: Contains React components such as Task List and Add Task.
  - `screens/`: Contains screens for displaying and managing tasks.
  - `navigation/`: Configures and manages React Navigation between screens.
  - `utils/`: Contains utility functions, like API calls using Axios.

#### **TaskManager_backend**
This folder contains the Node.js backend code using Express and Firebase.

- `index.js`: Entry point for the backend server.
- `routes/`: Contains Express API routes for handling tasks (CRUD operations).
- `services/`: Contains Firebase configuration and database interaction logic.
- `controllers/`: Handles the logic for the different API endpoints.
- `models/`: Contains models for tasks.
- `config/`: Configuration for Firebase and other server settings.

---

## Installation

### Prerequisites
- **Node.js**: Make sure Node.js is installed on your machine.
- **Firebase Account**: Set up Firebase and get your Firebase configuration keys.
- **Expo**: Make sure you have Expo installed for running the React Native app.

### Frontend Setup

1. Clone the repository:

   
```bash
   git clone https://github.com/yourusername/FullStackTaskManagerApp.git
   cd FullStackTaskManagerApp
```

2. Install dependencies:
```bash
  npm install
```

3. Run the app using Expo:

   
```bash
 expo start
```
This will launch the app in the Expo client.

### How to Use:
- **Adding a Task**: From the home screen, tap "Add Task" to navigate to the Add Task screen. Enter the task title and description, then tap the "Save" button to add the task to your task list.

- **Marking a Task as Completed**: On the Task List screen, click on the "Mark as Completed" button next to a task to mark it as done.

- **Deleting a Task**: You can delete tasks by clicking the delete button next to any task on the Task List screen.


### Contributing:
We welcome contributions! If you would like to contribute to the project, please follow these steps:

- **Fork the repository**.
- **Create a new branch for your feature or bugfix**.
- **Make the necessary changes and commit them**.
- **Submit a pull request**.
