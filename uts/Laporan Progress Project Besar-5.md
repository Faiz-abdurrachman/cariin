**Laporan Progress Project Besar #5**

**Pemrograman Berbasis Object**

Judul	: Cari.In Aplikasi Mobile Lost & Found Kampus UNU Yogyakarta
Periode	: 16 – 25 Juli 2026

Dokumentasi Kegiatan & Tanggal Kegiatan: 

| No | Foto Kegiatan | Keterangan | Tanggal  |
| :---- | :---- | :---- | :---- |
| 1 | Gambar 1 | Chat Realtime — Service Layer & Database Trigger | 16 – 18 Juli 2026 |
| 2 | Gambar 2 | Chat Realtime — UI (Inbox, ChatRoom, ChatBubble) | 19 – 22 Juli 2026 |
| 3 | Gambar 3 | Sistem Notifikasi In-App & Bell Badge | 23 – 25 Juli 2026 |

Deskripsi Kegiatan:

**1. Kegiatan 1: Chat Realtime — Service Layer & Database Trigger**

Kegiatan ini berfokus pada implementasi service layer chat dan trigger database untuk komunikasi realtime.

1. chat.service.ts: Mengimplementasikan 6 fungsi:
   a. listConversations(): Query conversations dengan JOIN user_a dan user_b profiles, filter or(user_a_id, user_b_id) = auth.uid(), order by last_at DESC.
   b. getOrCreateConversation(reportId, otherUserId): Upsert conversation dengan unique constraint (report_id, user_a_id, user_b_id). User di-sort (currentUserId < otherUserId → user_a, else user_b) untuk konsistensi unique key.
   c. listMessages(conversationId): Query messages, order by created_at ASC.
   d. sendMessage(conversationId, content): Insert ke messages dengan sender_id = auth.uid(). Content di-trim. Return message yang baru dibuat.
   e. subscribeToMessages(conversationId, callback): Buat Supabase Realtime channel dengan postgres_changes filter: event='INSERT', table='messages', filter='conversation_id=eq.{id}'. Callback dipanggil dengan payload.new setiap ada pesan baru.
   f. markMessagesAsRead(conversationId): Bulk UPDATE is_read=true untuk pesan dari sender lain (neq sender_id) yang belum read.

2. chatStore (Zustand): State mencakup conversations, messages (Record<conversationId, Message[]>), activeChannel, loadingConversations, loadingMessages. Method: fetchConversations, fetchMessages, sendMessage, appendMessage (dipanggil dari realtime callback — cek duplikasi sebelum append), subscribe (unsubscribe channel lama, buat channel baru), unsubscribe (channel.unsubscribe + set null).

3. Trigger Database: notify_new_message() — AFTER INSERT pada messages. Function mencari receiver dari conversations (jika sender = user_a maka receiver = user_b, sebaliknya). Insert notifikasi ke tabel notifications dengan type='new_message', title='Pesan Baru', body='{sender_name}: {content_preview_80_chars}'.

4. Penerapan OOP — Encapsulation & Polymorphism:
   a. Encapsulation: chat.service.ts adalah facade ke Supabase — UI tidak tahu bahwa di belakangnya ada PostgREST query dengan foreign embed, Realtime WebSocket subscription, dan insert trigger. Semua dibungkus dalam fungsi deklaratif.
   b. Polymorphism: getOrCreateConversation berperilaku berbeda — jika conversation sudah ada (found via unique constraint), return existing; jika tidak, insert baru dan return created. MarkMessagesAsRead hanya update pesan dari sender lain — behavior berbeda berdasarkan sender_id vs currentUserId.

*Gambar 1: Chat Service Layer — screenshot code chat.service.ts (listConversations, sendMessage), screenshot code chatStore Zustand (subscribe/unsubscribe), screenshot SQL trigger notify_new_message, diagram sequence: User A send → INSERT messages → trigger notify_new_message → receiver notification.*

**2. Kegiatan 2: Chat Realtime — UI (Inbox, ChatRoom, ChatBubble)**

Kegiatan ini berfokus pada implementasi antarmuka chat.

