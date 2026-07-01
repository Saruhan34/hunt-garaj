# Hunt Radar Supabase kurulumu

Supabase SQL Editor içinde dosyaları aşağıdaki sırayla çalıştır:

1. `supabase-auth.sql`
2. `supabase-content-ownership.sql`
3. `supabase-storage.sql`
4. `supabase-reward-system.sql`
5. `supabase-radar-note-photos.sql`
6. `supabase-garage-explore.sql`

Mevcut bir Hunt Radar kurulumu ödül sistemi için güncelleniyorsa son sürüm
`supabase-reward-system.sql` dosyasını yeniden çalıştırmak yeterlidir. Dosya
`create table if not exists`, `create or replace function`, `drop policy if
exists` ve upsert yapılarıyla tekrar çalıştırılabilir hazırlanmıştır.

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
