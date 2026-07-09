# Hunt Radar Supabase kurulumu

Supabase SQL Editor içinde dosyaları aşağıdaki sırayla çalıştır:

1. `supabase-auth.sql`
2. `supabase-content-ownership.sql`
3. `supabase-user-garages.sql`
4. `supabase-profile-access-hardening.sql`
5. `supabase-content-access-hardening.sql`
6. `supabase-storage.sql`
7. `supabase-reward-system.sql`
8. `supabase-radar-note-photos.sql`
9. `supabase-garage-explore.sql`
10. `supabase-public-garage-social-profile.sql`
11. `supabase-profile-identity.sql`
12. `supabase-profile-visibility-hardening.sql`
13. `supabase-wishlist-system.sql`

Mevcut bir Hunt Radar kurulumu ödül sistemi için güncelleniyorsa son sürüm
`supabase-reward-system.sql` dosyasını yeniden çalıştırmak yeterlidir. Dosya
`create table if not exists`, `create or replace function`, `drop policy if
exists` ve upsert yapılarıyla tekrar çalıştırılabilir hazırlanmıştır.

## Kullanıcı adı sistemi

Güncel `supabase-auth.sql` kayıt sırasında seçilen kullanıcı adını UUID eki
eklemeden saklar. `is_username_available` RPC'si kayıt formunda uygunluk
kontrolü sağlar; kesin benzersizlik `lower(username)` indeksiyle veritabanında
korunur. `set_my_username` yalnızca giriş yapan kullanıcının kendi profilini ve
ona ait `content_records.owner_username` alanlarını günceller. Kullanıcı adı
olmayan OAuth hesapları ilk girişte zorunlu kullanıcı adı seçimine yönlendirilir.
Eski `-xxxxxx` ekli kullanıcı adları yalnızca çakışmasızsa güvenli biçimde
temizlenir.

## Premium profil kimliği

`supabase-profile-identity.sql` profil sayfasının ikinci fazı için `profiles`
tablosuna `bio`, `location`, `favorite_tags`, `showcase_vehicle_keys` ve
`profile_visibility` alanlarını ekler. Profil düzenleme UI'ı bu alanları
`set_profile_identity` RPC'siyle kaydeder; RPC yalnızca oturum açan kullanıcının
kendi profilini günceller ve favori etiketleri 5, vitrin araçlarını 6 öğeyle
sınırlar.

`supabase-profile-visibility-hardening.sql` public profil ve public garaj
RPC'lerini `profile_visibility` ile uyumlu hale getirir. Profil özel moddaysa
arama sonucu yalnızca minimum durum bilgisini döndürür; garaj, rozet ve araç
detayları veritabanı tarafında da kapalı kalır.

Çoklu radar fotoğrafı özelliği için ayrıca
`supabase-radar-note-photos.sql` dosyasını bir kez çalıştır. Bu dosya mevcut
tek `photo` alanını silmez veya değiştirmez; yalnızca yeni çoklu fotoğraf
tablosunu ve RLS politikalarını ekler. Dosyanın güncel sürümü kullanıcıların
yalnızca kendi `radar-notes/{user_id}/...` Storage klasörlerine fotoğraf
yükleyebilmesi için gerekli Storage politikalarını da içerir. Dosyanın önceki
sürümünü çalıştırdıysan güncel dosyayı yeniden Run et.

## Premium doğrulama sistemi

- Oylar yalnızca `vote_store_report` RPC üzerinden kaydedilir.
- Ham oy satırları ve oy veren kullanıcı kimlikleri istemcilere açılmaz.
- Kartların güvenli özeti `get_store_report_summaries` RPC üzerinden gelir.
- Bir kullanıcı aynı radar notuna bir kez oy verebilir ve kendi notuna oy veremez.
- 3 `correct` oyu `verified`, 3 `gone` oyu `expired`, 3 `wrong` oyu `disputed`
  durumu üretir.
- `disputed` durumunda bildirene yanlış bilgi cezası uygulanır.
- Radar notları oluşturulmalarından 8 saat sonra kapanır ve `expired` olur.

SQL çalıştırıldıktan sonra Supabase API şema önbelleğinin yenilenmesi birkaç
saniye sürebilir. Uygulamayı yeniden yükleyerek doğrulama özetlerini kontrol et.

## Premium Garage & Explore

`supabase-garage-explore.sql` mevcut `hotwheels_catalog_items` ve
`content_records` tablolarını yerinde geliştirir. Migration:

- mevcut katalog veya kullanıcı satırlarını silmez, seed etmez ve topluca güncellemez;
- katalog araması için generated `search_vector` ve GIN/B-tree indekslerini ekler;
- `search_hotwheels_catalog`, `get_hotwheels_catalog_facets` ve
  `mutate_vehicle_membership` RPC'lerini oluşturur;