1. ChatBubble Component: Komponen reusable yang menampilkan bubble pesan kiri (other user, bg #F4F4F5) atau kanan (me, bg COLORS.primary/blue). Setiap bubble menampilkan content, timestamp (formatRelativeTime), dan read indicator (Feather check icon). Timestamp hanya muncul jika pengirim berbeda dari pesan sebelumnya (grouping).

2. InboxScreen: FlatList menampilkan daftar percakapan terurut last_at DESC. Setiap item menampilkan avatar lawan bicara (lingkaran 52px, fallback Feather user icon), nama, last_message preview (1 baris, textMuted), dan last_at relative time. Tap item → navigate ke ChatRoom. Pull-to-refresh reload conversations. Empty state dengan icon message-circle.

3. ChatRoomScreen: Header dengan back button (Feather arrow-left), nama lawan bicara + avatar kecil — tap → navigate ke UserProfile. FlatList menampilkan daftar ChatBubble (data dari chatStore.messages[conversationId]). Input bar di bawah — TextInput multiline (max 100px), tombol kirim (Feather send, hanya aktif jika text.trim() tidak kosong). KeyboardAvoidingView untuk handle keyboard.

4. Realtime Integration: useEffect saat mount — fetchMessages, subscribe(conversationId), markMessagesAsRead(conversationId), fetchConversations. Cleanup — unsubscribe. useEffect pada messages.length — scrollToEnd. Saat sendMessage → setText(''), scrollToEnd, fetchConversations (update last_message).

5. Navigation Update: DetailReportScreen tombol Chat tidak lagi menampilkan Alert "Segera hadir". Sekarang memanggil getOrCreateConversation(reportId, report.user_id) → navigate ke ChatRoom dengan conversationId.

6. Penerapan OOP — Polymorphism:
   a. Polymorphism: ChatBubble memiliki perilaku visual berbeda berdasarkan isMine prop — alignment flex-end vs flex-start, bg blue vs gray, border radius berbeda (borderBottomRightRadius: 4 vs borderBottomLeftRadius: 4). showTime prop mengontrol apakah timestamp ditampilkan (grouping pesan dari sender yang sama).

*Gambar 2: Chat UI — screenshot InboxScreen dengan daftar percakapan, screenshot ChatRoomScreen dengan bubble kiri/kanan dan input bar, screenshot ChatBubble component (close-up), screenshot DetailReportScreen tombol Chat yang sudah aktif, screenshot code ChatRoomScreen useEffect (subscribe/unsubscribe), screenshot KeyboardAvoidingView behavior.*

**3. Kegiatan 3: Sistem Notifikasi In-App & Bell Badge**

Kegiatan ini berfokus pada implementasi sistem notifikasi dan badge.

1. notification.service.ts: Mengimplementasikan 4 fungsi:
   a. listNotifications(): Query notifications, order by created_at DESC, limit 50.
   b. markAsRead(id): UPDATE is_read=true WHERE id.
   c. markAllAsRead(): Bulk UPDATE is_read=true WHERE is_read=false (current user via RLS).
   d. unreadCount(): SELECT count(*) WHERE is_read=false, pakai head=true untuk efisiensi.

2. NotifContext (React Context): State unread (number). Method refresh() — call unreadCount() jika isAuthenticated. Auto-polling setiap 15 detik via setInterval di useEffect. Auto-refresh saat login/register via isAuthenticated dependency.

3. NotificationsScreen: FlatList menampilkan notifikasi dengan icon berbeda per type:
   - report_approved: Feather check-circle, warna emerald (#059669), bg emerald-50
   - report_rejected: Feather x-circle, warna orange (#F97316), bg orange-50
   - new_message: Feather message-circle, warna blue (#2563EB), bg blue-50
   Tap notifikasi → markAsRead + refreshBadge. Jika type 'new_message' → navigate ke ChatRoom. Jika type report → navigate ke DetailLost via cross-stack navigation (getParent<MainTabParamList>() → HomeTab → DetailLost).

4. Bell Badge di HomeScreen: Pressable bell icon di header kanan dengan overlay badge merah (absolute, top:-2, right:-2, minWidth:18, bg:#EF4444, border:1.5 white). Jika userProfile.avatar_url ada, tampilkan avatar sebagai pengganti bell. Badge menampilkan unread count (>99 → '99+').

5. Penerapan OOP — Abstraction:
   a. Abstraction: NotifContext menyediakan unread count global tanpa komponen perlu tahu polling mechanism. notification.service membungkus query Supabase — UI hanya memanggil unreadCount() dan dapat angka, tanpa tahu SELECT count(*).
   b. Polymorphism: NotificationsScreen navigasi berbeda berdasarkan notification.type — 'new_message' → ChatRoom, selain itu → DetailLost. Satu component menangani multiple navigation outcomes.

*Gambar 3: Notifikasi & Bell Badge — screenshot NotificationsScreen dengan 3 tipe notifikasi, screenshot HomeScreen dengan bell badge merah, screenshot ChatRoom setelah tap notifikasi new_message, code snippet NotifContext (polling 15 detik), code snippet notification.service.ts (unreadCount).*

Kontribusi Anggota:

| NO | NAMA | NIM | KONTRIBUSI |
| :--- | :--- | :--- | :--- |
| 1 | Irham Zubaidi Alhuda | 241111006 | Membantu dokumentasi chat UI, screenshot Inbox & ChatRoom, penyusunan laporan progress #5 |
| 2 | Galih Witradika | 241111013 | Testing chat realtime (2 akun simultan), validasi flow notifikasi, bug report |
| 3 | Faiz Abdurrahman | 241111021 | Implementasi chat.service.ts (6 fungsi) & chatStore Zustand (subscribe/unsubscribe). Implementasi trigger notify_new_message (SQL). Implementasi InboxScreen, ChatRoomScreen, ChatBubble. Implementasi notification.service.ts (4 fungsi), NotifContext (polling 15 detik), NotificationsScreen, bell badge di HomeScreen. Wiring DetailReportScreen tombol Chat ke getOrCreateConversation. |
| 4 | Ibnul Mubarok | 241111026 | Membantu penyusunan laporan, pengujian chat realtime, dokumentasi skenario testing chat |
| 5 | Imroatu Zakiyah | 241111032 | Validasi flow notifikasi user. Membantu penyusunan capaian kerja. |
| 6 | Aldo Yulian | 241111037 | Dokumentasi screenshot notifikasi. Pengujian bell badge behavior. |

Capaian Kerja: 

1. Chat service layer berfungsi — 6 fungsi chat (listConversations, getOrCreateConversation, sendMessage, listMessages, subscribeToMessages, markMessagesAsRead). Supabase Realtime subscription via postgres_changes channel.  

2. Chat UI berfungsi — InboxScreen (daftar percakapan), ChatRoomScreen (bubble kiri/kanan + realtime), ChatBubble component (timestamp grouping, read indicator). Tombol Chat di DetailReportScreen sudah terhubung.  

3. Trigger notifikasi berfungsi — notify_new_message() AFTER INSERT messages → auto insert notifikasi ke receiver. Diuji dengan 2 akun simultan.  

4. Sistem notifikasi berfungsi — notification.service.ts (list, markAsRead, markAllAsRead, unreadCount), NotifContext (polling 15 detik), NotificationsScreen (3 tipe notifikasi + tap navigasi).  

5. Bell badge berfungsi — HomeScreen header menampilkan badge merah dengan unread count. Auto-update via NotifContext setiap 15 detik.  

Target Minggu Depan: 

1. Target 1: Implementasi Admin Dashboard: Mengimplementasikan dashboard admin dengan stat cards (Pending, Disetujui, Ditolak, Total), tab filter, dan list laporan.  

2. Target 2: Implementasi Admin Review: Mengimplementasikan screen review dengan tombol Approve/Reject, modal alasan reject, dan tombol Chat Pemilik.  

3. Target 3: Implementasi Admin Reports & Walk-in: Mengimplementasikan daftar semua laporan dengan filter status dan search, serta form walk-in report.
