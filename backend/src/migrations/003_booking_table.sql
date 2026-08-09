CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    booking_number VARCHAR(30) NOT NULL UNIQUE,

    stay_id BIGINT UNSIGNED NOT NULL,
    guest_id BIGINT UNSIGNED NOT NULL,

    check_in DATE NOT NULL,
    check_out DATE NOT NULL,

    guests INT UNSIGNED NOT NULL DEFAULT 1,
    nights INT UNSIGNED NOT NULL,

    special_requests TEXT NULL,

    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'NPR',

    status ENUM(
        'pending',
        'confirmed',
        'cancelled'
    ) NOT NULL DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_stay
        FOREIGN KEY (stay_id)
        REFERENCES stays(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_booking_guest
        FOREIGN KEY (guest_id)
        REFERENCES guests(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    INDEX idx_booking_dates (
        stay_id,
        check_in,
        check_out
    ),

    INDEX idx_booking_status (status)
);