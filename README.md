# GoWhere Project Tasks

## **Core Functionality**

### **User Authentication**

- [ ]  **Sign-Up Feature**
    - **UI**: Create a registration form with fields for username, email, and password.
    - **API**: Implement `/signup` endpoint in the backend to store user credentials securely.
- [ ]  **Login Feature**
    - **UI**: Design a login page with email and password fields.
    - **API**: Implement `/login` endpoint to verify credentials and return a JWT token.
- [ ]  **Password Recovery**
    - **UI**: Add "Forgot Password?" link to the login page leading to a recovery form.
    - **API**: Create `/recover-password` endpoint to send a password reset email.

---

### **Event Feed**

- [ ]  **Event List with Sorting and Filtering**
    - **UI**: Design an event feed showing event cards (title, date, location, and creator).
    - **API**: Use `/events` endpoint to fetch and filter events dynamically.
- [ ]  **Event Search**
    - **UI**: Add a search bar at the top of the feed for keyword searches.
    - **API**: Extend `/events` endpoint to include search functionality.

---

### **Event Management**

- [ ]  **Create Event**
    - **UI**: Build a form to input event details like title, date, location, and description.
    - **API**: Implement `POST /events` endpoint to save new events to the database.
- [ ]  **Edit Event**
    - **UI**: Add an edit button on the event detail page to pre-fill the creation form.
    - **API**: Implement `PUT /events/:id` endpoint to update event details.
- [ ]  **Delete Event**
    - **UI**: Add a delete button on the event detail page with a confirmation modal.
    - **API**: Implement `DELETE /events/:id` endpoint to remove events.
- [ ]  **Mark as Interested/Will Go**
    - **UI**: Add buttons on the event detail page for "Interested" and "Will Go."
    - **API**: Create endpoints `/events/:id/interested` and `/events/:id/willgo`.

---

### **Profiles**

- [ ]  **User Profile**
    - **UI**: Design a profile page showing user information and created/joined events.
    - **API**: Fetch data from `/users/:id` endpoint.
- [ ]  **Edit Profile**
    - **UI**: Build an editable form for updating user details like name and bio.
    - **API**: Implement `PUT /users/:id` endpoint to update user data.

---

## **Chat Feature**

### **Private Chat**

- [ ]  **Chat Request**
    - **UI**: Add a "Request to Chat" button on user profiles.
    - **API**: Create `POST /chat/request` endpoint to initiate a chat request.
- [ ]  **Messaging**
    - **UI**: Build a messaging screen with a real-time chat interface.
    - **API**: Implement `/chat/:chatId` endpoint and use Socket.IO for real-time messaging.

---

### **Group Chat**

- [ ]  **Event Attendee Chat**
    - **UI**: Add a group chat button on the event detail page.
    - **API**: Create `POST /chat/group` for event chats and `/chat/group/:eventId` for messages.

---

## **Follow System**

### **Follow/Unfollow**

- [ ]  **Follow Button**
    - **UI**: Add "Follow" and "Unfollow" buttons on user profiles.
    - **API**: Implement `POST /follow/:userId` and `DELETE /follow/:userId` endpoints.
- [ ]  **Followers List**
    - **UI**: Create a tab to display a list of followers and following.
    - **API**: Fetch data from `/follow/:userId`.

---

## **Filters and Search**

- [ ]  **Filter Events**
    - **UI**: Add dropdown filters for category, date, and location on the event feed.
    - **API**: Extend `/events` endpoint to handle multiple filter parameters.
- [ ]  **Keyword Search**
    - **UI**: Place a search bar in the navigation header.
    - **API**: Include a query parameter in the `/events` endpoint for keyword searches.

---

## **Notifications**

- [ ]  **Push Notifications**
    - **UI**: Add a notification icon in the app header.
    - **API**: Use Firebase Cloud Messaging (FCM) to send real-time notifications for new chats and event updates.

---

## **Backend Development**

### **Database**

- [ ]  Design MongoDB schema for:
    - Users (username, email, password, bio, followers, following)
    - Events (title, date, location, attendees)
    - Chats (participants, messages)
- [ ]  Use bcrypt for password encryption.

### **API Endpoints**

- [ ]  Authentication:
    - `/signup`
    - `/login`
    - `/recover-password`
- [ ]  Event Management:
    - `GET /events`
    - `POST /events`
    - `PUT /events/:id`
    - `DELETE /events/:id`
- [ ]  Chat:
    - `POST /chat/request`
    - `POST /chat/group`
    - `GET /chat/:chatId`
- [ ]  Follow System:
    - `POST /follow/:userId`
    - `DELETE /follow/:userId`
    - `GET /follow/:userId`

---


---

## **Deployment**

- [ ]  Backend:
    - Deploy Node.js API to AWS or Heroku.
    - Use MongoDB Atlas for database hosting.
- [ ]  Frontend:
    - Deploy Expo app for both iOS and Android.
