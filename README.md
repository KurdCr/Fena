# FENA - Task

The task is to create an efficient email sending system with real-time updates. The process involves implementing a simple frontend with an input box for specifying the number of emails to send. Upon triggering the process, the backend responds with a unique job ID and adds the job to a message queue. Workers process the jobs, simulating email sending, while the user's browser receives real-time updates on the email sending status. Users can check the job status even after closing their browsers.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [WebSockets Connection](#websockets-connection)
- [Events Shared Using Kafka](#events-shared-using-kafka)
- [Docker Compose](#docker-compose)
- [Notes](#notes)
- [Improvements and Future Work](#improvements-and-future-work)

## Technologies Used

- Frontend: React
- Backend: NestJS
- Queue: Kafka
- Database: MySQL
- WebSockets for real-time updates

## Installation

To run locally, follow these steps:

1. Clone this repository to your local machine.
2. Ensure you have [Docker](https://www.docker.com/get-started) installed and running.
3. In the root folder, run the following command to start the services using Docker Compose:

```bash
docker-compose up
```

4. In the `frontend` folder, install the dependencies and start the frontend application:

```bash
npm install
npm run start
```

## Usage

Once the application is up and running, you can access it by navigating to `http://localhost:3000` in your web browser.

1. On the homepage, you'll find an input box where you can specify the number of emails you want to send.
2. Enter the desired number and click the "Send" button.
3. The `API Gateway` will receive the POST request and create an `EmailJob` in the database while producing a 'send_emails' event through Kafka.
4. The `email microservice` listens for 'send_emails' events and starts processing the `EmailJob`.
5. The processing currently simulates sending emails by waiting 1 second for each email and updating the `EmailJob` status in the database. The actual email sending part is commented out for now.
6. While processing, the `API Gateway` will update the connected users' browsers in real-time using WebSockets, showing the status of how many emails are sent.
7. Users can close their browsers and come back later to see the status of their job.

## API Endpoints

- `POST /email/send-emails`: Sends a request to trigger the email sending process. Requires a JSON body with `userId` (string) and `numberOfEmails` (number).

- `GET /email/:userId`: Retrieves all `EmailJobs` currently in the queue for the specified user.

- `GET /email/:userId/completed`: Retrieves all completed `EmailJobs` for the specified user.

## WebSockets Connection

The `API Gateway` establishes a WebSocket connection with the frontend clients to provide real-time updates on the status of their email jobs.

## Events Shared Using Kafka

- `send_emails`: Event from the `API Gateway` to the `email microservice`, triggering the email sending process.

- `emailJob_updates`: Event from the `email microservice` to the `API Gateway`, providing updates on the status of the email jobs.

## Docker Compose

Docker has been used to connect the services, including the  `API Gateway`, `email microservice`, MySQL, and Kafka. The `docker-compose.yml` file in the root folder defines the configuration, ensuring efficient communication and cooperation among the components.

## Notes

- User identification: The application uses the `userId` parameter to differentiate between different users. The frontend currently retrieves the `userId` from the URL, for example, being on the page `http://localhost:3000/?userid=1` means being logged in as a user with `userId` 1.

- Fault tolerance and recovery: To handle scenarios like server shutdown, crashes, or insufficient email sending, the microservices retrieve all incomplete email jobs from the database whenever they start. This ensures no email job is lost or left incomplete, providing fault tolerance and graceful recovery.

- Dead Letter Queue (DLQ): A DLQ, or dead letter queue, has been implemented to save events in case of service failure. The DLQ is stored in the database. As of now, the application does not use the DLQs from the database; how it is handled will depend on the specific code implementation.

- Kafka producer and consumer: The Kafka producer and consumer have been set up in a way that allows easy configuration for various purposes beyond the current email sending functionality. This flexibility ensures they can be adapted for other use cases if needed.

## Improvements

There are areas for improvement and additional features that can be added in the future:

- Implement Server-Sent Events (SSE) for the connection between the backend and frontend for a simpler real-time update mechanism.
- Add automated testing, including unit tests and integration tests, to ensure the reliability of the application in production.
- Consider using an in-memory data store (e.g., Redis) to maintain job status for each email batch and avoid additional database queries for real-time updates.


