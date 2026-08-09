CREATE TABLE testimonials (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NULL,
    location VARCHAR(150) NULL,

    quote TEXT NOT NULL,

    image VARCHAR(1000) NULL,

    rating TINYINT UNSIGNED NOT NULL DEFAULT 5,

    featured BOOLEAN NOT NULL DEFAULT FALSE,

    status ENUM('draft', 'published') NOT NULL DEFAULT 'published',

    display_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_testimonials_status (status),
    INDEX idx_testimonials_featured (featured),
    INDEX idx_testimonials_display_order (display_order)
);