- admin onaylı `vehicle_suggestions` akışını RLS ile kurar;
- Auth, reward, Radar ve Storage politikalarını değiştirmez.

Migration sonrasında şu kontrolleri yap:

1. Anon kullanıcı `search_hotwheels_catalog` çağırabilmeli.
2. Anon kullanıcı `mutate_vehicle_membership` çağıramamalı.
3. Giriş yapan kullanıcı yalnızca kendi Garage/Wishlist kaydını değiştirebilmeli.
4. Normal kullanıcı başka kullanıcıların araç önerilerini görememeli.
5. Admin kullanıcı önerileri onaylayıp reddedebilmeli.
6. `BMW`, seri adı, toy number ve release year aramaları sonuç döndürmeli.

Eski `supabase-hotwheels-catalog-import.sql` ve batch dosyalarını bu migration
için yeniden çalıştırma; ilk import dosyaları katalog tablosunu temizleyen
bootstrap komutları içerir.

## Premium İstek Listesi

`supabase-wishlist-system.sql` mevcut `content_records` yapısını korur; ayrı ve
paralel bir wishlist tablosu oluşturmaz. Eski manuel kayıtları silmeden eksik
`status`, `priority` ve zaman bilgilerini tamamlar. Katalog bağlantılı istekler
`catalogId` üzerinden çalışmaya devam eder.

`set_wishlist_item` RPC'si İstek Listesi sayfası, Keşfet kartları ve araç detay
paneli için tek atomik ekleme/çıkarma yoludur. Araç ana Supabase kataloğunda
varsa sunucu katalog verisini esas alır. Üretim kataloğu henüz aynı stabil kimliği
içermiyorsa paketlenmiş katalog bilgisi yalnızca kullanıcının özel wishlist
kaydında saklanır; ortak katalog tablosu istemci tarafından değiştirilemez.

Migration ayrıca `acquire_wishlist_vehicle` RPC'sini oluşturur. Bu işlem tek
transaction içinde garaj adedini artırır (veya garaj kaydını oluşturur) ve
wishlist kaydını `acquired` durumuna taşır. Fonksiyon yalnızca giriş yapan
kullanıcının kendi wishlist/garaj kayıtlarında çalışır.

Migration sonrasında şu kontrolleri yap:

1. Eski katalogsuz wishlist kayıtları görünmeye devam etmeli.
2. Kullanıcı yalnızca kendi wishlist kaydını okuyup değiştirebilmeli.
3. `acquire_wishlist_vehicle` aynı araç garajdaysa quantity değerini bir artırmalı.
4. Aynı çağrı wishlist kaydını `acquired` yapmalı.
5. Başka kullanıcının `catalogId` değerini kullanmak o kullanıcının kaydını değiştirmemeli.
6. `anon`, `set_wishlist_item` ve `acquire_wishlist_vehicle` RPC'lerini çalıştıramamalı.

## Kullanıcıya özel garajlar

`supabase-user-garages.sql` ortak garaj havuzunu kullanıcı bazlı erişime çevirir:

- Garage ve Wishlist kayıtları sahibine göre ayrılır.
- Wishlist daima yalnızca sahibine görünür.
- Açık garajlar yalnızca giriş yapan kullanıcılar tarafından görüntülenebilir.
- Özel garajların araçları gizlenir; aktif satış/takas kayıtları pazar için görünür kalır.
- Kullanıcı araması e-posta döndürmeyen `search_public_profiles` RPC'si üzerinden çalışır.
- `get_public_garage`, `get_my_garage`, `get_collection_market_listings` ve
  `set_garage_visibility` RPC'leri oluşturulur.

`supabase-public-garage-social-profile.sql` premium koleksiyoner profilini tamamlar:

- Güvenli preset avatar tercihini `profiles.avatar_id` alanında saklar.
- Profil, Radar Puanı, rozet hesaplama özeti ve açık garaj araçlarını tek çağrıda
  döndüren `get_public_garage_page` RPC'sini oluşturur.
- İstatistik, ortak araç ve eksik araç hesapları mevcut araç listesi üzerinden
  tarayıcıda yapılır; kart başına ek sorgu çalıştırılmaz.

Migration sonrasında iki farklı kullanıcıyla şu kontrolleri yap:

1. Kullanıcı A kendi garajında yalnızca kendi kayıtlarını görmeli.
2. Kullanıcı B aynı cihazda oturum açtığında Kullanıcı A'nın özel state'i görünmemeli.
3. Açık garaj kullanıcı adıyla bulunup salt okunur açılmalı.
4. Özel garajın araçları ve istatistikleri görünmemeli.
5. Özel garaj sahibinin aktif pazar ilanı görünmeye devam etmeli.
6. Başka kullanıcı UPDATE/DELETE işlemi yapamamalı.
