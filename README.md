# Northcoders News API

## Project Overview

A RESTful API for accessing and managing news articles, comments, and user data.

## Setup Instructions

### Prerequisites

- Node.js
- PostgreSQL

### Local Development Setup

1. Clone this repository:

```bash
git clone https://github.com/SViron00/sean-nc-news.git
cd sean-nc-news
```

2. Open in VSCode:

```bash
code .
```

## API Endpoints

### GET /api/topics

Returns all topics. Each topic has:

- `slug`: string (unique identifier)
- `description`: string

Example Response:

```json
{
  "topics": [
    {
      "slug": "coding",
      "description": "Code is love, code is life"
    }
  ]
}
```

### GET /api/articles/:article_id

Retrieves an article by its ID.

Response example:

```json
{
  "article": {
    "article_id": 1,
    "title": "Living in the shadow of a great man",
    "topic": "mitch",
    "author": "butter_bridge",
    "body": "I find this existence challenging",
    "created_at": "2020-07-09T20:11:00.000Z",
    "votes": 100,
    "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
  }
}
```

### GET /api/articles

Returns all articles sorted by date in descending order.

Example response:

```json
{
  "articles": [
    {
      "article_id": 1,
      "title": "Living in the shadow of a great man",
      "topic": "mitch",
      "author": "butter_bridge",
      "created_at": "2020-07-09T20:11:00.000Z",
      "votes": 100,
      "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      "comment_count": 11
    }
  ]
}
```

### GET /api/articles/:article_id/comments

Returns all comments for a specific article sorted by date in descending order.

Example response:

```json
{
  "comments": [
    {
      "comment_id": 1,
      "votes": 16,
      "created_at": "2020-04-06T12:17:00.000Z",
      "author": "butter_bridge",
      "body": "The beautiful thing about treasure is discovering it.",
      "article_id": 1
    }
  ]
}
```

### POST /api/articles/:article_id/comments

Adds a new comment to an article.

Request:

```json
{
  "username": "butter_bridge",
  "body": "Great article!"
}
```

Succesfull response:

```json
{
  "comment": {
    "comment_id": 19,
    "body": "Great article!",
    "article_id": 1,
    "author": "butter_bridge",
    "votes": 0,
    "created_at": "2023-11-20T08:25:00.000Z"
  }
}
```
