CREATE TABLE stays (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,

    location VARCHAR(255) NOT NULL,
    description TEXT NULL,
    short_description TEXT NULL,

    amenities JSON NULL,

    price_per_night DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'NPR',

    max_guests INT UNSIGNED NOT NULL DEFAULT 2,

    image_url VARCHAR(500) NULL,
    video_url VARCHAR(500) NULL,
    gallery JSON NULL,
    experience JSON NULL,
    virtual_experience_url VARCHAR(500) NULL,

    status ENUM(
        'active',
        'inactive'
    ) NOT NULL DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_stays_status (status),
    INDEX idx_stays_slug (slug)
);