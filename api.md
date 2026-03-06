# API Reference — api.historein

Kapsamli API referans dokumani. Tum endpoint'ler, request/response yapilari ve hata kodlari.

---

## Genel Bilgiler

| Ozellik | Deger |
|---------|-------|
| Base URL | `/api` |
| Versioning | URI-based (`/api/v1/...`) |
| Content-Type | `application/json` |
| Auth | Bearer JWT token |
| Multi-tenant | `X-Client-ID` header |
| Swagger UI | `/api/docs/swagger` |
| Scalar | `/api/docs/scalar` |

---

## Kimlik Dogrulama (Authentication)

### JWT Token Yapisi

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "phone": "+905551234567",
  "role": "user",
  "clientId": "client-uuid",
  "iat": 1700000000,
  "exp": 1700086400
}
```

### Token Gonderimi

Tum korunmus endpoint'lere `Authorization` header ile token gonderilir:

```
Authorization: Bearer <access_token>
```

### X-Client-ID Header

Multi-tenant yapisinda, her istek `X-Client-ID` header'i icerir. Public rotalarda JWT yoksa bu header ile tenant belirlenir. Authenticated rotalarda JWT icindeki `clientId` kullanilir.

```
X-Client-ID: <client-uuid>
```

### Public Rotalar

`@Public()` ile isaretlenmis rotalar authentication gerektirmez. Diger tum rotalar JWT gerektirir (global `JwtAuthGuard`).

---

## Standart Response Formatlari

### Basarili Tek Kayit

```json
{
  "success": true,
  "message": "Done",
  "meta": {
    "timestamp": "2025-06-15T14:30:00.000Z",
    "path": "/api/v1/users/me/credit",
    "correlationId": "uuid"
  },
  "data": { ... }
}
```

### Basarili Cursor Pagination

```json
{
  "success": true,
  "message": "Listed",
  "pagination": {
    "nextCursor": "uuid-v7",
    "hasNextPage": true,
    "limit": 10
  },
  "meta": {
    "timestamp": "2025-06-15T14:30:00.000Z",
    "path": "/api/v1/calls",
    "correlationId": "uuid"
  },
  "data": [ ... ]
}
```

### Hata Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "phone",
      "message": "phone must be a valid phone number"
    }
  ],
  "meta": {
    "timestamp": "2025-06-15T14:30:00.000Z",
    "path": "/api/v1/auth/login",
    "correlationId": "uuid"
  }
}
```

---

## Cursor Pagination Kullanimi

Paginate edilen endpoint'ler `CursorPaginationDto` query parametreleri kabul eder:

| Param | Tip | Zorunlu | Aciklama |
|-------|-----|---------|----------|
| `limit` | integer | Hayir | Sayfa basina kayit (1-100, default: 10) |
| `after` | string | Hayir | Onceki sayfanin son elemaninin UUID v7 id'si (ileri pagination) |
| `before` | string | Hayir | Bu cursor'dan YENI olan kayitlari getirir (geri pagination) |

**Kullanim:**

```
GET /api/v1/calls?limit=20
GET /api/v1/calls?limit=20&after=0192d4e5-...
```

Response icindeki `pagination.nextCursor` degerini bir sonraki sayfa icin `after` parametresi olarak gonder. `pagination.hasNextPage` `false` ise daha fazla kayit yok.

---

## Hata Kodlari

### Genel

| Kod | Aciklama |
|-----|----------|
| `INTERNAL_SERVER_ERROR` | Sunucu hatasi |
| `VALIDATION_ERROR` | Request body/query dogrulama hatasi |
| `NOT_FOUND` | Kaynak bulunamadi |
| `UNAUTHORIZED` | Kimlik dogrulanamadi |
| `FORBIDDEN` | Yetki yok |
| `CONFLICT` | Catisma (ornegin tekil alan ihlali) |

### Authentication

