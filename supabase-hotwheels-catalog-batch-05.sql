insert into public.hotwheels_catalog_items (id, model_name, release_year, color, image_url, features, rarity_segment)
values
  ('hw-2026-68-mercury-cougar-metalflake-purple-regular-86b52988', '''68 Mercury Cougar', 2026, 'Metalflake Purple', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-slide-burn-metalflake-teal-regular-ea8f8674', 'Slide-Burn', 2026, 'Metalflake Teal', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-23-ram-1500-purple-regular-0724489c', '''23 Ram 1500', 2026, 'Purple', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-23-ram-1500-spectraflame-purple-sth-20172c75', '''23 Ram 1500', 2026, 'Spectraflame purple', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', array['STH']::text[], 'super_treasure_hunt'),
  ('hw-2026-go-realla-fast-gray-regular-80fb6c3f', 'Go-Realla-Fast', 2026, 'Gray', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-1963-ford-galaxie-dark-blue-regular-687e901d', '1963 Ford Galaxie', 2026, 'Dark blue', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-ridge-crest-gt-green-regular-b9a07944', 'Ridge Crest GT', 2026, 'Green', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-mini-jcw-electric-ocean-wave-green-regular-f3d416b2', 'Mini JCW Electric', 2026, 'Ocean Wave Green', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-1989-batmobile-cocoon-black-regular-0abbfa82', '1989 Batmobile Cocoon', 2026, 'Black', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-mickey-mouse-s-car-red-regular-9a0a7349', 'Mickey Mouse''s Car', 2026, 'Red', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-aston-martin-db5-safari-white-regular-95f8cd6b', 'Aston Martin DB5 Safari', 2026, 'White', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular'),
  ('hw-2026-custom-vanster-4wd-gray-regular-929c41ed', 'Custom Vanster 4WD', 2026, 'Gray', 'https://static.wikia.nocookie.net/hotwheels/images/b/b5/Image_Not_Available.jpg/revision/latest', '{}'::text[], 'regular')
on conflict (id) do update set
  model_name = excluded.model_name,
  release_year = excluded.release_year,
  color = excluded.color,
  image_url = excluded.image_url,
  features = excluded.features,
  rarity_segment = excluded.rarity_segment,
  updated_at = now();
