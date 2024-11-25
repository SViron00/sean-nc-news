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

2. OPen in VSCode :

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
