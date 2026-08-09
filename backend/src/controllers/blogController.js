const { pool } = require("../db/database");

/*
 * ============================================================
 * GET ALL BLOG POSTS
 * ============================================================
 *
 * GET /api/blog
 *
 * Optional:
 * GET /api/blog?category=Mental%20Reset
 */
exports.getBlogPosts = async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT
        id,
        slug,
        title,
        excerpt,
        category,
        author,
        published_date AS date,
        read_time AS readTime,
        image,
        content,
        featured,
        published,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM blog_posts
      WHERE published = 1
    `;

    const params = [];

    /*
     * Optional category filter
     */
    if (category && category !== "All") {
      query += `
        AND category = ?
      `;

      params.push(category);
    }

    query += `
      ORDER BY
        featured DESC,
        published_date DESC,
        id DESC
    `;

    const [rows] = await pool.execute(
      query,
      params
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "Get blog posts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve blog posts.",
    });
  }
};

/*
 * ============================================================
 * GET BLOG POST BY SLUG
 * ============================================================
 *
 * GET /api/blog/:slug
 */
exports.getBlogPost = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Blog slug is required.",
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        slug,
        title,
        excerpt,
        category,
        author,
        published_date AS date,
        read_time AS readTime,
        image,
        content,
        featured,
        published,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM blog_posts
      WHERE slug = ?
        AND published = 1
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "Get blog post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve blog post.",
    });
  }
};

/*
 * ============================================================
 * GET BLOG CATEGORIES
 * ============================================================
 *
 * GET /api/blog/categories
 */
exports.getBlogCategories = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT DISTINCT category
      FROM blog_posts
      WHERE published = 1
      ORDER BY category ASC
      `
    );

    const categories = [
      "All",
      ...rows.map((row) => row.category),
    ];

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "Get blog categories error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve blog categories.",
    });
  }
};

/*
 * ============================================================
 * CREATE BLOG POST
 * ============================================================
 *
 * POST /api/blog
 */
exports.createBlogPost = async (req, res) => {
  try {
    const {
      slug,
      title,
      excerpt,
      category,
      author,
      date,
      readTime,
      image,
      content,
      featured,
      published,
    } = req.body;

    /*
     * ---------------------------------------------
     * Validate required fields
     * ---------------------------------------------
     */

    if (
      !slug ||
      !title ||
      !excerpt ||
      !category ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Slug, title, excerpt, category and content are required.",
      });
    }

    /*
     * ---------------------------------------------
     * Normalize slug
     * ---------------------------------------------
     */

    const normalizedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    /*
     * ---------------------------------------------
     * Check duplicate slug
     * ---------------------------------------------
     */

    const [existing] = await pool.execute(
      `
      SELECT id
      FROM blog_posts
      WHERE slug = ?
      LIMIT 1
      `,
      [normalizedSlug]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "A blog post with this slug already exists.",
      });
    }

    /*
     * ---------------------------------------------
     * Insert blog post
     * ---------------------------------------------
     */

    const [result] = await pool.execute(
      `
      INSERT INTO blog_posts (
        slug,
        title,
        excerpt,
        category,
        author,
        published_date,
        read_time,
        image,
        content,
        featured,
        published
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        normalizedSlug,
        title.trim(),
        excerpt.trim(),
        category.trim(),
        author?.trim() || "SpendSelf",
        date || new Date(),
        readTime?.trim() || "5 min read",
        image?.trim() || null,
        content,
        featured ? 1 : 0,
        published !== false ? 1 : 0,
      ]
    );

    /*
     * ---------------------------------------------
     * Get created post
     * ---------------------------------------------
     */

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        slug,
        title,
        excerpt,
        category,
        author,
        published_date AS date,
        read_time AS readTime,
        image,
        content,
        featured,
        published,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM blog_posts
      WHERE id = ?
      LIMIT 1
      `,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message:
        "Blog post created successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "Create blog post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create blog post.",
    });
  }
};

/*
 * ============================================================
 * UPDATE BLOG POST
 * ============================================================
 *
 * PUT /api/blog/:id
 */
exports.updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      slug,
      title,
      excerpt,
      category,
      author,
      date,
      readTime,
      image,
      content,
      featured,
      published,
    } = req.body;

    /*
     * ---------------------------------------------
     * Validate ID
     * ---------------------------------------------
     */

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid blog post ID is required.",
      });
    }

    /*
     * ---------------------------------------------
     * Check post exists
     * ---------------------------------------------
     */

    const [existing] = await pool.execute(
      `
      SELECT id
      FROM blog_posts
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    /*
     * ---------------------------------------------
     * Normalize slug
     * ---------------------------------------------
     */

    const normalizedSlug = slug
      ? slug
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
      : undefined;

    /*
     * ---------------------------------------------
     * Check duplicate slug
     * ---------------------------------------------
     */

    if (normalizedSlug) {
      const [duplicate] =
        await pool.execute(
          `
          SELECT id
          FROM blog_posts
          WHERE slug = ?
            AND id != ?
          LIMIT 1
          `,
          [normalizedSlug, id]
        );

      if (duplicate.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            "Another blog post already uses this slug.",
        });
      }
    }

    /*
     * ---------------------------------------------
     * Update
     * ---------------------------------------------
     */

    await pool.execute(
      `
      UPDATE blog_posts
      SET
        slug = COALESCE(?, slug),
        title = COALESCE(?, title),
        excerpt = COALESCE(?, excerpt),
        category = COALESCE(?, category),
        author = COALESCE(?, author),
        published_date = COALESCE(?, published_date),
        read_time = COALESCE(?, read_time),
        image = COALESCE(?, image),
        content = COALESCE(?, content),
        featured = COALESCE(?, featured),
        published = COALESCE(?, published)
      WHERE id = ?
      `,
      [
        normalizedSlug,
        title?.trim(),
        excerpt?.trim(),
        category?.trim(),
        author?.trim(),
        date,
        readTime?.trim(),
        image?.trim(),
        content,
        typeof featured === "boolean"
          ? featured
            ? 1
            : 0
          : null,
        typeof published === "boolean"
          ? published
            ? 1
            : 0
          : null,
        id,
      ]
    );

    /*
     * ---------------------------------------------
     * Get updated post
     * ---------------------------------------------
     */

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        slug,
        title,
        excerpt,
        category,
        author,
        published_date AS date,
        read_time AS readTime,
        image,
        content,
        featured,
        published,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM blog_posts
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message:
        "Blog post updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "Update blog post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update blog post.",
    });
  }
};

/*
 * ============================================================
 * DELETE BLOG POST
 * ============================================================
 *
 * DELETE /api/blog/:id
 */
exports.deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid blog post ID is required.",
      });
    }

    const [result] = await pool.execute(
      `
      DELETE FROM blog_posts
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Blog post deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete blog post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete blog post.",
    });
  }
};