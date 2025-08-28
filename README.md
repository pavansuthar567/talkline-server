# TalkLine - Scalable Real-time Chat Application

A production-ready, scalable real-time chat application built with Node.js, TypeScript, Socket.io, Redis, Kafka, and MongoDB. Designed to handle 1M+ requests per second with proper caching, rate limiting, and monitoring.

## 🚀 Features

### Core Features

- **Real-time Messaging**: WebSocket-based instant messaging
- **1:1 & Group Chats**: Support for both individual and group conversations
- **Message Delivery Status**: Read receipts and delivery confirmations
- **User Presence**: Online/offline status and typing indicators
- **File Upload**: Support for media and document sharing
- **AI Integration**: Resume generation using Google Gemini AI

### Scalability Features

- **Redis Caching**: Message history, user presence, conversation metadata
- **Kafka Message Queuing**: Asynchronous message processing
- **Rate Limiting**: API and socket event throttling
- **Horizontal Scaling**: Stateless design with Redis adapter
- **Load Balancing**: Nginx reverse proxy configuration
- **Health Monitoring**: Real-time metrics and health checks

### Production Features

- **Error Handling**: Centralized error management
- **Request Monitoring**: QPS, latency, and error rate tracking
- **Security**: JWT authentication, input validation
- **Docker Support**: Complete containerization
- **API Documentation**: Swagger/OpenAPI specs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Nginx LB      │    │   Monitoring    │
│   (Web/Mobile)  │◄──►│   (Load Balancer)│◄──►│   (Metrics)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
        │  Main Server │ │Socket Server│ │   Redis     │
        │  (REST API)  │ │ (WebSocket) │ │  (Cache)    │
        └───────┬──────┘ └─────┬─────┘ └──────┬──────┘
                │               │              │
        ┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
        │   MongoDB    │ │   Kafka    │ │   Monitoring│
        │  (Database)  │ │ (Message Q)│ │   Service   │
        └──────────────┘ └────────────┘ └────────────┘
```

## 🛠️ Tech Stack

- **Backend**: Node.js, TypeScript, Express
- **Real-time**: Socket.io with Redis adapter
- **Database**: MongoDB with Mongoose
- **Cache**: Redis for session, presence, and message caching
- **Message Queue**: Apache Kafka
- **Load Balancer**: Nginx
- **Containerization**: Docker & Docker Compose
- **AI**: Google Gemini 2.0 Flash
- **Monitoring**: Custom metrics service

## 📦 Installation

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB (if running locally)
- Redis (if running locally)

### Quick Start with Docker

1. **Clone the repository**

```bash
git clone <repository-url>
cd talkline-server
```

2. **Set environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start all services**

```bash
docker-compose up -d
```

4. **Access the application**

- API: http://localhost:8000
- Socket Server: http://localhost:8001
- Documentation: http://localhost/docs
- Health Check: http://localhost/health

### Local Development

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment**

```bash
cp .env.example .env
# Configure your environment variables
```

3. **Start development servers**

```bash
# Start main server
npm run dev

# Start socket server (in another terminal)
cd socket-server && npm run dev
```

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=8000

# Database
MONGODB_URI=mongodb://localhost:27017/talkline

# Redis
REDIS_URL=redis://localhost:6379

# Kafka
KAFKA_BROKERS=localhost:9092

# JWT
JWT_SECRET=your-super-secret-jwt-key

# AI Service
GEMINI_API_KEY=your-gemini-api-key
```

## 📊 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token

### Users

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/search` - Search users

### Conversations

- `GET /api/v1/conversations` - Get user conversations
- `POST /api/v1/conversations` - Create conversation
- `GET /api/v1/conversations/:id` - Get conversation details

### Messages

- `GET /api/v1/messages/:conversationId` - Get messages
- `POST /api/v1/messages` - Send message
- `PUT /api/v1/messages/status` - Update message status

### Monitoring

- `GET /api/v1/monitoring/health` - Health check
- `GET /api/v1/monitoring/metrics` - Current metrics
- `GET /api/v1/monitoring/metrics/history` - Metrics history

## 🔌 WebSocket Events

### Client to Server

- `join_room` - Join conversation
- `leave_room` - Leave conversation
- `send_message` - Send message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `mark_read` - Mark messages as read

### Server to Client

- `message_received` - New message notification
- `message_delivered` - Message delivery confirmation
- `message_read` - Message read confirmation
- `user_typing` - User typing indicator
- `user_presence` - User online/offline status

## 📈 Scalability Features

### Caching Strategy

- **Message Cache**: Recent messages cached in Redis
- **User Presence**: Online status cached with TTL
- **Conversation Metadata**: Frequently accessed data cached
- **Rate Limiting**: Redis-backed sliding window

### Message Queue

- **Kafka Topics**: chat, notification, logging
- **Async Processing**: Offline message delivery
- **Event Sourcing**: Message history and analytics

### Horizontal Scaling

- **Stateless Design**: No server-side session storage
- **Redis Adapter**: Socket.io scaling across instances
- **Load Balancing**: Nginx round-robin distribution

## 🚀 Deployment

### Production Deployment

1. **Build and push Docker images**

```bash
docker build -t talkline-server .
docker push your-registry/talkline-server
```

2. **Deploy with Docker Compose**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Scale services**

```bash
docker-compose up -d --scale app=3 --scale socket-server=2
```

### Cloud Deployment

- **AWS**: Use ECS/EKS with Application Load Balancer
- **GCP**: Use GKE with Cloud Load Balancer
- **Azure**: Use AKS with Azure Load Balancer

## 📊 Monitoring & Observability

### Health Checks

- Application health: `/api/v1/monitoring/health`
- Database connectivity
- Redis connectivity
- Kafka connectivity

### Metrics

- QPS (Queries Per Second)
- Average response time
- Error rates
- Active users count
- Message throughput

### Logging

- Structured logging with timestamps
- Error tracking and alerting
- Request/response logging
- Performance monitoring

## 🔒 Security

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent abuse and DDoS
- **Input Validation**: Sanitize all inputs
- **CORS Configuration**: Cross-origin request handling
- **Error Handling**: No sensitive data leakage

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Load tests
npm run test:load
```

### Test Coverage

- Unit tests for all services
- Integration tests for API endpoints
- Load testing for scalability validation

## 📝 API Documentation

Interactive API documentation available at `/docs` when running the application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation at `/docs`
- Review the health check at `/health`

---

**Built for SDE-2/3 level scalability with production-ready features for handling 1M+ requests per second.**
