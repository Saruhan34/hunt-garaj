# Hunt Radar Supabase kurulumu

Supabase SQL Editor içinde dosyaları aşağıdaki sırayla çalıştır:

1. `supabase-auth.sql`
2. `supabase-content-ownership.sql`
3. `supabase-storage.sql`
4. `supabase-reward-system.sql`
5. `supabase-radar-note-photos.sql`

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