| Kod | Aciklama |
|-----|----------|
| `INVALID_CREDENTIALS` | Yanlis telefon veya sifre |
| `TOKEN_EXPIRED` | JWT suresi dolmus |
| `TOKEN_INVALID` | Gecersiz JWT |
| `EMAIL_NOT_VERIFIED` | Email dogrulanmamis |
| `INVALID_VERIFICATION_TOKEN` | Gecersiz dogrulama kodu |
| `INVALID_REFRESH_TOKEN` | Gecersiz refresh token |
| `INVALID_RESET_TOKEN` | Gecersiz sifre sifirlama token'i |
| `INVALID_CURRENT_PASSWORD` | Mevcut sifre yanlis |
| `INVALID_CODE` | OTP kodu gecersiz |
| `TOO_MANY_ATTEMPTS` | Cok fazla deneme (rate limit) |

### User

| Kod | Aciklama |
|-----|----------|
| `USER_NOT_FOUND` | Kullanici bulunamadi |
| `USER_ALREADY_EXISTS` | Kullanici zaten mevcut |
| `USER_INACTIVE` | Hesap inaktif |
| `USER_BANNED` | Hesap yasakli |
| `EMAIL_ALREADY_EXISTS` | Email zaten kullaniliyor |
| `EMAIL_ALREADY_VERIFIED` | Email zaten dogrulanmis |

### File

| Kod | Aciklama |
|-----|----------|
| `FILE_TOO_LARGE` | Dosya boyutu siniri asildi |
| `FILE_TYPE_NOT_ALLOWED` | Dosya tipi desteklenmiyor |
| `FILE_UPLOAD_FAILED` | Dosya yukleme basarisiz |

### External Services

| Kod | Aciklama |
|-----|----------|
| `SMS_SERVICE_ERROR` | SMS servisi hatasi |
| `MAIL_SERVICE_ERROR` | Mail servisi hatasi |
| `STORAGE_SERVICE_ERROR` | Depolama servisi hatasi |
| `PUSH_NOTIFICATION_ERROR` | Push bildirim hatasi |

### Database

| Kod | Aciklama |
|-----|----------|
| `DATABASE_ERROR` | Veritabani hatasi |
| `QUERY_FAILED` | Sorgu basarisiz |

### Multi-Tenancy

| Kod | Aciklama |
|-----|----------|
| `CLIENT_NOT_FOUND` | Client (tenant) bulunamadi |
| `CLIENT_INACTIVE` | Client inaktif |
| `CLIENT_ID_MISSING` | Client ID eksik |

### Calls

| Kod | Aciklama |
|-----|----------|
| `CALL_NOT_FOUND` | Arama bulunamadi |
| `CALL_ALREADY_PROCESSED` | Arama zaten islenmis |
| `USER_PHONE_MISSING` | Kullanicinin telefon numarasi eksik |
| `INVALID_SCHEDULED_TIME` | Gecersiz planlama zamani |
| `INSUFFICIENT_CREDITS` | Yetersiz kredi |

### System Settings

| Kod | Aciklama |
|-----|----------|
| `SETTING_NOT_FOUND` | Ayar bulunamadi |

---

## Modul Endpoint'leri

---

### Auth

> Tum auth endpoint'leri `@Public()` — JWT gerektirmez.

#### POST /api/v1/auth/otp/send

OTP kodu gonderir (SMS). Rate limit: 5 istek / 60 saniye.

**Request Body:**

| Alan | Tip | Zorunlu | Aciklama |
|------|-----|---------|----------|
| `phone` | string | Evet | Telefon numarasi (E.164 format, orn: `+905551234567`) |
| `type` | string (enum) | Evet | OTP tipi: `register` veya `reset_password` |

**Request Ornegi:**

```json
{
  "phone": "+905551234567",
  "type": "register"
}
```

**Basarili Response (200):**

