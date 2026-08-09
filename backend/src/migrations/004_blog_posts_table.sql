CREATE TABLE blog_posts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(150) NOT NULL DEFAULT 'SpendSelf',
    published_date DATE NOT NULL,
    read_time VARCHAR(50) NOT NULL,
    image VARCHAR(500) NOT NULL,
    content LONGTEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY unique_blog_slug (slug),
    INDEX idx_blog_category (category),
    INDEX idx_blog_published (published),
    INDEX idx_blog_featured (featured),
    INDEX idx_blog_date (published_date)
);