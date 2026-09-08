USE board_games_shop;

START TRANSACTION;

INSERT INTO categories (name, description) VALUES
  ('Strategy', 'Deep decisions, planning, and long-term thinking.'),
  ('Family', 'Accessible games for a wide range of ages.'),
  ('Party', 'Social games for groups and lively evenings.'),
  ('Two player', 'Focused games designed for two people.'),
  ('Cooperative', 'Work together against the game.'),
  ('Abstract', 'Elegant rules with a focus on patterns and tactics.');

INSERT INTO users (role, name, email, password_hash) VALUES
  ('admin', 'Store Administrator', 'admin@example.com', '$2b$12$iuSnmsGk6Aiz0OJzJDHymOGc/jeBmyJ6nXonIxjSDNVy17qJeq7KO'),
  ('customer', 'Demo Customer', 'customer@example.com', '$2b$12$SaTFZ5JbLQSt2FL0CfvcuOiSrTpK5zpfWxfq9qDazoZYeFrsqdgpK'),
  ('customer', 'Amina Saleh', 'amina@example.com', '$2b$12$SaTFZ5JbLQSt2FL0CfvcuOiSrTpK5zpfWxfq9qDazoZYeFrsqdgpK');

INSERT INTO addresses (user_id, recipient_name, line_1, city, postal_code, country) VALUES
  (2, 'Demo Customer', '12 Cedar Avenue', 'Amman', '11181', 'Jordan'),
  (3, 'Amina Saleh', '8 Garden Street', 'Amman', '11821', 'Jordan');

INSERT INTO products (category_id, name, description, price, stock_quantity, rating) VALUES
  (1, 'Wingspan', 'Build a wildlife preserve and attract birds to your habitat.', 49.99, 8, 4.9),
  (2, 'Cascadia', 'Create a beautiful ecosystem of habitats and wildlife.', 34.99, 12, 4.8),
  (1, 'Root', 'Lead a faction in a woodland battle for control.', 59.99, 5, 4.7),
  (6, 'Azul', 'Draft tiles and create the most beautiful mosaic.', 39.99, 10, 4.8),
  (5, 'Pandemic', 'Work together to stop four diseases spreading worldwide.', 39.99, 9, 4.7),
  (1, 'Terraforming Mars', 'Corporations compete to make Mars habitable.', 54.99, 6, 4.8),
  (2, 'Ticket to Ride', 'Collect cards and claim railway routes across the map.', 44.99, 14, 4.8),
  (3, 'Codenames', 'Give clever clues to help your team find the right words.', 19.99, 20, 4.7),
  (4, 'Jaipur', 'Trade goods and race to become the best merchant.', 24.99, 11, 4.7),
  (1, '7 Wonders Duel', 'Build a civilization and outsmart your opponent.', 29.99, 7, 4.8),
  (5, 'The Crew', 'Complete silent cooperative missions in space.', 14.99, 16, 4.6),
  (2, 'Kingdomino', 'Build a kingdom by matching colorful domino landscapes.', 21.99, 13, 4.6),
  (3, 'Just One', 'Give one-word clues to help guess the mystery word.', 24.99, 15, 4.7),
  (1, 'Scythe', 'Develop an engine and lead your faction through Europe.', 89.99, 3, 4.8),
  (6, 'Calico', 'Arrange quilts to attract cats and complete patterns.', 39.99, 8, 4.6),
  (4, 'Patchwork', 'Build the most valuable quilt in this relaxing duel.', 29.99, 10, 4.7),
  (2, 'Sushi Go!', 'Pass cards and collect the best combination of dishes.', 12.99, 22, 4.6),
  (3, 'Dixit', 'Tell imaginative stories from beautifully illustrated cards.', 34.99, 9, 4.7),
  (1, 'Viticulture', 'Grow grapes and run a successful vineyard in Tuscany.', 49.99, 6, 4.7),
  (5, 'The Mind', 'Play cards in ascending order without speaking.', 14.99, 18, 4.5),
  (2, 'Carcassonne', 'Place tiles and build a medieval landscape together.', 32.99, 10, 4.7),
  (1, 'Everdell', 'Build a woodland city full of charming creatures.', 69.99, 4, 4.8),
  (3, 'Wavelength', 'Read the room and find the hidden spectrum target.', 29.99, 12, 4.6),
  (4, 'Hive', 'Surround your opponent queen using clever insect pieces.', 27.99, 8, 4.7),
  (6, 'Sagrada', 'Craft a stained-glass window using colorful dice.', 39.99, 7, 4.6),
  (1, 'Clank!', 'Build a deck and steal treasures from a dragon lair.', 59.99, 5, 4.7),
  (2, 'PARKS', 'Travel through national parks and collect beautiful memories.', 49.99, 6, 4.7),
  (5, 'Forbidden Island', 'Recover ancient treasures before the island sinks.', 24.99, 14, 4.5),
  (3, 'Telestrations', 'Draw and guess as messages hilariously transform.', 29.99, 11, 4.6),
  (1, 'Lost Ruins of Arnak', 'Explore an island while managing resources and discoveries.', 54.99, 5, 4.8),
  (4, 'Onitama', 'Outmaneuver your opponent with changing movement cards.', 34.99, 8, 4.7),
  (2, 'Takenoko', 'Grow bamboo and keep a hungry panda happy.', 39.99, 9, 4.6);

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, CONCAT('https://placehold.co/800x800/e7b742/182623?text=', REPLACE(name, ' ', '+')), TRUE
FROM products;

INSERT INTO carts (user_id) VALUES (2), (3);
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (1, 1, 1), (1, 8, 2), (2, 4, 1);

INSERT INTO orders (user_id, status, total_amount) VALUES
  (2, 'delivered', 89.97),
  (3, 'processing', 87.97),
  (2, 'paid', 39.99);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 49.99), (1, 8, 2, 19.99),
  (2, 2, 1, 34.99), (2, 4, 1, 39.99), (2, 17, 1, 12.99),
  (3, 4, 1, 39.99);

INSERT INTO order_addresses (order_id, recipient_name, line_1, city, postal_code, country) VALUES
  (1, 'Demo Customer', '12 Cedar Avenue', 'Amman', '11181', 'Jordan'),
  (2, 'Amina Saleh', '8 Garden Street', 'Amman', '11821', 'Jordan'),
  (3, 'Demo Customer', '12 Cedar Avenue', 'Amman', '11181', 'Jordan');

INSERT INTO payments (order_id, provider, provider_reference, status, amount) VALUES
  (1, 'stripe_test', 'pi_demo_delivered_001', 'succeeded', 89.97),
  (2, 'stripe_test', 'pi_demo_processing_002', 'succeeded', 87.97),
  (3, 'stripe_test', 'pi_demo_paid_003', 'succeeded', 39.99);

COMMIT;
