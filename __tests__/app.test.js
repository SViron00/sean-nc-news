const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: returns array of topic objects with slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: responds with error message when path not found", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: returns article object with all properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: returns error when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: returns error when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: returns array of article objects with required properties and makes sure comment_count is a number", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("404: responds with not found for invalid path", () => {
    return request(app)
      .get("/api/articlezzzz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns array of comments for given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: responds with an empty array when the article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ comments: [] });
      });
  });
  test("404: returns error when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: returns error when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: adds comment and responds with posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Great article!",
          article_id: 1,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("404: article does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: missing required fields", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: user does not exist", () => {
    const newComment = {
      username: "not_a_real_user",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: updates article votes and returns updated article", () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 101,
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: article not found", () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999")
      .send(voteUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: invalid article_id", () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/banana")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: invalid vote value", () => {
    const voteUpdate = { inc_votes: "banana" };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: responds with 'Bad request' when sent empty object", () => {
    const voteUpdate = {};
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: responds with 'Bad request' when object contains invalid keys", () => {
    const voteUpdate = { inc_votes: 1, extra_key: "invalid" };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: successfully deletes a comment by comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: responds with 'Not found' when comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: responds with 'Bad request' when comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/users", () => {
  test("200: returns array of all users with correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        expect(users[0]).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });

  test("404: responds with not found for invalid path", () => {
    return request(app)
      .get("/api/userss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("GET /api/articles (queries)", () => {
  test("200: accepts sort_by query defaulting to created_at", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("200: accepts order query defaulting to desc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });

  test("400: invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query parameter");
      });
  });

  test("400: invalid order query", () => {
    return request(app)
      .get("/api/articles?order=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query parameter");
      });
  });
});
describe("GET /api/articles (topic query)", () => {
  test("200: filters articles by topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("200: returns empty array for valid topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });

  test("404: invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=notATopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: returns article object with comment_count and the correct amount", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
        expect(article.comment_count).toBe(11);
      });
  });
  test("404: returns error when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: returns error when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
