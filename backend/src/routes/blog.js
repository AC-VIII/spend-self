const express = require("express");

const {
  getBlogPosts,
  getBlogPost,
  getBlogCategories,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require("../controllers/blogController");

const router = express.Router();

/*
 * Public
 */
router.get("/", getBlogPosts);
router.get("/categories", getBlogCategories);
router.get("/:slug", getBlogPost);

/*
 * Admin
 *
 * For now these are unprotected.
 * We should add authentication middleware
 * before exposing these in production.
 */
router.post("/", createBlogPost);
router.put("/:id", updateBlogPost);
router.delete("/:id", deleteBlogPost);

module.exports = router;