```json
{
  "success": true,
  "message": "OTP sent",
  "meta": { "timestamp": "...", "path": "/api/v1/auth/otp/send", "correlationId": "..." }
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 400 | `VALIDATION_ERROR` | Gecersiz telefon veya tip |
| 429 | `TOO_MANY_ATTEMPTS` | Rate limit asildi |
| 500 | `SMS_SERVICE_ERROR` | SMS gonderilemedi |

---

#### POST /api/v1/auth/register

Yeni kullanici kaydeder. Oncesinde OTP dogrulamasi gerekir.

**Request Body:**

| Alan | Tip | Zorunlu | Kisitlamalar |
|------|-----|---------|--------------|
| `phone` | string | Evet | E.164 format |
| `password` | string | Evet | Minimum 6 karakter |
| `code` | string | Evet | OTP kodu (orn: `123456`) |

**Request Ornegi:**

```json
{
  "phone": "+905551234567",
  "password": "guvenliSifre123",
  "code": "123456"
}
```

**Basarili Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "meta": { "timestamp": "...", "path": "/api/v1/auth/register", "correlationId": "..." },
  "data": {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": "0192d4e5-...",
      "phone": "+905551234567",
      "email": null,
      "role": "user",
      "isVerified": true,
      "credit": 0,
      "createdAt": "2025-06-15T14:30:00.000Z"
    }
  }
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 400 | `VALIDATION_ERROR` | Gecersiz input |
| 400 | `INVALID_CODE` | OTP kodu yanlis veya suresi dolmus |
| 409 | `USER_ALREADY_EXISTS` | Telefon zaten kayitli |

---

#### POST /api/v1/auth/login

Mevcut kullanici giris yapar.

**Request Body:**

| Alan | Tip | Zorunlu | Kisitlamalar |
|------|-----|---------|--------------|
| `phone` | string | Evet | E.164 format |
| `password` | string | Evet | Minimum 6 karakter |

**Request Ornegi:**

```json
{
  "phone": "+905551234567",
  "password": "guvenliSifre123"
}
```

**Basarili Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "meta": { "timestamp": "...", "path": "/api/v1/auth/login", "correlationId": "..." },
  "data": {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": "0192d4e5-...",
      "phone": "+905551234567",
      "email": null,
      "role": "user",
      "isVerified": true,
      "credit": 5,
      "createdAt": "2025-06-15T14:30:00.000Z"
    }
  }
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 400 | `VALIDATION_ERROR` | Gecersiz input |
| 401 | `INVALID_CREDENTIALS` | Yanlis telefon veya sifre |
| 403 | `USER_BANNED` | Hesap yasakli |
| 403 | `USER_INACTIVE` | Hesap inaktif |

---

#### POST /api/v1/auth/reset-password

Sifre sifirlar. Oncesinde `reset_password` tipinde OTP alinmis olmali.

**Request Body:**

| Alan | Tip | Zorunlu | Kisitlamalar |
|------|-----|---------|--------------|
| `phone` | string | Evet | E.164 format |
| `password` | string | Evet | Yeni sifre, minimum 6 karakter |
| `code` | string | Evet | OTP kodu |

**Request Ornegi:**

```json
{
  "phone": "+905551234567",
  "password": "yeniGuvenliSifre456",
  "code": "654321"
}
```

**Basarili Response (200):**

```json
{
  "success": true,
  "message": "Password reset successful",
  "meta": { "timestamp": "...", "path": "/api/v1/auth/reset-password", "correlationId": "..." }
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 400 | `VALIDATION_ERROR` | Gecersiz input |
| 400 | `INVALID_CODE` | OTP kodu yanlis veya suresi dolmus |
| 404 | `USER_NOT_FOUND` | Telefon numarasina ait kullanici yok |

---

### Users

> Tum user endpoint'leri JWT gerektirir.

#### GET /api/v1/users/me/credit

Oturum acmis kullanicinin kredi bilgisini dondurur.

**Auth:** Bearer JWT gerekli

**Request:** Body yok

**Basarili Response (200):**

```json
{
  "success": true,
  "message": "Credit bilgisi",
  "meta": { "timestamp": "...", "path": "/api/v1/users/me/credit", "correlationId": "..." },
  "data": {
    "credit": 5
  }
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 401 | `UNAUTHORIZED` | JWT eksik veya gecersiz |
| 404 | `USER_NOT_FOUND` | Kullanici bulunamadi |

---

### Calls

> Tum calls endpoint'leri JWT gerektirir + `@ClientOnly('calltimer')` guard'i vardir. Sadece `calltimer` slug'ina sahip client'lar erisebilir.

#### POST /api/v1/calls

Yeni bir arama planlar. Kullanicinin 1 kredi harcanir.

**Auth:** Bearer JWT gerekli | Client slug: `calltimer`

**Request Body:**

| Alan | Tip | Zorunlu | Kisitlamalar |
|------|-----|---------|--------------|
| `scheduledAt` | string | Evet | Lokal datetime, timezone offset'siz (orn: `2025-06-15T14:30:00`) |
| `timezone` | string | Evet | IANA timezone (orn: `America/New_York`, `Europe/Istanbul`) |
| `notes` | string | Hayir | Arama notu, max 500 karakter |

**Request Ornegi:**

```json
{
  "scheduledAt": "2025-06-15T14:30:00",
  "timezone": "Europe/Istanbul",
  "notes": "Is gorusmesi hatirlatmasi"
}
```

**Basarili Response (201):**

```json
{
  "success": true,
  "message": "Call scheduled successfully",
  "meta": { "timestamp": "...", "path": "/api/v1/calls", "correlationId": "..." },
  "data": {
    "id": "0192d4e5-...",
    "userId": "0192d4e5-...",
    "phone": "+905551234567",
    "scheduledAt": "2025-06-15T11:30:00.000Z",
    "timezone": "Europe/Istanbul",
    "status": "pending",
    "notes": "Is gorusmesi hatirlatmasi",
    "calledAt": null,
    "failureReason": null,
    "createdAt": "2025-06-15T10:00:00.000Z"
  }
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 400 | `VALIDATION_ERROR` | Gecersiz input |
| 400 | `INVALID_SCHEDULED_TIME` | Gecmis bir zaman girildi |
| 400 | `USER_PHONE_MISSING` | Kullanicinin telefon numarasi yok |
| 400 | `INSUFFICIENT_CREDITS` | Yetersiz kredi |
| 401 | `UNAUTHORIZED` | JWT eksik veya gecersiz |
| 403 | `FORBIDDEN` | Client slug `calltimer` degil |

---

#### GET /api/v1/calls

Kullanicinin aramalarini listeler (cursor paginated).

**Auth:** Bearer JWT gerekli | Client slug: `calltimer`

**Query Parameters:**

| Param | Tip | Zorunlu | Aciklama |
|-------|-----|---------|----------|
| `limit` | integer | Hayir | 1-100, default: 10 |
| `after` | string | Hayir | Cursor (UUID v7) — ileri sayfalama |
| `before` | string | Hayir | Cursor (UUID v7) — geri sayfalama |
| `status` | string (enum) | Hayir | Filtre: `pending`, `in_progress`, `completed`, `failed`, `cancelled` |

**Ornek:**

```
GET /api/v1/calls?limit=20&status=pending
GET /api/v1/calls?limit=10&after=0192d4e5-...
```

**Basarili Response (200):**

```json
{
  "success": true,
  "message": "Calls listed",
  "pagination": {
    "nextCursor": "0192d4e5-...",
    "hasNextPage": true,
    "limit": 20
  },
  "meta": { "timestamp": "...", "path": "/api/v1/calls", "correlationId": "..." },
  "data": [
    {
      "id": "0192d4e5-...",
      "userId": "0192d4e5-...",
      "phone": "+905551234567",
      "scheduledAt": "2025-06-15T11:30:00.000Z",
      "timezone": "Europe/Istanbul",
      "status": "pending",
      "notes": "Is gorusmesi",
      "calledAt": null,
      "failureReason": null,
      "createdAt": "2025-06-15T10:00:00.000Z"
    }
  ]
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 401 | `UNAUTHORIZED` | JWT eksik veya gecersiz |
| 403 | `FORBIDDEN` | Client slug `calltimer` degil |

---

#### DELETE /api/v1/calls/:id

Bekleyen bir aramayi iptal eder.

**Auth:** Bearer JWT gerekli | Client slug: `calltimer`

**URL Params:**

| Param | Tip | Zorunlu | Aciklama |
|-------|-----|---------|----------|
| `id` | string (UUID) | Evet | Iptal edilecek arama ID'si |

**Basarili Response (200):**

```json
{
  "success": true,
  "message": "Call cancelled successfully",
  "meta": { "timestamp": "...", "path": "/api/v1/calls/0192d4e5-...", "correlationId": "..." }
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 401 | `UNAUTHORIZED` | JWT eksik veya gecersiz |
| 403 | `FORBIDDEN` | Client slug `calltimer` degil |
| 404 | `CALL_NOT_FOUND` | Arama bulunamadi veya baska kullaniciya ait |
| 409 | `CALL_ALREADY_PROCESSED` | Arama zaten islenmis (completed/failed/cancelled) |

---

### System Settings

> Tum system-settings endpoint'leri `@Public()` — JWT gerektirmez. Tenant-scoped: her client kendi ayarlarini gorur.

#### GET /api/v1/system-settings

Tum sistem ayarlarini listeler.

**Auth:** Gerekmiyor (public)

**Request:** Body/query yok

**Basarili Response (200):**

```json
{
  "success": true,
  "message": "System settings listed",
  "meta": { "timestamp": "...", "path": "/api/v1/system-settings", "correlationId": "..." },
  "data": [
    {
      "id": "0192d4e5-...",
      "clientId": "0192d4e5-...",
      "key": "call_duration_seconds",
      "value": "30",
      "createdAt": "2025-06-15T10:00:00.000Z",
      "updatedAt": "2025-06-15T10:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/v1/system-settings/:key

Tek bir sistem ayarini key ile getirir.

**Auth:** Gerekmiyor (public)

**URL Params:**

| Param | Tip | Zorunlu | Aciklama |
|-------|-----|---------|----------|
| `key` | string | Evet | Ayar anahtari |

**Basarili Response (200):**

```json
{
  "success": true,
  "message": "System setting retrieved",
  "meta": { "timestamp": "...", "path": "/api/v1/system-settings/call_duration_seconds", "correlationId": "..." },
  "data": {
    "id": "0192d4e5-...",
    "clientId": "0192d4e5-...",
    "key": "call_duration_seconds",
    "value": "30",
    "createdAt": "2025-06-15T10:00:00.000Z",
    "updatedAt": "2025-06-15T10:00:00.000Z"
  }
}
```

**Olasi Hatalar:**

| HTTP | Hata Kodu | Durum |
|------|-----------|-------|
| 404 | `SETTING_NOT_FOUND` | Ayar bulunamadi |

---

### Clients

> Client modulu controller icermez. Internal servis olarak kullanilir. Client'lar migration ile seed edilir.

Client entity alanlari (referans):

| Alan | Tip | Aciklama |
|------|-----|----------|
| `id` | UUID v7 | Primary key |
| `name` | string | Client adi |
| `slug` | string | Unique slug (orn: `calltimer`) |
| `isActive` | boolean | Aktif durumu |
| `createdAt` | datetime | Olusturulma tarihi |
| `updatedAt` | datetime | Guncellenme tarihi |

---

## Enum Referanslari

### OtpType

| Deger | Aciklama |
|-------|----------|
| `register` | Kayit OTP'si |
| `reset_password` | Sifre sifirlama OTP'si |

### UserRole

| Deger | Aciklama |
|-------|----------|
| `admin` | Yonetici |
| `user` | Normal kullanici |
| `moderator` | Moderator |

### CallStatus

| Deger | Aciklama |
|-------|----------|
| `pending` | Bekliyor |
| `in_progress` | Devam ediyor |
| `completed` | Tamamlandi |
| `failed` | Basarisiz |
| `cancelled` | Iptal edildi |
