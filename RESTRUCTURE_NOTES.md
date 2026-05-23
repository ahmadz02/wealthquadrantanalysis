# Wealth Quadrant Analyzer - Restructured App

## Folder structure

```text
project/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   ├── supabase-client.js
│   ├── roles.js
│   ├── storage.js
│   ├── app.js
│   └── modules/
│       ├── personal-data.js
│       ├── financial-objectives.js
│       ├── analysis-profile.js
│       └── pdf-profile.js
└── sql/
    ├── schema.sql
    ├── personal-data-schema.sql
    └── deploy-all.sql
```

## What was changed

1. Added `js/modules/` and moved the new feature modules there.
2. Updated `index.html` script loading order so modules load before `app.js`.
3. Updated `app.js` top navigation to: `Personal Data | Data Entry | Analysis`.
4. Added automatic mounting of the Personal Data page.
5. Added loading of Personal Data and Financial Objectives for the active user.
6. Injected Basic Personal Data and Financial Objectives into the Analysis page.
7. Patched print/PDF preparation to include the new report sections.
8. Exposed `WQStorage.getActiveUserId()` for module use.
9. Exposed `WQAuth.getUserId()` and `WQAuth.getProfile()` for module use.
10. Aligned SQL storage policies with `STORAGE_BUCKET: wealth-quadrant-analysis`.

## Supabase setup

For a fresh project, run:

```text
sql/deploy-all.sql
```

For an existing project that already ran `schema.sql`, run only:

```text
sql/personal-data-schema.sql
```

## Important

Keep this script order in `index.html`:

```html
<script src="js/config.js"></script>
<script src="js/supabase-client.js"></script>
<script src="js/roles.js"></script>
<script src="js/storage.js"></script>
<script src="js/modules/personal-data.js"></script>
<script src="js/modules/financial-objectives.js"></script>
<script src="js/modules/analysis-profile.js"></script>
<script src="js/modules/pdf-profile.js"></script>
<script src="js/app.js"></script>
```

## Quick sanity check

All JavaScript files pass `node --check`. This checks syntax only, not Supabase credentials or live database access.
