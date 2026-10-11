-- ==========================================================
-- StudyWise Initial Seed Data for Demo & Development
-- Note: Default demo user credentials:
-- Email: demo@studywise.com / Password: password123
-- Password hash generated with BCrypt strength 10
-- ==========================================================

-- Insert Demo User
INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES (
    1,
    'Alex Johnson',
    'demo@studywise.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
    'ROLE_USER',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE email=email;

-- Insert Subjects for Demo User
INSERT INTO subjects (id, name, description, color, user_id, created_at)
VALUES 
(1, 'Data Structures & Algorithms', 'Tree traversals, dynamic programming, graph algorithms', '#3B82F6', 1, CURRENT_TIMESTAMP),
(2, 'Database Management Systems', 'Relational algebra, SQL indexing, normalization, ACID', '#10B981', 1, CURRENT_TIMESTAMP),
(3, 'Operating Systems', 'Processes, threads, CPU scheduling, virtual memory', '#8B5CF6', 1, CURRENT_TIMESTAMP),
(4, 'Computer Networks', 'OSI model, TCP/IP, routing protocols, socket programming', '#F59E0B', 1, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE name=name;

-- Insert Study Plans / Tasks for Demo User
INSERT INTO study_plans (id, topic, date, start_time, end_time, priority, status, subject_id, user_id, notes, created_at)
VALUES 
(1, 'Binary Search Trees & AVL Trees', CURDATE(), '09:00:00', '11:00:00', 'HIGH', 'COMPLETED', 1, 1, 'Review insertion and rotation algorithms', CURRENT_TIMESTAMP),
(2, 'B+ Tree Indexing & Query Optimization', CURDATE(), '14:00:00', '16:00:00', 'HIGH', 'IN_PROGRESS', 2, 1, 'Solve practice problems on clustering indexes', CURRENT_TIMESTAMP),
(3, 'Process Synchronization & Semaphores', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '12:30:00', 'MEDIUM', 'PENDING', 3, 1, 'Dining philosophers problem and mutex locks', CURRENT_TIMESTAMP),
(4, 'TCP 3-Way Handshake & Congestion Control', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:00:00', '17:00:00', 'LOW', 'PENDING', 4, 1, 'Understand slow start and fast retransmit', CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE topic=topic;

-- Insert Notes for Demo User
INSERT INTO notes (id, title, content, subject_id, user_id, created_at, updated_at)
VALUES 
(1, 'AVL Tree Balancing Rules', '<h2>AVL Tree Properties</h2><p>An AVL tree is a self-balancing binary search tree where the difference between heights of left and right subtrees cannot be more than 1 for all nodes.</p><ul><li>Left-Left (LL) -> Right Rotation</li><li>Right-Right (RR) -> Left Rotation</li><li>Left-Right (LR) -> Left Rotate left child then Right Rotate root</li><li>Right-Left (RL) -> Right Rotate right child then Left Rotate root</li></ul>', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Database Normal Forms Cheatsheet', '<h2>Key Normalization Steps</h2><p><strong>1NF:</strong> Atomic values, unique column names, primary key defined.</p><p><strong>2NF:</strong> 1NF + No partial dependencies on composite primary key.</p><p><strong>3NF:</strong> 2NF + No transitive dependencies.</p><p><strong>BCNF:</strong> For every functional dependency X -> Y, X must be a super key.</p>', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE title=title;
